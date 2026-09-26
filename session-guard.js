// ============================================================================
// DAILY INTAKE TRACKER — Session Guard (1-Hour Idle Auto-Logout)
// Same battle-tested security foundation as Personal Ledger.
// ============================================================================

(function () {
  const IDLE_LIMIT_MS = 60 * 60 * 1000; // 1 hour in milliseconds
  const STORAGE_KEY_ACTIVITY = 'daily_intake_last_activity_timestamp';
  let lastRecordedTime = Date.now();

  function markActive() {
    const now = Date.now();
    // Throttle writes to localStorage to once every 10 seconds
    if (now - lastRecordedTime > 10000) {
      lastRecordedTime = now;
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVITY, now.toString());
      } catch (e) {
        // Ignore storage exceptions
      }
    }
  }

  // Attach event listeners for user interactions
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  activityEvents.forEach((evt) => {
    window.addEventListener(evt, markActive, { passive: true });
  });

  // Initialize timestamp
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVITY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_ACTIVITY, Date.now().toString());
    }
  } catch (e) {}

  // Periodic idle check every 30 seconds
  setInterval(async function checkIdle() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVITY);
      const lastActive = stored ? parseInt(stored, 10) : Date.now();
      const elapsed = Date.now() - lastActive;

      if (elapsed > IDLE_LIMIT_MS) {
        if (window.intakeAuth) {
          const user = await window.intakeAuth.getUser();
          if (user) {
            console.warn('[SessionGuard] Idle timeout exceeded (1 hour). Signing out.');
            await window.intakeAuth.signOut();
            localStorage.setItem(STORAGE_KEY_ACTIVITY, Date.now().toString());
            const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
            if (!isRoot) {
              window.location.href = './index.html?reason=idle_timeout';
            } else {
              window.location.search = '?reason=idle_timeout';
            }
          }
        }
      }
    } catch (err) {
      console.error('[SessionGuard] Error during idle check:', err);
    }
  }, 30000);

  // Register PWA service worker
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((err) => {
        console.warn('Service Worker registration skipped or failed:', err);
      });
    });
  }
})();
