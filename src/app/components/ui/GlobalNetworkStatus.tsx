"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Wifi, X } from "lucide-react";
import { usePGliteHousing } from "@/app/hooks/usePGliteHousing";

const PopupCloseButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="flex items-center justify-center h-6 w-6 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors -mr-1 -mt-1.5"
    aria-label="Close notification"
  >
    <X className="h-3.5 w-3.5" />
  </button>
);

export default function GlobalNetworkStatus() {
  const router = useRouter();
  const { isOffline, isSyncing, syncProgress, syncComplete } = usePGliteHousing();
  
  const [dismissSync, setDismissSync] = useState(false);
  const [dismissOffline, setDismissOffline] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [prevOffline, setPrevOffline] = useState(isOffline);

  useEffect(() => {
    if (prevOffline && !isOffline) {
      setShowOnlineToast(true);
      router.refresh(); // Refresh server components
      const timer = setTimeout(() => setShowOnlineToast(false), 6000);
      return () => clearTimeout(timer);
    }
    setPrevOffline(isOffline);
  }, [isOffline, prevOffline, router]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-[340px] pointer-events-none">
      
      {/* Sync Indicator */}
      {!isOffline && !dismissSync && (isSyncing || syncComplete) && (
        <div className="bg-[#1C2632]/95 backdrop-blur-md border border-white/10 text-white p-4 rounded-xl shadow-2xl pointer-events-auto flex items-center w-full transition-all duration-500">
          <div className="bg-[#C9642A]/20 p-2 rounded-lg mr-4 flex items-center justify-center h-10 w-10 shrink-0">
            {isSyncing ? (
              <Loader2 className="h-5 w-5 text-[#C9642A] animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-[#C9642A]" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">
                {isSyncing ? "Syncing Catalog" : "Offline Ready"}
              </h4>
              <PopupCloseButton onClick={() => setDismissSync(true)} />
            </div>
            {isSyncing ? (
              <div className="w-full mt-1.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-white/50">Downloading assets...</span>
                  <span className="text-[10px] font-bold text-white/70">{syncProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#C9642A] h-1.5 rounded-full transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-white/70 mt-0.5">Housing catalog saved to device.</p>
            )}
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {isOffline && !dismissOffline && (
        <div className="bg-[#1C2632]/95 backdrop-blur-md border border-white/10 text-white p-4 rounded-xl shadow-2xl pointer-events-auto flex items-center w-full transition-all duration-500">
          <div className="bg-[#C9642A]/20 p-2 rounded-lg mr-4 flex items-center justify-center h-10 w-10 shrink-0">
            <Wifi className="h-5 w-5 text-[#C9642A]" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">You're Offline</h4>
              <PopupCloseButton onClick={() => setDismissOffline(true)} />
            </div>
            <p className="text-[11px] text-white/70 mt-0.5">
              The application is running from local device memory. Live data is not syncing.
            </p>
          </div>
        </div>
      )}

      {/* Back Online Toast */}
      {showOnlineToast && (
        <div className="bg-[#1C2632]/95 backdrop-blur-md border border-white/10 text-white p-4 rounded-xl shadow-2xl pointer-events-auto flex items-center w-full transition-all duration-500">
          <div className="bg-[#5FD068]/20 p-2 rounded-lg mr-4 flex items-center justify-center h-10 w-10 shrink-0">
            <Wifi className="h-5 w-5 text-[#5FD068]" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">Connection Restored</h4>
              <PopupCloseButton onClick={() => setShowOnlineToast(false)} />
            </div>
            <p className="text-[11px] text-white/70 mt-0.5">
              You are back online. Live data has been automatically refreshed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
