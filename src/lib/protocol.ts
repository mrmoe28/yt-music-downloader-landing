// Protocol handler for desktop app integration

const PROTOCOL = 'ytmusicdownloader';

export interface LaunchParams {
  user?: string;
  action?: string;
  url?: string;
}

/**
 * Detect if the desktop app is installed by attempting to launch the protocol
 * This uses an iframe technique that won't trigger a navigation
 */
export async function detectDesktopApp(): Promise<boolean> {
  return new Promise((resolve) => {
    let detected = false;

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const cleanup = () => {
      document.body.removeChild(iframe);
      resolve(detected);
    };

    // Set a timeout to clean up and resolve
    const timeoutId = setTimeout(cleanup, 2000);

    const handleDetection = () => {
      detected = true;
      clearTimeout(timeoutId);
      cleanup();
    };

    // Try to detect the protocol
    try {
      // Attempt to navigate to the protocol
      iframe.src = `${PROTOCOL}://ping`;

      // If the protocol is registered, the browser will attempt to launch it
      // We can detect this through various browser behaviors
      window.addEventListener('blur', handleDetection, { once: true });

      // For some browsers, we can detect through visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          handleDetection();
        }
      }, { once: true });

    } catch (e) {
      // Protocol not registered
      console.error('Protocol detection error:', e);
      clearTimeout(timeoutId);
      document.body.removeChild(iframe);
      resolve(false);
    }
  });
}

/**
 * Launch the desktop app with parameters
 */
export function launchDesktopApp(params: LaunchParams): void {
  const queryParams = new URLSearchParams();

  if (params.user) {
    queryParams.append('user', params.user);
  }

  if (params.action) {
    queryParams.append('action', params.action);
  }

  if (params.url) {
    queryParams.append('url', encodeURIComponent(params.url));
  }

  const protocolUrl = `${PROTOCOL}://launch?${queryParams.toString()}`;

  // Try multiple methods to launch the protocol

  // Method 1: window.location
  try {
    window.location.href = protocolUrl;
  } catch (e) {
    console.error('Failed to launch via window.location:', e);

    // Method 2: window.open as fallback
    try {
      window.open(protocolUrl, '_self');
    } catch (e2) {
      console.error('Failed to launch via window.open:', e2);

      // Method 3: Create and click anchor
      const anchor = document.createElement('a');
      anchor.href = protocolUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }
}

/**
 * Check if desktop app is installed and offer to download if not
 */
export async function ensureDesktopApp(): Promise<boolean> {
  const isInstalled = await detectDesktopApp();

  if (!isInstalled) {
    // Show download prompt
    const shouldDownload = confirm(
      'YouTube Music Downloader Pro desktop app is not installed. ' +
      'Would you like to download it now?'
    );

    if (shouldDownload) {
      // Redirect to GitHub releases or download page
      window.open('https://github.com/mrmoe28/ytmusidownloaderapp/releases', '_blank');
    }

    return false;
  }

  return true;
}

/**
 * Launch desktop app with authentication from landing page
 */
export async function launchWithAuth(userToken: string, videoUrl?: string): Promise<boolean> {
  const hasApp = await ensureDesktopApp();

  if (!hasApp) {
    return false;
  }

  const params: LaunchParams = {
    user: userToken,
    action: 'download'
  };

  if (videoUrl) {
    params.url = videoUrl;
  }

  launchDesktopApp(params);
  return true;
}