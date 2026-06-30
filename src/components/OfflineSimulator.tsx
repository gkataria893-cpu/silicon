import React from 'react';
import { WifiOff, RotateCw, AlertTriangle } from 'lucide-react';

interface OfflineSimulatorProps {
  isOffline: boolean;
  setIsOffline: (value: boolean) => void;
}

export default function OfflineSimulator({ isOffline, setIsOffline }: OfflineSimulatorProps) {
  const [retrying, setRetrying] = React.useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setIsOffline(false);
    }, 1500);
  };

  if (!isOffline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-3 py-2 rounded-full shadow-lg text-xs font-mono">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Network: Online</span>
        <button
          onClick={() => setIsOffline(true)}
          className="ml-2 px-2 py-0.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded border border-rose-500/30 transition text-[10px]"
          id="btn-simulate-offline"
        >
          Simulate Offline
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center p-6 text-white" id="offline-screen">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-neutral-900 rounded-full border border-neutral-800">
          <WifiOff className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 p-1.5 rounded-full border-4 border-neutral-950">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-sans tracking-tight">Silicon Connect Offline</h2>
          <p className="text-neutral-400 text-sm">
            We are unable to establish a secure link with the Silicon Product servers. Please verify your mobile connection or WiFi network status.
          </p>
        </div>

        <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/40 text-left space-y-2 text-xs text-neutral-400 font-mono">
          <div className="flex justify-between">
            <span>Client State:</span>
            <span className="text-rose-400">DISCONNECTED</span>
          </div>
          <div className="flex justify-between">
            <span>Cached Pages:</span>
            <span className="text-emerald-400">6 (Available Offline)</span>
          </div>
          <div className="flex justify-between">
            <span>Secure Tunnel:</span>
            <span>com.siliconproduct.app/v1</span>
          </div>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-800/50 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-blue-600/20"
          id="btn-offline-retry"
        >
          <RotateCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Establishing Link...' : 'Retry Connection'}
        </button>

        <p className="text-neutral-500 text-[10px] font-mono">
          Silicon Product Android App v2.4.0 • Offline Fallback Enabled
        </p>
      </div>
    </div>
  );
}
