import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
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
  ExternalLink
} from 'lucide-react';
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

  useEffect(() => {
    // Listen for download progress events
    const unlisten = listen<DownloadProgress>('download-progress', (event) => {
      setDownloads(prev => {
        const newMap = new Map(prev);
        newMap.set(event.payload.id, event.payload);
        return newMap;
      });

      if (event.payload.status === 'completed' || event.payload.status === 'error') {
        setIsDownloading(false);
      }
    });

    // Load USB drives and subscription status on mount
    loadUSBDrives();
    checkSubscription();

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const loadUSBDrives = async () => {
    try {
      const drives = await invoke<USBDrive[]>('get_usb_drives');
      setUSBDrives(drives);
    } catch (error) {
      console.error('Failed to load USB drives:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      // In a real app, you'd get the token from authentication
      const mockToken = 'mock-token';
      const status = await invoke<SubscriptionStatus>('verify_subscription', { token: mockToken });
      setSubscription(status);
    } catch (error) {
      console.error('Failed to verify subscription:', error);
      // Mock subscription for demo
      setSubscription({
        active: false,
        tier: 'free',
        downloads_used: 0,
        downloads_limit: 1
      });
    }
  };

  const handleGetVideoInfo = async () => {
    if (!url.trim()) return;

    setIsLoadingInfo(true);
    setVideoInfo(null);

    try {
      const info = await invoke<DownloadInfo>('get_video_info', { url: url.trim() });
      setVideoInfo(info);
    } catch (error) {
      alert(`Failed to get video info: ${error}`);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !outputPath) return;

    // Check subscription limits
    if (subscription && !subscription.active && subscription.downloads_used >= (subscription.downloads_limit || 0)) {
      alert('Download limit reached. Please upgrade to Pro for unlimited downloads.');
      return;
    }

    setIsDownloading(true);

    try {
      const downloadId = await invoke<string>('download_audio', {
        url: videoInfo.url,
        outputPath,
        quality
      });

      console.log('Download started:', downloadId);
    } catch (error) {
      alert(`Download failed: ${error}`);
      setIsDownloading(false);
    }
  };

  const handleCopyToUSB = async (filePath: string) => {
    if (!selectedUSB) {
      alert('Please select a USB drive first');
      return;
    }

    try {
      await invoke('copy_to_usb', {
        sourcePath: filePath,
        usbPath: selectedUSB
      });
      alert('File copied to USB successfully!');
    } catch (error) {
      alert(`Failed to copy to USB: ${error}`);
    }
  };

  const selectOutputFolder = async () => {
    try {
      const selected = await invoke<string>('select_folder');
      setOutputPath(selected);
    } catch (error) {
      console.error('Failed to select folder:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'downloading':
      case 'converting':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">YouTube Music Downloader Pro</h1>
            </div>

            {subscription && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-600">Downloads: </span>
                  <span className="font-semibold">
                    {subscription.downloads_used} / {subscription.downloads_limit || '∞'}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscription.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.tier.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* URL Input Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter YouTube URL</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  url && !url.includes('youtube.com') && !url.includes('youtu.be')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && !isLoadingInfo && url.trim() && handleGetVideoInfo()}
              />
              {url && !url.includes('youtube.com') && !url.includes('youtu.be') && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid YouTube URL</p>
              )}
            </div>
            <button
              onClick={handleGetVideoInfo}
              disabled={isLoadingInfo || !url.trim() || (url && !url.includes('youtube.com') && !url.includes('youtu.be'))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 min-w-[120px]"
            >
              {isLoadingInfo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Get Info</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Info Section */}
        {videoInfo && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Information</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {videoInfo.thumbnail && (
                <div className="flex-shrink-0">
                  <img
                    src={videoInfo.thumbnail}
                    alt="Video thumbnail"
                    className="w-full sm:w-40 h-32 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg leading-tight">{videoInfo.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Uploader:</span> {videoInfo.uploader || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {videoInfo.duration || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Settings */}
        {videoInfo && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Download Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Output Folder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Folder
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outputPath}
                    onChange={(e) => setOutputPath(e.target.value)}
                    placeholder="/path/to/downloads"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      !outputPath ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
                    }`}
                  />
                  <button
                    onClick={selectOutputFolder}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
                    title="Browse for folder"
                  >
                    <FolderOpen className="w-5 h-5" />
                  </button>
                </div>
                {!outputPath && (
                  <p className="text-sm text-orange-600 mt-1">Please select an output folder</p>
                )}
              </div>

              {/* Quality Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="320">320kbps MP3 (High Quality)</option>
                  <option value="256">256kbps MP3 (Good Quality)</option>
                  <option value="flac">FLAC (Lossless)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {quality === 'flac' && 'Largest file size, best quality'}
                  {quality === '320' && 'Balanced quality and file size'}
                  {quality === '256' && 'Smaller file size, good quality'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !outputPath}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download Audio</span>
                  </>
                )}
              </button>

              {subscription && !subscription.active && (
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600 mb-1">
                    Downloads remaining: {(subscription.downloads_limit || 0) - subscription.downloads_used}
                  </p>
                  {subscription.downloads_used >= (subscription.downloads_limit || 0) && (
                    <p className="text-sm text-red-600">Limit reached. Please upgrade to continue.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* USB Drives Section */}
        {usbDrives.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Usb className="w-5 h-5 text-blue-600" />
              <span>USB Drives</span>
              <span className="text-sm font-normal text-gray-500">({usbDrives.length} found)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {usbDrives.map((drive, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedUSB(drive.path)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedUSB === drive.path
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      selectedUSB === drive.path ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Usb className={`w-4 h-4 ${
                        selectedUSB === drive.path ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-medium text-gray-900">{drive.name}</span>
                    {selectedUSB === drive.path && (
                      <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate" title={drive.path}>{drive.path}</p>
                </div>
              ))}
            </div>

            {selectedUSB && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Selected:</span> {usbDrives.find(d => d.path === selectedUSB)?.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Download Progress */}
        {downloads.size > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <span>Downloads</span>
              <span className="text-sm font-normal text-gray-500">({downloads.size} active)</span>
            </h2>

            <div className="space-y-4">
              {Array.from(downloads.values()).map((download) => (
                <div key={download.id} className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                  download.status === 'completed' ? 'border-green-200 bg-green-50' :
                  download.status === 'error' ? 'border-red-200 bg-red-50' :
                  download.status === 'downloading' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        download.status === 'completed' ? 'bg-green-100' :
                        download.status === 'error' ? 'bg-red-100' :
                        download.status === 'downloading' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {getStatusIcon(download.status)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                        </span>
                        {download.status === 'downloading' && (
                          <span className="text-sm text-gray-600 ml-2">
                            ({download.progress.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>

                    {download.file_path && download.status === 'completed' && (
                      <button
                        onClick={() => handleCopyToUSB(download.file_path!)}
                        disabled={!selectedUSB}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                      >
                        <Usb className="w-4 h-4" />
                        <span>Copy to USB</span>
                      </button>
                    )}
                  </div>

                  {download.status === 'downloading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        {download.speed && <span>Speed: {download.speed}</span>}
                        {download.eta && <span>ETA: {download.eta}</span>}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full progress-bar transition-all duration-300"
                          style={{ width: `${download.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {download.status === 'completed' && download.file_path && (
                    <div className="mt-2 p-2 bg-green-100 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Saved to:</span> {download.file_path}
                      </p>
                    </div>
                  )}

                  {download.status === 'error' && (
                    <div className="mt-2 p-2 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">
                        Download failed. Please try again.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No subscription prompt */}
        {subscription && !subscription.active && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mt-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Upgrade to Pro</h3>
                <p className="text-yellow-700 mb-4">
                  You have used <strong>{subscription.downloads_used}</strong> of <strong>{subscription.downloads_limit}</strong> free downloads.
                  Upgrade to Pro for unlimited downloads, higher quality options, and priority support.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-yellow-700">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    <span>Unlimited Downloads</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-yellow-700">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    <span>FLAC Quality</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-yellow-700">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    <span>Priority Support</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-full bg-yellow-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${(subscription.downloads_used / (subscription.downloads_limit || 1)) * 100}%` }}
                    />
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <ExternalLink className="w-4 h-4" />
                    <span>Upgrade Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;