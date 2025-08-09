import React, { useState, useEffect } from 'react';
import { checkDatabaseHealth } from '@/lib/database';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await checkDatabaseHealth();
      setIsConnected(connected);

      // Only show warning if disconnected and not already dismissed
      if (!connected && !isDismissed) {
        setShowWarning(true);
        // Auto-dismiss warning after 10 seconds
        setTimeout(() => {
          setShowWarning(false);
          setIsDismissed(true);
        }, 10000);
      }
    } catch (error) {
      console.error('Error checking database health:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection once after a delay to not interfere with app loading
    const timer = setTimeout(() => {
      if (isConnected === null && !isChecking) {
        checkConnection();
      }
    }, 2000); // Wait 2 seconds before checking

    return () => clearTimeout(timer);
  }, []);

  // Don't show if dismissed or not checking/connected
  if (isDismissed || !showWarning) {
    return null;
  }

  // Show success briefly, then hide
  if (isConnected === true) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Database Connected</span>
        </div>
      </div>
    );
  }

  // Show error state only if connection failed and not dismissed
  if (isConnected === false && showWarning) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Using Demo Data
            </h4>
            <p className="text-xs text-blue-700 mb-3">
              Database not connected. App is running with demo data for testing.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={checkConnection}
                disabled={isChecking}
                className="text-xs h-7"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Retry'
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowWarning(false);
                  setIsDismissed(true);
                }}
                className="text-xs h-7"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Simple status indicator for header
export function DatabaseStatusIndicator() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const connected = await checkDatabaseHealth();
      setIsConnected(connected);
    };
    checkStatus();
  }, []);

  if (isConnected === null) {
    return null;
  }

  return (
    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} 
         title={isConnected ? 'Database connected' : 'Database issue detected'} />
  );
}
