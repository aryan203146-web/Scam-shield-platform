import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, ShieldAlert, Sparkles, Volume2, HelpCircle, Activity, Ban } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'ftc',
    name: 'FTC Inspector (AI Clone)',
    number: '+1 (800) 992-0129',
    description: 'Impersonates a federal investigator demanding immediate tax settlements.',
    isAI: true,
    lines: [
      { speaker: 'Caller', text: "Hello, this is Senior Inspector Miller from the Federal Trade Commission Division of Security.", aiProb: 35 },
      { speaker: 'Caller', text: "We have flagged a federal tax evasion mandate and an immediate arrest warrant under your legal name.", aiProb: 65 },
      { speaker: 'Caller', text: "You must immediately withdraw your remaining bank assets and wire $4,500 to our department's secure lockbox to clear your status. If you disconnect, local law enforcement will be dispatched.", aiProb: 97 }
    ],
    result: {
      score: 97,
      label: 'AI Voice Clone Impersonation',
      category: 'dangerous',
      details: 'Critical Alert: This call dialogue and audio profile matches the footprint of generative AI voice clones. The caller is posing as a Federal Trade Commission agent, demanding swift bank wire transfers to clear an arrest warrant. Government bodies never conduct legal actions via phone calls or request wire payouts.',
      indicators: [
        { title: 'Generative Synthesis Match', desc: 'Acoustic analysis indicates a synthetic voice footprint (97% matching standard generative clone libraries).' },
        { title: 'Authority Mimicry Coercion', desc: 'Impersonates an inspector to override critical logical thinking.' },
        { title: 'Coerced Wire Demand', desc: 'Demands direct payment under immediate threat of police arrest.' }
      ],
      recommendations: [
        'HANG UP immediately and block the phone number.',
        'Official government agencies never request funds or wire settlements via phone.',
        'Report this phone number and details to the national fraud division.'
      ]
    }
  },
  {
    id: 'grandson',
    name: 'Grandchild Crisis (AI Clone)',
    number: '+91 98765-43210',
    description: 'Mimics grandchild\'s voice claiming they are in jail and need immediate emergency funds.',
    isAI: true,
    lines: [
      { speaker: 'Caller', text: "Grandma? It's me, please don't hang up. I'm in real trouble and I lost my phone.", aiProb: 52 },
      { speaker: 'Caller', text: "I was in a bad car accident. The police are holding me at the station, and they say they're going to jail me unless I pay the insurance fee.", aiProb: 82 },
      { speaker: 'Caller', text: "I need you to send a UPI transfer of Rs. 35,000 right now to this inspector's number. Please hurry, they are taking my signature next!", aiProb: 98 }
    ],
    result: {
      score: 98,
      label: 'Emergency Voice Clone',
      category: 'dangerous',
      details: 'Critical Alert: Voice prints match a cloned profile of a relative (98% synthesis correlation). Scammers capture small samples of public voices (from social media) to clone family members and manufacture emergency scenarios to extort immediate bank or UPI wires.',
      indicators: [
        { title: 'AI Voice Clone Overlay', desc: 'Pitch and phase markers correlate with deep learning cloning APIs.' },
        { title: 'Panic Social Engineering', desc: 'Exploits high-emotion family emergency context to force compliance.' },
        { title: 'Direct Mobile Transfer', desc: 'Directs the immediate wire of Rs. 35,000 to an unverified private number.' }
      ],
      recommendations: [
        'HANG UP IMMEDIATELY.',
        'Directly dial your relative on their known personal number to check their status.',
        'Set up a family "Safe Word" that must be stated to verify emergency identity.'
      ]
    }
  },
  {
    id: 'bank',
    name: 'Card Activation Line (Human)',
    number: '+1 (888) 555-0155',
    description: 'Legitimate customer care checking delivery status of a card.',
    isAI: false,
    lines: [
      { speaker: 'Caller', text: "Good afternoon. I am calling from the ICICI Card Activation department to confirm if you received your new credit card ending in 4321.", aiProb: 8 },
      { speaker: 'Caller', text: "Please note we do not require any personal passwords, Netbanking PINs, or OTP details during this call.", aiProb: 6 },
      { speaker: 'Caller', text: "We only require a simple confirmation of delivery status. Did the courier hand it to you?", aiProb: 5 }
    ],
    result: {
      score: 5,
      label: 'Verified Safe Speaker',
      category: 'safe',
      details: 'Call Scan Complete: The call acoustics reflect clean human speech waves with natural breath pause frequencies. The caller states banking guidelines (never request PIN/OTP codes), suggesting standard operational procedures.',
      indicators: [],
      recommendations: [
        'Safe call. Confirming delivery status is acceptable.',
        'Do not share secure pins or verification codes if requested later.'
      ]
    }
  }
];

