'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import { Settings, ShieldCheck, CalendarRange, Layers, Save, Check } from 'lucide-react';

export default function SystemConfigPage() {
  const [bypassPeriod, setBypassPeriod] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [dpaRequired, setDpaRequired] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Helper to read cookie values
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  };

  // Helper to set cookie values
  const setCookie = (name: string, value: string) => {
    // Save configurations with 365 days expiration
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
  };

  // Load current settings from cookies on mount
  useEffect(() => {
    const bypassCookie = getCookie('bypass_application_period');
    const allowMultipleCookie = getCookie('allow_multiple_applications');
    const dpaCookie = getCookie('dpa_required');

    if (bypassCookie !== null) {
      setBypassPeriod(bypassCookie === 'true');
    }
    if (allowMultipleCookie !== null) {
      setAllowMultiple(allowMultipleCookie === 'true');
    }
    if (dpaCookie !== null) {
      setDpaRequired(dpaCookie === 'true');
    }
  }, []);

  const handleSave = () => {
    setCookie('bypass_application_period', bypassPeriod.toString());
    setCookie('allow_multiple_applications', allowMultiple.toString());
    setCookie('dpa_required', dpaRequired.toString());

    setToastMessage('System settings saved successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex bg-[#edeae1] min-h-screen text-[#1a2332] font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#1a2332]/6 bg-[#edeae1] shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight">System Configuration</h1>
            <p className="text-xs text-[#1a2332]/50 mt-1">Configure global application overrides, behaviors, and compliance settings.</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl">

          {/* Toast Message */}
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#1a2332] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 animate-[slideIn_0.2s_ease-out]">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={12} className="text-white font-bold" />
              </div>
              <span className="text-sm font-semibold">{toastMessage}</span>
            </div>
          )}

          <div className="space-y-6">

            {/* Setting Item 1: Bypass Application Period */}
            <div className="bg-white rounded-2xl p-6 border border-[#1a2332]/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <CalendarRange size={24} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a2332]">Bypass Application Period</h3>
                    <p className="text-xs text-[#1a2332]/50 mt-1 leading-relaxed">
                      Force override to allow students to submit dormitory applications even if the current date is outside the designated opening and closing application dates.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={bypassPeriod}
                    onChange={(e) => setBypassPeriod(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#d4622a]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4622a]"></div>
                </label>
              </div>
            </div>

            {/* Setting Item 2: Allow Multiple Active Applications */}
            <div className="bg-white rounded-2xl p-6 border border-[#1a2332]/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a2332]">Allow Multiple Applications</h3>
                    <p className="text-xs text-[#1a2332]/50 mt-1 leading-relaxed">
                      Allow students to apply to multiple dormitories concurrently. If disabled, students are strictly limited to one active application at a time.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#d4622a]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4622a]"></div>
                </label>
              </div>
            </div>

            {/* Setting Item 3: Require DPA Checkbox */}
            <div className="bg-white rounded-2xl p-6 border border-[#1a2332]/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a2332]">Enforce Data Privacy Conforme</h3>
                    <p className="text-xs text-[#1a2332]/50 mt-1 leading-relaxed">
                      Strictly require students to check the conforme (Data Privacy Act of 2012 compliance) checkbox during their account registration step 3.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={dpaRequired}
                    onChange={(e) => setDpaRequired(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#d4622a]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4622a]"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#d4622a] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#b04f20] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Save size={16} />
                Save Configurations
              </button>
            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
