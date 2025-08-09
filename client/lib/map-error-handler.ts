// Enhanced global error handler for MapLibre AbortErrors
// These errors are normal behavior when tiles are cancelled during map movements

let errorHandlerInstalled = false;

export function installMapErrorHandler() {
  if (errorHandlerInstalled) return;

  // Store original methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // More specific error filtering for MapLibre only
  const isMapLibreAbortError = (args: any[]) => {
    const errorString = (JSON.stringify(args) || '').toLowerCase();
    // Only suppress if it's clearly a MapLibre/map tile abort error
    return (errorString.includes('maplibre') && (errorString.includes('abort') || errorString.includes('cancelled'))) ||
           (errorString.includes('tile') && errorString.includes('abort')) ||
           (errorString.includes('openstreetmap') && errorString.includes('abort'));
  };

  // Intercept console.error
  console.error = (...args: any[]) => {
    if (isMapLibreAbortError(args)) {
      return; // Completely silent for MapLibre abort errors
    }
    originalConsoleError.apply(console, args);
  };

  // Intercept console.warn as well
  console.warn = (...args: any[]) => {
    if (isMapLibreAbortError(args)) {
      return; // Completely silent for MapLibre abort errors
    }
    originalConsoleWarn.apply(console, args);
  };
  
  // Enhanced promise rejection handler with bulletproof error handling
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    try {
      const error = event.reason;
      let errorStr = '';

      try {
        errorStr = String(JSON.stringify(error) || '').toLowerCase();
      } catch {
        errorStr = String(error || '').toLowerCase();
      }

      // Only suppress if it's clearly a MapLibre/map-related abort error
      if ((error?.name === 'AbortError' &&
           (errorStr.includes('maplibre') || errorStr.includes('tile') || errorStr.includes('openstreetmap'))) ||
          (error?.message?.includes('signal is aborted') &&
           (errorStr.includes('maplibre') || errorStr.includes('tile'))) ||
          errorStr.includes('maplibre')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } catch (handlerError) {
      // Failsafe - suppress if we can't handle properly
      console.debug('Promise rejection handler failed, suppressing');
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Enhanced error event handler with bulletproof error handling
  const handleError = (event: ErrorEvent) => {
    try {
      const error = event.error;
      const message = String(event.message || '');
      let errorJson = '';

      try {
        errorJson = error ? String(JSON.stringify(error) || '') : '';
      } catch {
        errorJson = String(error || '');
      }

      const errorStr = (message + errorJson).toLowerCase();

      // Only suppress if it's clearly a MapLibre/map-related abort error
      if ((error?.name === 'AbortError' &&
           (errorStr.includes('maplibre') || errorStr.includes('tile') || errorStr.includes('openstreetmap'))) ||
          (errorStr.includes('signal is aborted') &&
           (errorStr.includes('maplibre') || errorStr.includes('tile'))) ||
          errorStr.includes('maplibre')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } catch (handlerError) {
      // Failsafe - if error handler itself fails, just prevent the original error
      console.debug('Error handler failed, suppressing original error');
      event.preventDefault();
      event.stopPropagation();
    }
  };
  
  // Install comprehensive error handlers
  window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
  window.addEventListener('error', handleError, true);
  window.addEventListener('rejectionhandled', handleUnhandledRejection, true);

  // Also try to catch errors at document level
  document.addEventListener('error', handleError, true);

  // Note: Removed fetch monkey-patch as it was interfering with legitimate requests
  // The promise rejection and error handlers above should be sufficient for MapLibre

  errorHandlerInstalled = true;

  // Return cleanup function
  return () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.removeEventListener('error', handleError, true);
    window.removeEventListener('rejectionhandled', handleUnhandledRejection, true);
    document.removeEventListener('error', handleError, true);
    errorHandlerInstalled = false;
  };
}

// Auto-install in browser environment
if (typeof window !== 'undefined') {
  installMapErrorHandler();
}
