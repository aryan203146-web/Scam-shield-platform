import React from 'react';
import { Shield, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function Header({ elderlyMode, setElderlyMode, speak }) {
  const toggleElderlyMode = () => {
    const nextState = !elderlyMode;
    setElderlyMode(nextState);
    if (nextState) {
      // Speak out loud immediately when activated
      setTimeout(() => {
        speak("Elderly Protection Mode activated. Text is now larger, and alerts will be read aloud.");
      }, 100);
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
      {/* Real-time Threat Ticker banner */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-red-950 py-1.5 px-4 text-xs font-mono text-rose-400 border-b border-red-900/40 overflow-hidden relative">
        <div className="flex gap-8 items-center whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-rose-500 animate-pulse" />
            [URGENT DATA FEED] Live UPI scam campaign mimicking "Electricity Bill Update" detected. Threat Level: SEVERE.
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1.5">
            <Shield size={12} className="text-emerald-500" />
            Shield Engine Active: 142,859 domains blocklisted in the last 24 hours.
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-amber-500" />
            Phishing surge targeting Federal Bank OTP redirects. Blocklist updated.
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-indigo-400" />
            AI core version 2.4.1 online. Neural verification engines standard.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-indigo-500 blur-sm opacity-50 animate-pulse"></div>
            <div className="relative bg-zinc-950 p-2 rounded-lg border border-indigo-500/50">
              <Shield className="text-indigo-400 w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
              SCAM<span className="text-indigo-400">SHIELD</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                AI Core v2
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Next-Gen Autonomous Cyber Fraud Detection Platform
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Elderly Protection Toggle */}
          <button
            onClick={toggleElderlyMode}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-300 relative cursor-pointer group ${
              elderlyMode
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-bold scale-105'
                : 'bg-zinc-900/50 text-slate-300 border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800/50'
            }`}
          >
            {elderlyMode ? (
              <>
                <Volume2 className="w-5 h-5 text-black animate-bounce" />
                <span className="tracking-wide">ELDERLY MODE ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                <span className="text-sm">Elderly Protection Mode</span>
              </>
            )}
            
            {/* Pulsing indicator when inactive to draw attention */}
            {!elderlyMode && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
