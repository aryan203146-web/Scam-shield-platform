import React from 'react';
import { Shield, Sparkles, MessageSquare, Globe, PhoneCall, AlertTriangle } from 'lucide-react';

export default function ScamShieldSimulator({ onTriggerAlert, activeAlert, bgMonitoring = false, setBgMonitoring = () => {} }) {
  const handleSimulate = (type) => {
    let alertData = {};
    if (type === 'sms') {
      alertData = {
        type: 'SMS Message Shield',
        title: 'Banking Scam Detected',
        sender: '+1 (800) 555-0199',
        message: 'Warning: Incoming message from (+1-800-555-0199) resembles known banking scams mimicking SBI Card updates. Do not click the links.',
        speechText: 'Scam Shield Warning! Incoming text message from +1-800-555-0199 resembles a known banking scam. We recommend blocking this sender.',
        remediation: 'Block sender and report to carrier.'
      };
    } else if (type === 'web') {
      alertData = {
        type: 'Web Link Shield',
        title: 'Phishing Redirect Blocked',
        sender: 'Browser Extension',
        message: 'Danger: The site "http://amazon-verification-accounts.top" has been blocklisted by ScamShield AI for credential theft patterns.',
        speechText: 'Scam Shield Warning! The website you are attempting to visit has been blocked. It is a fake website trying to steal your account credentials.',
        remediation: 'Close browser tab immediately.'
      };
    } else if (type === 'call') {
      alertData = {
        type: 'Voice Call Shield',
        title: 'Spoofed Caller Identity',
        sender: 'Spam ID: +91 9988-777-666',
        message: 'Spam Alert: Incoming call matches voice patterns of active tech support impersonation campaigns. Abusive/panic-inducing tone predicted.',
        speechText: 'Scam Shield Warning! Incoming phone call from +91-9988-777-666 is flagged as a high-risk tech support scam. Please hang up.',
        remediation: 'Hang up and report caller.'
      };
    }
    onTriggerAlert(alertData);
  };

  return (
    <div className="bg-cyber-card border border-zinc-800 rounded-xl p-5 glow-indigo relative overflow-hidden transition-all duration-300">
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg relative">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">Scam Shield Extension</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              Real-Time Shield Active
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Simulator controls explanation */}
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          Simulate a browser extension intercepting real-time cyber threats in the background. Triggering a simulation launches an overlay scam shield popup.
        </p>

        {/* Triggers Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleSimulate('sms')}
            disabled={!!activeAlert}
            className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-red-500/20 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-rose-500/10 p-1.5 rounded border border-rose-500/20 group-hover:border-rose-500/40 transition-all">
                <MessageSquare size={16} className="text-rose-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Simulate Banking SMS</span>
                <span className="text-[10px] text-slate-500">Incoming text scan threat</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-black transition-all">
              SMS
            </span>
          </button>

          <button
            onClick={() => handleSimulate('web')}
            disabled={!!activeAlert}
            className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-cyan-500/20 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-cyan-500/10 p-1.5 rounded border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                <Globe size={16} className="text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Simulate Phishing Link</span>
                <span className="text-[10px] text-slate-500">Browser redirect intercept</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20 group-hover:bg-cyan-400 group-hover:text-black transition-all">
              WEB
            </span>
          </button>

          <button
            onClick={() => handleSimulate('call')}
            disabled={!!activeAlert}
            className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-amber-500/20 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-500/10 p-1.5 rounded border border-amber-500/20 group-hover:border-amber-500/40 transition-all">
                <PhoneCall size={16} className="text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Simulate Fake Call</span>
                <span className="text-[10px] text-slate-500">Call ID identity verification</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-black transition-all">
              VOICE
            </span>
          </button>
        </div>

        {/* Background Interceptor Toggler */}
        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${bgMonitoring ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`}></span>
            <div>
              <span className="text-[10px] font-bold text-slate-300 block">Call Intercept Daemon</span>
              <span className="text-[8px] text-slate-500 block">Auto-trigger incoming calls (12s countdown)</span>
            </div>
          </div>
          <button
            onClick={() => setBgMonitoring(!bgMonitoring)}
            className={`px-2 py-1 rounded text-[8px] font-mono font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
              bgMonitoring
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-900 text-slate-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {bgMonitoring ? 'ACTIVE' : 'START'}
          </button>
        </div>

        {/* Active Protection Stats */}
        <div className="mt-4 border-t border-zinc-800/80 pt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-zinc-950/40 p-2 rounded border border-zinc-900">
            <span className="text-slate-500 text-[9px] uppercase font-mono block">Scam Calls blocked</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">1,482</span>
          </div>
          <div className="bg-zinc-950/40 p-2 rounded border border-zinc-900">
            <span className="text-slate-500 text-[9px] uppercase font-mono block">Web links blocked</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">3,912</span>
          </div>
        </div>
      </div>
    </div>
  );
}
