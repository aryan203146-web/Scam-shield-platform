import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScamAnalyzer from './components/ScamAnalyzer';
import WebsiteDetector from './components/WebsiteDetector';
import VoiceScamDetector from './components/VoiceScamDetector';
import RiskScoreDashboard from './components/RiskScoreDashboard';
import ScamShieldSimulator from './components/ScamShieldSimulator';
import MediaAuditor from './components/MediaAuditor';
import LiveCallAnalyzer from './components/LiveCallAnalyzer';
import { useSpeech } from './hooks/useSpeech';
import { 
  FileText, 
  Globe, 
  PhoneCall, 
  ShieldAlert, 
  ShieldX, 
  Ban, 
  BellRing,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  CornerDownRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('message');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [elderlyMode, setElderlyMode] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const { speak, stop } = useSpeech();

  // Apply or remove elderly mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (elderlyMode) {
      root.classList.add('elderly-mode');
    } else {
      root.classList.remove('elderly-mode');
    }
  }, [elderlyMode]);

  // Handle TTS when a scan is completed
  const handleScanComplete = (result) => {
    setAnalysisResult(result);
    if (result && elderlyMode) {
      let threatLevelText = '';
      if (result.category === 'dangerous') {
        threatLevelText = `Warning! High threat detected. Risk score is ${result.score} percent. ${result.details} Recommended action: ${result.recommendations[0]}`;
      } else if (result.category === 'suspicious') {
        threatLevelText = `Suspicion flagged. Threat level is ${result.score} percent. ${result.details}`;
      } else {
        threatLevelText = `Scan complete. This content appears to be safe.`;
      }
      speak(threatLevelText, elderlyMode);
    }
  };

  // Trigger simulated background alert
  const handleTriggerAlert = (alertData) => {
    setActiveAlert(alertData);
    if (elderlyMode) {
      speak(alertData.speechText, elderlyMode);
    }
  };

  const handleDismissAlert = (action) => {
    setActiveAlert(null);
    stop();
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12 relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-cyan-950/10 blur-[130px] pointer-events-none"></div>

      {/* Header */}
      <Header 
        elderlyMode={elderlyMode} 
        setElderlyMode={setElderlyMode} 
        speak={speak} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 w-full">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Input Panels & Simulators (8 cols on large screens) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tabs Selector */}
            <div className="bg-[#121217] border border-zinc-800 p-1.5 rounded-xl flex gap-1 shadow-md flex-wrap sm:flex-nowrap">
              <button
                onClick={() => { setActiveTab('message'); setAnalysisResult(null); stop(); }}
                className={`flex-1 py-3 px-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 min-w-[80px] ${
                  activeTab === 'message'
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50'
                }`}
              >
                <FileText size={15} />
                <span>SMS Analyser</span>
              </button>
              <button
                onClick={() => { setActiveTab('website'); setAnalysisResult(null); stop(); }}
                className={`flex-1 py-3 px-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 min-w-[80px] ${
                  activeTab === 'website'
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50'
                }`}
              >
                <Globe size={15} />
                <span>URL Detector</span>
              </button>
              <button
                onClick={() => { setActiveTab('voice'); setAnalysisResult(null); stop(); }}
                className={`flex-1 py-3 px-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 min-w-[80px] ${
                  activeTab === 'voice'
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50'
                }`}
              >
                <PhoneCall size={15} />
                <span>Voice Scan</span>
              </button>
              <button
                onClick={() => { setActiveTab('livecall'); setAnalysisResult(null); stop(); }}
                className={`flex-1 py-3 px-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 min-w-[80px] ${
                  activeTab === 'livecall'
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50'
                }`}
              >
                <Phone size={15} />
                <span>Live Call</span>
              </button>
              <button
                onClick={() => { setActiveTab('deepfake'); setAnalysisResult(null); stop(); }}
                className={`flex-1 py-3 px-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 min-w-[80px] ${
                  activeTab === 'deepfake'
                    ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50'
                }`}
              >
                <Sparkles size={15} />
                <span>AI Media Scan</span>
              </button>
            </div>

            {/* Active Scanner Input Panel */}
            <div className="transition-all duration-300">
              {activeTab === 'message' && (
                <ScamAnalyzer onScanComplete={handleScanComplete} elderlyMode={elderlyMode} />
              )}
              {activeTab === 'website' && (
                <WebsiteDetector onScanComplete={handleScanComplete} elderlyMode={elderlyMode} />
              )}
              {activeTab === 'voice' && (
                <VoiceScamDetector onScanComplete={handleScanComplete} elderlyMode={elderlyMode} />
              )}
              {activeTab === 'livecall' && (
                <LiveCallAnalyzer onScanComplete={handleScanComplete} elderlyMode={elderlyMode} />
              )}
              {activeTab === 'deepfake' && (
                <MediaAuditor onScanComplete={handleScanComplete} elderlyMode={elderlyMode} />
              )}
            </div>

            {/* Simulated Extension Widget */}
            <ScamShieldSimulator 
              onTriggerAlert={handleTriggerAlert} 
              activeAlert={activeAlert} 
            />

          </div>

          {/* RIGHT COLUMN: Output Dashboard (5 cols on large screens) */}
          <div className="lg:col-span-5 h-full lg:sticky lg:top-[90px]">
            <RiskScoreDashboard 
              analysisResult={analysisResult} 
              elderlyMode={elderlyMode} 
            />
          </div>

        </div>
      </main>

      {/* FLOATING REAL-TIME SCAM SHIELD POPUP OVERLAY */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-[#0b0f19] border border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.4)] p-6 md:p-8 animate-scale-up overflow-hidden glow-red">
            {/* Pulsing Alarm Background Overlay */}
            <div className="absolute inset-0 bg-red-500/5 animate-[pulse_1.5s_infinite] pointer-events-none"></div>
            
            {/* Warning Header */}
            <div className="flex items-center gap-4 border-b border-red-500/20 pb-4 mb-4 relative z-10">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-rose-500 animate-[bounce_1s_infinite]">
                <ShieldAlert size={28} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
                  {activeAlert.type} (ScamShield Agent)
                </span>
                <h3 className="text-xl md:text-2xl font-black font-display text-white tracking-wide uppercase">
                  {activeAlert.title}
                </h3>
              </div>
            </div>

            {/* Alert Message Details */}
            <div className="space-y-4 mb-6 relative z-10">
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">Source/Sender</span>
                <span className="text-sm font-bold text-rose-400 font-mono mt-0.5 block">{activeAlert.sender}</span>
              </div>

              <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/10">
                <span className="text-xs text-rose-300 font-semibold block mb-1 flex items-center gap-1">
                  <AlertOctagon size={14} /> Threat Verification Summary:
                </span>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {activeAlert.message}
                </p>
              </div>

              <div className="flex gap-2 items-center bg-zinc-950 p-2.5 rounded text-xs text-slate-400 font-mono">
                <CornerDownRight size={12} className="text-indigo-400" />
                <span>Fix: {activeAlert.remediation}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                onClick={() => handleDismissAlert('block')}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl border border-rose-500/20 hover:border-rose-400/40 cursor-pointer shadow-lg hover:shadow-rose-500/20 text-sm transition-all flex items-center justify-center gap-2"
              >
                <Ban size={16} />
                BLOCK & REPORT
              </button>
              <button
                onClick={() => handleDismissAlert('ignore')}
                className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white font-semibold rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer text-sm transition-all"
              >
                Ignore Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-slate-600 text-xs font-sans">
        <p>© 2026 ScamShield AI Inc. All rights secured. Mock Demonstration for Hackathon.</p>
      </footer>
    </div>
  );
}
