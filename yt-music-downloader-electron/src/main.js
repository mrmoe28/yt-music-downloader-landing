const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

// Development mode check
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // Load the React app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../renderer/dist/index.html')}`;

  console.log('Loading URL:', startUrl, 'isDev:', isDev);
  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for YouTube downloads
ipcMain.handle('get-video-info', async (event, url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', [
      '--dump-single-json',
      '--no-warnings',
      url
    ]);

    let output = '';
    let errorOutput = '';

    ytdlp.stdout.on('data', (data) => {
      output += data.toString();
    });

    ytdlp.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve({
            id: uuidv4(),
            url: url,
            title: info.title || 'Unknown',
            duration: info.duration_string || null,
            thumbnail: info.thumbnail || null,
            uploader: info.uploader || null
          });
        } catch (error) {
          reject(`Failed to parse video info: ${error.message}`);
        }
      } else {
        reject(`yt-dlp error: ${errorOutput}`);
      }
    });
  });
});

ipcMain.handle('download-audio', async (event, { url, outputPath, quality }) => {
  const downloadId = uuidv4();

  return new Promise((resolve, reject) => {
    // Send initial progress
    event.sender.send('download-progress', {
      id: downloadId,
      status: 'starting',
      progress: 0,
      speed: null,
      eta: null,
      file_path: null
    });

    // Set quality arguments
    let qualityArgs = [];
    switch (quality) {
      case '320':
        qualityArgs = ['--audio-quality', '0', '--audio-format', 'mp3'];
        break;
      case '256':
        qualityArgs = ['--audio-quality', '2', '--audio-format', 'mp3'];
        break;
      case 'flac':
        qualityArgs = ['--audio-format', 'flac'];
        break;
      default:
        qualityArgs = ['--audio-quality', '0', '--audio-format', 'mp3'];
    }

    const outputTemplate = path.join(outputPath, '%(title)s.%(ext)s');
    const args = [
      '--extract-audio',
      '--embed-metadata',
      '--embed-thumbnail',
      '--output', outputTemplate,
      ...qualityArgs,
      '--progress',
      url
    ];

    const ytdlp = spawn('yt-dlp', args);

    ytdlp.stdout.on('data', (data) => {
      const output = data.toString();

      // Parse progress from yt-dlp output
      const progressMatch = output.match(/(\d+\.?\d*)%/);
      if (progressMatch) {
        const progress = parseFloat(progressMatch[1]);
        event.sender.send('download-progress', {
          id: downloadId,
          status: 'downloading',
          progress: progress,
          speed: extractSpeed(output),
          eta: extractETA(output),
          file_path: null
        });
      }
    });

    ytdlp.stderr.on('data', (data) => {
      console.log('yt-dlp stderr:', data.toString());
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        event.sender.send('download-progress', {
          id: downloadId,
          status: 'completed',
          progress: 100,
          speed: null,
          eta: null,
          file_path: outputPath
        });
        resolve(downloadId);
      } else {
        event.sender.send('download-progress', {
          id: downloadId,
          status: 'error',
          progress: 0,
          speed: null,
          eta: null,
          file_path: null
        });
        reject('Download failed');
      }
    });
  });
});

// Helper functions
function extractSpeed(output) {
  const speedMatch = output.match(/(\d+\.?\d*\w+\/s)/);
  return speedMatch ? speedMatch[1] : null;
}

function extractETA(output) {
  const etaMatch = output.match(/ETA (\d+:\d+)/);
  return etaMatch ? etaMatch[1] : null;
}

// USB drive detection
ipcMain.handle('get-usb-drives', async () => {
  const drives = [];

  try {
    if (process.platform === 'darwin') {
      // macOS - check /Volumes
      const volumes = fs.readdirSync('/Volumes');
      for (const volume of volumes) {
        const volumePath = `/Volumes/${volume}`;
        try {
          const stats = fs.statSync(volumePath);
          if (stats.isDirectory() && volume !== 'Macintosh HD') {
            drives.push({
              name: volume,
              path: volumePath,
              capacity: 0, // Could be enhanced with actual size detection
              available: 0
            });
          }
        } catch (error) {
          // Skip inaccessible volumes
        }
      }
    } else if (process.platform === 'win32') {
      // Windows - check removable drives
      const { execSync } = require('child_process');
      try {
        const output = execSync('wmic logicaldisk get deviceid,description,size,freespace /format:csv', { encoding: 'utf8' });
        const lines = output.split('\n').filter(line => line.includes('Removable Disk'));
        for (const line of lines) {
          const parts = line.split(',');
          if (parts.length >= 4) {
            drives.push({
              name: `USB Drive (${parts[1]})`,
              path: parts[1],
              capacity: parseInt(parts[3]) || 0,
              available: parseInt(parts[2]) || 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to detect USB drives on Windows:', error);
      }
    } else {
      // Linux - check mounted USB devices
      try {
        const mounts = fs.readFileSync('/proc/mounts', 'utf8');
        const usbMounts = mounts.split('\n').filter(line =>
          line.includes('/media/') || line.includes('/mnt/')
        );
        for (const mount of usbMounts) {
          const parts = mount.split(' ');
          if (parts.length >= 2) {
            const mountPoint = parts[1];
            drives.push({
              name: path.basename(mountPoint),
              path: mountPoint,
              capacity: 0,
              available: 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to detect USB drives on Linux:', error);
      }
    }
  } catch (error) {
    console.error('Failed to detect USB drives:', error);
  }

  return drives;
});

// File operations
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Download Folder'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }

  // Return default download folder if cancelled
  return path.join(os.homedir(), 'Downloads');
});

ipcMain.handle('copy-to-usb', async (event, { sourcePath, usbPath }) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(usbPath, fileName);

    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve(true);
    });

    writeStream.on('error', (error) => {
      reject(`Failed to copy file: ${error.message}`);
    });
  });
});

// Subscription verification (placeholder - integrate with your existing API)
ipcMain.handle('verify-subscription', async (event, token) => {
  // This would integrate with your existing Vercel API
  // For now, return a mock response
  return {
    active: true,
    tier: 'pro',
    downloads_used: 0,
    downloads_limit: null
  };
});