export default function LiveCallAnalyzer({ 
  onScanComplete, 
  elderlyMode,
  bgMonitoring = false,
  setBgMonitoring = () => {},
  incomingCallTrigger = null,
  onResetIncomingTrigger = () => {}
}) {
  const [status, setStatus] = useState('idle'); // idle, ringing, active, ended
  const [scenario, setScenario] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [aiProbability, setAiProbability] = useState(5);
  const [activeLineIdx, setActiveLineIdx] = useState(-1);
  const [waveHeights, setWaveHeights] = useState([5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
  const [speaking, setSpeaking] = useState(false);

  const timerRef = useRef(null);
  const speechRef = useRef(null);

  // Clean up speech synthesis and timers on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Listen for incoming call trigger from background monitoring
  useEffect(() => {
    if (incomingCallTrigger) {
      const match = SCENARIOS.find(s => s.id === incomingCallTrigger);
      if (match) {
        triggerIncomingCall(match);
      }
      if (onResetIncomingTrigger) {
        onResetIncomingTrigger();
      }
    }
  }, [incomingCallTrigger]);

  // Ringing effect oscilliator fallback (simulated ring tone)
  const playRingSound = () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4);
      
      osc1.start();
      osc2.start();
      
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 1500);
    } catch (e) {
      console.log('AudioContext error:', e);
    }
  };

  // Ringing cycle
  useEffect(() => {
    if (status !== 'ringing') return;
    
    // Play ring sound every 3 seconds
    playRingSound();
    const ringInterval = setInterval(() => {
      playRingSound();
    }, 3000);

    return () => clearInterval(ringInterval);
  }, [status]);

  // Call timer and wave bounces
  useEffect(() => {
    if (status !== 'active') return;

    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Wave bounce interval
    const waveInterval = setInterval(() => {
      setWaveHeights(prev => 
        prev.map(() => speaking ? Math.floor(Math.random() * 32) + 6 : 4)
      );
    }, 120);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(waveInterval);
    };
  }, [status, speaking]);

  // Initialize selected scenario call
  const triggerIncomingCall = (selected) => {
    setScenario(selected);
    setStatus('ringing');
    setSeconds(0);
    setTranscript([]);
    setAiProbability(5);
    setActiveLineIdx(-1);
    onScanComplete(null);
  };

  const answerCall = () => {
    setStatus('active');
    advanceLine(0);
  };

  const declineCall = () => {
    stopAll();
    setStatus('idle');
    setScenario(null);
  };

  const endCall = (isBlocked = false) => {
    stopAll();
    setStatus('ended');
    setSpeaking(false);
    
    // Final report is submitted to the Dashboard
    const finalReport = scenario.result;
    if (isBlocked) {
      // Modify result slightly if the user actively blocked the call
      onScanComplete({
        ...finalReport,
        label: 'Threat Neutralized & Blocked',
        details: `Call Blocked. ${finalReport.details} Your ScamShield Agent disconnected the line at second ${seconds} and auto-reported the credentials.`
      });
    } else {
      onScanComplete(finalReport);
    }
  };

  // Advance speech dialogue line-by-line
  const advanceLine = (lineIndex) => {
    if (!scenario || lineIndex >= scenario.lines.length) {
      // Script finished, keep line open or end call
      setTimeout(() => {
        endCall(false);
      }, 2000);
      return;
    }

    const currentLine = scenario.lines[lineIndex];
    setActiveLineIdx(lineIndex);
    setSpeaking(true);

    // Add to scrolling transcript
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTranscript(prev => [...prev, {
      speaker: currentLine.speaker,
      text: currentLine.text,
      time: timeStr
    }]);

    // Animate signature probability
    let targetProb = currentLine.aiProb;
    let currentProb = aiProbability;
    const probTimer = setInterval(() => {
      if (currentProb < targetProb) {
        currentProb++;
        setAiProbability(currentProb);
      } else {
        clearInterval(probTimer);
      }
    }, 20);

    // Play TTS
    const utterance = new SpeechSynthesisUtterance(currentLine.text);
    if (scenario.isAI) {
      utterance.pitch = 0.82; // Lower, robotic pitch
      utterance.rate = 0.95;  // Slower, synthesized speech rate
    } else {
      utterance.pitch = 1.05; // Standard human
      utterance.rate = 1.05;
    }

    utterance.onend = () => {
      clearInterval(probTimer);
      setAiProbability(targetProb); // Ensure final number snaps in
      setSpeaking(false);
      
      // Hold 2 seconds before caller speaks the next sentence
      setTimeout(() => {
        advanceLine(lineIndex + 1);
      }, 2000);
    };

    utterance.onerror = () => {
      clearInterval(probTimer);
      setSpeaking(false);
      setTimeout(() => {
        advanceLine(lineIndex + 1);
      }, 2000);
    };

    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarningActive = aiProbability >= 80;

  return (
    <div className={`bg-cyber-card border rounded-xl p-5 glow-indigo relative overflow-hidden transition-all duration-300 min-h-[460px] flex flex-col justify-between ${
      isWarningActive ? 'border-red-500 animate-warning-flash animate-red-border' : 'border-zinc-800'
    }`}>
      {/* Laser Scanning lines */}
      {status === 'active' && (
        <div className={`absolute left-0 right-0 h-0.5 z-20 face-scan-line ${
          isWarningActive ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
        }`}></div>
      )}

      {/* Screen Idle State - Selection */}
      {status === 'idle' && (
        <div className="flex flex-col gap-4 h-full justify-between flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-500/10 border border-indigo-500/30 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Live Call Shield Analyzer</h2>
              <p className="text-xs text-slate-400">Simulate incoming calls to test voice-clone interception capabilities</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Choose a mock telephone caller profile below. Clicking start initiates an incoming call simulator. When you answer, ScamShield will begin monitoring the voice waves in real-time, displaying a Speech-To-Text transcript, and analyzing the speech synthesis index.
          </p>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Select Incoming Call Scenario
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {SCENARIOS.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => triggerIncomingCall(sc)}
                  className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-indigo-500/20 p-3.5 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-slate-400 group-hover:text-indigo-400">
                      <Volume2 size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{sc.name}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[240px] md:max-w-[320px]">{sc.description}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                    sc.isAI ? 'bg-red-500/10 text-rose-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {sc.isAI ? 'AI CLONE' : 'HUMAN'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Interceptor Toggler */}
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 flex justify-between items-center mt-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${bgMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <div>
                <span className="text-xs font-bold text-slate-300 block">Daemon Background Monitor</span>
                <span className="text-[9px] text-slate-500 block">Auto-intercepts call probes (12s countdown)</span>
              </div>
            </div>
            <button
              onClick={() => setBgMonitoring(!bgMonitoring)}
              className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                bgMonitoring
                  ? 'bg-emerald-600 text-white shadow-sm animate-pulse'
                  : 'bg-zinc-900 text-slate-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {bgMonitoring ? 'MONITORING ACTIVE' : 'ENABLE DAEMON'}
            </button>
          </div>
 
          <div className="border-t border-zinc-800/80 pt-4 text-center mt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Interceptor Port Connected: Standard Online
            </span>
          </div>
        </div>
      )}

      {/* Screen Ringing State */}
      {status === 'ringing' && scenario && (
        <div className="flex flex-col items-center justify-center gap-6 py-8 flex-1">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring halos */}
            <div className="absolute w-24 h-24 rounded-full border border-indigo-500/30 animate-green-pulse"></div>
            <div className="absolute w-36 h-36 rounded-full border border-indigo-500/15 animate-[green-pulse_2s_infinite_0.8s]"></div>
            <div className="relative p-5 bg-zinc-950 border border-emerald-500/50 rounded-full text-emerald-400">
              <Phone className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block animate-pulse">
              Incoming Secure call...
            </span>
            <h3 className="text-2xl font-black font-display text-white">{scenario.number}</h3>
            <span className="text-xs text-slate-400 font-mono block">Potential Match: {scenario.name}</span>
          </div>

          <div className="flex gap-4 w-full max-w-xs justify-center mt-4">
            <button
              onClick={declineCall}
              className="py-3 px-6 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl cursor-pointer text-xs font-mono font-semibold flex items-center gap-2 transition-all"
            >
              <PhoneOff size={14} />
              Decline
            </button>
            <button
              onClick={answerCall}
              className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 rounded-xl cursor-pointer text-xs font-mono font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.25)] transition-all"
            >
              <Phone size={14} className="animate-spin-slow" />
              Answer Call
            </button>
          </div>
        </div>
      )}

      {/* Screen Active Calling State */}
      {status === 'active' && scenario && (
        <div className="flex flex-col justify-between flex-1 gap-4">
          {/* Active Call HUD Info */}
          <div className="flex justify-between items-center bg-zinc-950/80 p-3 rounded-lg border border-zinc-900">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${
                isWarningActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              }`}></div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase">Caller Source</span>
                <span className="text-xs font-bold text-white font-mono">{scenario.number}</span>
              </div>
            </div>

            {/* Simulated Live Audio Stream Waveform */}
            <div className="flex items-end justify-center gap-1 h-6 px-4">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-0.5 rounded-t transition-all duration-100 ${
                    isWarningActive ? 'bg-rose-500' : 'bg-indigo-500'
                  }`}
                ></div>
              ))}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Call Timer</span>
              <span className="text-xs font-bold text-slate-300 font-mono">{formatTime(seconds)}</span>
            </div>
          </div>

          {/* Dynamic AI Voice clone analyzer index */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            isWarningActive 
              ? 'bg-red-950/20 border-red-500/30' 
              : 'bg-zinc-950/50 border-zinc-900'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wide flex items-center gap-1.5">
                <Activity size={13} className="text-indigo-400" />
                Real-Time Voice Print Signature
              </span>
              <span className={`text-xs font-mono font-black ${
                isWarningActive ? 'text-red-400' : 'text-slate-400'
              }`}>
                AI CLONE: {aiProbability}%
              </span>
            </div>
            
            {/* Meter Bar */}
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div
                style={{ width: `${aiProbability}%` }}
                className={`h-full transition-all duration-300 ${
                  aiProbability >= 80 ? 'bg-red-500' : aiProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></div>
            </div>

            {/* Flash warnings */}
            {isWarningActive && (
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-red-400 font-mono font-bold mt-2 animate-pulse">
                <ShieldAlert size={14} />
                <span>WARNING: AI VOICE CLONE INPROGRESS! SECURE TERMINAL HANGUP STRONGLY ADVISED.</span>
              </div>
            )}
          </div>

          {/* Live Transcript Stream terminal */}
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Live Transcript (Speech-To-Text)</span>
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-2 h-[150px] overflow-y-auto flex flex-col justify-start">
              {transcript.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`py-1.5 px-2.5 rounded border ${
                    line.speaker === 'Caller' 
                      ? 'bg-zinc-900/50 border-zinc-800/80 text-slate-200' 
                      : 'bg-indigo-950/10 border-indigo-500/15 text-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-0.5">
                    <span className="font-bold tracking-wide">{line.speaker.toUpperCase()}</span>
                    <span>{line.time}</span>
                  </div>
                  <p className="leading-relaxed">{line.text}</p>
                </div>
              ))}
              {transcript.length === 0 && (
                <div className="text-center text-slate-600 py-8 italic">Line connected. Caller is preparing voice sync...</div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => endCall(false)}
              className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white font-semibold rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer text-xs font-mono transition-all"
            >
              Hang Up
            </button>
            <button
              onClick={() => endCall(true)}
              className={`flex-1 py-3 px-4 font-black rounded-xl border cursor-pointer text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                isWarningActive 
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.3)]' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 border-zinc-800'
              }`}
            >
              <Ban size={14} />
              BLOCK & HANG UP
            </button>
          </div>
        </div>
      )}

      {/* Screen Call Ended State */}
      {status === 'ended' && scenario && (
        <div className="flex flex-col items-center justify-center gap-4 py-8 flex-1 text-center">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-full text-slate-500">
            <PhoneOff className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold font-display text-white">Call Terminated</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Total Duration: {formatTime(seconds)}</p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs text-slate-300 max-w-sm leading-relaxed mt-2">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold block mb-1">
              Live Intercept Audit
            </span>
            <span>A post-call risk audit has been generated. The analysis results have been loaded into the **Threat Report** tab on your right dashboard panel.</span>
          </div>

          <button
            onClick={() => setStatus('idle')}
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer text-xs font-mono transition-all mt-4"
          >
            Start New Simulator
          </button>
        </div>
      )}
    </div>
  );
}
