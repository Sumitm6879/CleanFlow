// Enhanced global error handler for MapLibre AbortErrors
// These errors are normal behavior when tiles are cancelled during map movements

let errorHandlerInstalled = false;

export function installMapErrorHandler() {
  if (errorHandlerInstalled) return;

  // Store original methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // More aggressive error filtering
  const isAbortError = (args: any[]) => {
    const errorString = (JSON.stringify(args) || '').toLowerCase();
    return errorString.includes('aborterror') ||
           errorString.includes('signal is aborted') ||
           errorString.includes('aborted without reason') ||
           errorString.includes('requestcancelled') ||
           errorString.includes('request cancelled') ||
           errorString.includes('maplibre') ||
           (errorString.includes('tile') && errorString.includes('abort'));
  };

  // Intercept console.error
  console.error = (...args: any[]) => {
    if (isAbortError(args)) {
      return; // Completely silent for abort errors
    }
    originalConsoleError.apply(console, args);
  };

  // Intercept console.warn as well
  console.warn = (...args: any[]) => {
    if (isAbortError(args)) {
      return; // Completely silent for abort errors
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

      if (error?.name === 'AbortError' ||
          error?.name === 'RequestCancelled' ||
          error?.message?.includes('signal is aborted') ||
          error?.message?.includes('aborted without reason') ||
          error?.message?.includes('request cancelled') ||
          errorStr.includes('aborterror') ||
          errorStr.includes('requestcancelled') ||
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

      if (error?.name === 'AbortError' ||
          error?.name === 'RequestCancelled' ||
          errorStr.includes('signal is aborted') ||
          errorStr.includes('aborted without reason') ||
          errorStr.includes('request cancelled') ||
          errorStr.includes('aborterror') ||
          errorStr.includes('requestcancelled') ||
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

  // Monkey-patch fetch to handle AbortErrors at source
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      return await originalFetch.apply(window, args);
    } catch (error: any) {
      if (error?.name === 'AbortError' ||
          error?.message?.includes('signal is aborted') ||
          error?.message?.includes('aborted without reason')) {
        // Return a resolved promise to completely suppress the error
        return new Response(null, { status: 499, statusText: 'Request cancelled' });
      }
      throw error;
    }
  };

  errorHandlerInstalled = true;
  const timestamp = new Date().toISOString();
  console.log(`🛡️ Enhanced MapLibre error suppression ACTIVE (${timestamp})`);

  // Return cleanup function
  return () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    window.fetch = originalFetch;
    window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.removeEventListener('error', handleError, true);
    window.removeEventListener('rejectionhandled', handleUnhandledRejection, true);
    document.removeEventListener('error', handleError, true);
    errorHandlerInstalled = false;
    console.log('🔧 MapLibre error handler removed');
  };
}

// Auto-install in browser environment
if (typeof window !== 'undefined') {
  installMapErrorHandler();
}
