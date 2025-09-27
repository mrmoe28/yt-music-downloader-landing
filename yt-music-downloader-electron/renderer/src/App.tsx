import { useState, useEffect } from 'react';
import {
  Download,
  Music,
  Settings,
  FolderOpen,
  Usb,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import './App.css';

interface DownloadInfo {
  id: string;
  url: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  uploader?: string;
}

interface DownloadProgress {
  id: string;
  status: string;
  progress: number;
  speed?: string;
  eta?: string;
  file_path?: string;
}

interface USBDrive {
  name: string;
  path: string;
  capacity: number;
  available: number;
}

interface SubscriptionStatus {
  active: boolean;
  tier: string;
  downloads_used: number;
  downloads_limit?: number;
}

// Declare global window interface for Electron API
declare global {
  interface Window {
    electronAPI: {
      getVideoInfo: (url: string) => Promise<DownloadInfo>;
      downloadAudio: (options: { url: string; outputPath: string; quality: string }) => Promise<string>;
      onDownloadProgress: (callback: (event: any, data: DownloadProgress) => void) => () => void;
      selectFolder: () => Promise<string>;
      copyToUsb: (options: { sourcePath: string; usbPath: string }) => Promise<boolean>;
      getUsbDrives: () => Promise<USBDrive[]>;
      verifySubscription: (token: string) => Promise<SubscriptionStatus>;
      platform: string;
      removeAllListeners: (channel: string) => void;
    };
  }
}

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<DownloadInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [downloads, setDownloads] = useState<Map<string, DownloadProgress>>(new Map());
  const [usbDrives, setUSBDrives] = useState<USBDrive[]>([]);
  const [selectedUSB, setSelectedUSB] = useState<string>('');
  const [outputPath, setOutputPath] = useState<string>('');
  const [quality, setQuality] = useState('320');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');

    // Listen for download progress events
    let removeListener: (() => void) | null = null;

    if (window.electronAPI) {
      removeListener = window.electronAPI.onDownloadProgress((_event: any, data: DownloadProgress) => {
        setDownloads(prev => {
          const newMap = new Map(prev);
          newMap.set(data.id, data);
          return newMap;
        });

        if (data.status === 'completed' || data.status === 'error') {
          setIsDownloading(false);
        }
      });
    }

    // Load USB drives and subscription status on mount
    loadUSBDrives();
    checkSubscription();

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const loadUSBDrives = async () => {
    if (window.electronAPI) {
      try {
        const drives = await window.electronAPI.getUsbDrives();
        setUSBDrives(drives);
      } catch (error) {
        console.error('Failed to load USB drives:', error);
      }
    }
  };

  const checkSubscription = async () => {
    if (window.electronAPI) {
      try {
        const status = await window.electronAPI.verifySubscription('');
        setSubscription(status);
      } catch (error) {
        console.error('Failed to check subscription:', error);
      }
    }
  };

  const handleGetVideoInfo = async () => {
    if (!url.trim() || !window.electronAPI) return;

    setIsLoadingInfo(true);
    try {
      const info = await window.electronAPI.getVideoInfo(url);
      setVideoInfo(info);
    } catch (error) {
      console.error('Failed to get video info:', error);
      alert('Failed to get video information. Please check the URL and try again.');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !outputPath || !window.electronAPI) return;

    setIsDownloading(true);
    try {
      await window.electronAPI.downloadAudio({
        url: videoInfo.url,
        outputPath,
        quality
      });
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  const handleSelectFolder = async () => {
    if (!window.electronAPI) return;

    try {
      const folder = await window.electronAPI.selectFolder();
      setOutputPath(folder);
    } catch (error) {
      console.error('Failed to select folder:', error);
    }
  };

  const downloadArray = Array.from(downloads.values());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">YouTube Music Downloader Pro</h1>
              <p className="text-muted-foreground">
                Downloads: {subscription?.downloads_used || 0} / {subscription?.downloads_limit || '∞'} •
                <span className="text-primary font-medium ml-1">PRO</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* URL Input Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" />
              <span>Enter YouTube URL</span>
            </CardTitle>
            <CardDescription>
              Paste a YouTube music video URL to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && !isLoadingInfo && url.trim() && handleGetVideoInfo()}
              />
              <Button
                onClick={handleGetVideoInfo}
                disabled={!!(isLoadingInfo || !url.trim() || (url && !url.includes('youtube.com') && !url.includes('youtu.be')))}
                className="px-6"
              >
                {isLoadingInfo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Info
                  </>
                )}
              </Button>
            </div>
            {url && !url.includes('youtube.com') && !url.includes('youtu.be') && (
              <p className="text-sm text-destructive">Please enter a valid YouTube URL</p>
            )}
          </CardContent>
        </Card>

        {/* Video Info Card */}
        {videoInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Video Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {videoInfo.thumbnail && (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{videoInfo.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {videoInfo.uploader && <p>Channel: {videoInfo.uploader}</p>}
                    {videoInfo.duration && <p>Duration: {videoInfo.duration}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Download Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Download Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Audio Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="320">320 kbps MP3 (High Quality)</option>
                  <option value="256">256 kbps MP3 (Good Quality)</option>
                  <option value="flac">FLAC (Lossless)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Output Folder</label>
                <div className="flex space-x-2">
                  <Input
                    readOnly
                    value={outputPath || 'No folder selected'}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleSelectFolder}>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                disabled={!videoInfo || !outputPath || isDownloading}
                className="w-full"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Audio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* USB Drives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Usb className="w-5 h-5" />
                <span>USB Drives ({usbDrives.length} found)</span>
              </CardTitle>
              <CardDescription>
                Transfer downloaded files to external storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usbDrives.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No USB drives detected</p>
                ) : (
                  usbDrives.map((drive, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Usb className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{drive.name}</p>
                          <p className="text-xs text-muted-foreground">{drive.path}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUSB(drive.path)}
                      >
                        Select
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Progress */}
        {downloadArray.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Download Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {downloadArray.map((download) => (
                  <div key={download.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {download.status === 'completed' ? 'Completed' :
                         download.status === 'error' ? 'Failed' :
                         'Downloading...'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {download.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {download.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {download.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${download.progress}%` }}
                      />
                    </div>
                    {download.speed && download.eta && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Speed: {download.speed}</span>
                        <span>ETA: {download.eta}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;