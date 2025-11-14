/**
 * Register service worker for PWA offline support with automatic update checking
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope,
          );

          // Check for updates every hour
          setInterval(
            () => {
              registration.update().catch((error) => {
                console.error('Service Worker update check failed:', error);
              });
            },
            60 * 60 * 1000,
          );

          // Check for updates on page visibility change (when user returns to tab)
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              registration.update().catch((error) => {
                console.error('Service Worker update check failed:', error);
              });
            }
          });

          // Listen for controller change (new SW took over)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New service worker activated, reloading...');
            // Reload the page to show the new version
            window.location.reload();
          });

          // Handle update found
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available, prompt user
                  console.log(
                    'New content available; prompting user to update.',
                  );
                  showUpdatePrompt(newWorker);
                }
              });
            }
          });

          // Initial update check
          registration.update().catch((error) => {
            console.error('Initial service worker update check failed:', error);
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

/**
 * Get version info from service worker
 */
async function getServiceWorkerVersion(
  worker: ServiceWorker,
): Promise<{ version: string; buildTimestamp: string } | null> {
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };

    // Timeout after 1 second
    setTimeout(() => resolve(null), 1000);

    worker.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
  });
}

/**
 * Show a prompt asking the user to update to a new version
 */
async function showUpdatePrompt(newWorker: ServiceWorker) {
  // Create a prompt notification
  if (
    typeof window !== 'undefined' &&
    !document.getElementById('sw-update-prompt')
  ) {
    // Try to get version info from the new service worker
    const versionInfo = await getServiceWorkerVersion(newWorker);
    const versionText = versionInfo?.version
      ? ` (${versionInfo.version.substring(0, 7)})`
      : '';

    const prompt = document.createElement('div');
    prompt.id = 'sw-update-prompt';
    prompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideIn 0.3s ease-out;
      max-width: 350px;
    `;
    prompt.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-weight: 600; font-size: 16px;">🎉 New Version Available!</div>
        <div style="font-size: 14px; opacity: 0.95;">
          A new version${versionText} is ready. Update now for the latest features and improvements.
        </div>
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <button 
            id="sw-update-btn"
            style="flex: 1; background: white; color: #2563eb; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;"
          >
            Update Now
          </button>
          <button 
            id="sw-dismiss-btn"
            style="background: rgba(255,255,255,0.15); color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;"
          >
            Later
          </button>
        </div>
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(prompt);

    // Handle update button click
    document.getElementById('sw-update-btn')?.addEventListener('click', () => {
      // Tell the new service worker to skip waiting
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      prompt.remove();

      // Show loading indicator
      const loading = document.createElement('div');
      loading.style.cssText = prompt.style.cssText;
      loading.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-weight: 600;">Updating...</div>
        </div>
      `;
      document.body.appendChild(loading);
    });

    // Handle dismiss button click
    document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
      prompt.remove();
    });
  }
}

/**
 * Manually trigger an update check
 * Can be called from anywhere in the app
 */
export function checkForUpdates() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update().catch((error) => {
        console.error('Manual service worker update check failed:', error);
      });
    });
  }
}

/**
 * Get the current service worker version
 * Returns the git commit hash and build timestamp
 */
export async function getCurrentVersion(): Promise<{
  version: string;
  buildTimestamp: string;
} | null> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const controller = navigator.serviceWorker.controller;
    if (controller) {
      return getServiceWorkerVersion(controller);
    }
  }
  return null;
}
