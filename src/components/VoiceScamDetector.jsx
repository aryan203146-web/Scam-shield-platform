import React, { useState } from 'react';
import { PhoneCall, Send, Sparkles, AlertTriangle, Radio } from 'lucide-react';

const SAMPLES = [
  {
    title: 'Custom Department (Arrest)',
    description: 'Impersonates customs/police claiming illegal parcels found.',
    text: 'Agent: This is Officer Rajesh from Delhi Customs Office. We have intercepted a parcel containing illegal narcotics and passports registered under your name. To prevent immediate arrest warrant execution, you must transfer a security deposit of Rs 50,000 for verification. Do not disconnect this call.',
    result: {
      score: 96,
      label: 'Dangerous Impersonation',
      category: 'dangerous',
      details: 'A classic "Police/Customs Impersonation" call. Scammers claim illegal items were found in your name and demand money to clear your name or avoid immediate arrest, keeping you on the call to prevent verification.',
      indicators: [
        { title: 'Fear & Coercion Tactics', desc: 'Threatens immediate arrest warrant and criminal charges to bypass logical thinking.' },
        { title: 'Impersonation of Authority', desc: 'Claims to represent Delhi Customs and police department.' },
        { title: 'Demand for Fast Security Deposit', desc: 'Requests instant bank transfers to clear your name, which official police never do.' }
      ],
      recommendations: [
        'DISCONNECT the call immediately.',
        'Official law enforcement agencies never conduct investigations over phone calls or demand money to clear cases.',
        'Never share bank account details, Aadhaar number, or OTPs.',
        'Report the call and number to local police or cyber cell.'
      ]
    }
  },
  {
    title: 'Relative in Accident',
    description: 'Impersonates police stating relative is arrested or injured.',
    text: 'Caller: Hello! I am Sub-Inspector Sharma. Your son was just involved in a serious car accident and a pedestrian is severely injured. He is in police custody. If you want us to release him without filing a court case, you need to send Rs 30,000 immediately to this UPI ID. Hurry, you only have 15 minutes before the senior officer arrives.',
    result: {
      score: 95,
      label: 'Critical Extortion',
      category: 'dangerous',
      details: 'An extremely emotional emergency scam. Scammers impersonate police or doctors, stating a family member is in critical trouble (arrested or hospitalized) and demand instant payment to resolve it.',
      indicators: [
        { title: 'Extreme Urgency (15 Mins)', desc: 'Imposes a strict short window to prevent you from checking facts.' },
        { title: 'Emotional Extortion', desc: 'Targets parent/relative care instincts by claiming a loved one is in danger/jail.' },
        { title: 'Direct UPI Transfer Demand', desc: 'Requires immediate financial settlement via peer-to-peer UPI ID.' }
      ],
      recommendations: [
        'Hangs up and immediately call your family member directly on their known personal number.',
        'Do not trust the caller\'s phone or accept calls from "sub-inspectors" asking for money.',
        'Never rush payments under panic.'
      ]
    }
  },
  {
    title: 'Customer Care Refund',
    description: 'Tech support scam claiming auto-renewal charges.',
    text: 'Support: Hello, this is Microsoft technical support. We detected multiple severe viruses on your computer that are stealing banking details. Your security subscription was auto-renewed for Rs 15,000. If you did not authorize this, please download the "AnyDesk" remote control tool so we can process your instant refund.',
    result: {
      score: 88,
      label: 'High Suspicion',
      category: 'dangerous',
      details: 'This call is a "Tech Support Remote Access" scam. Scammers claim your computer is compromised or you were charged a subscription, then trick you into installing remote desktop software to log in and steal bank credentials.',
      indicators: [
        { title: 'Remote Access Tool Trick', desc: 'Requests installation of remote tools (AnyDesk, TeamViewer) to access your devices.' },
        { title: 'False Technical Urgency', desc: 'Claims your computer has severe viruses stealing banking information.' },
        { title: 'Reverse Charge Refund Trap', desc: 'Offers fake refunds to access your online banking screen.' }
      ],
      recommendations: [
        'DO NOT install any remote access applications (AnyDesk, RustDesk, TeamViewer).',
        'Official support agents will never request remote login authorization to issue refunds.',
        'Hang up and scan your computer using reliable local antivirus software.'
      ]
    }
  },
  {
    title: 'Bank Verification Call',
    description: 'Legitimate service call from customer care.',
    text: 'Agent: Good afternoon. I am calling from the ICICI Card Activation department to confirm if you received your new credit card ending in 4321. We do not require any personal details or card numbers. We only need you to confirm if the delivery was successful.',
    result: {
      score: 12,
      label: 'Verified Safe',
      category: 'safe',
      details: 'This is a standard customer feedback call. The caller explicitly mentions they do not require passwords, PINs, or card numbers, indicating standard service protocol.',
      indicators: [],
      recommendations: [
        'Confirming delivery status is generally safe.',
        'Ensure you do not volunteer card PINs, CVV, or OTPs, even if requested later.'
      ]
    }
  }
];

export default function VoiceScamDetector({ onScanComplete, elderlyMode }) {
  const [transcript, setTranscript] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSampleClick = (sample) => {
    setTranscript(sample.text);
  };

  const handleScan = () => {
    if (!transcript.trim()) return;

    setScanning(true);
    onScanComplete(null); // Clear previous results

    setTimeout(() => {
      // Find matching sample or analyze dynamically
      const match = SAMPLES.find(
        (s) => s.text.toLowerCase().trim() === transcript.toLowerCase().trim()
      );

      let finalResult;
      if (match) {
        finalResult = match.result;
      } else {
        const lowerText = transcript.toLowerCase();
        let score = 15;
        let category = 'safe';
        let label = 'Verified Safe';
        let indicators = [];
        let details = 'Our analysis engine did not detect any high-pressure tactics, remote access demands, or authority impersonation words.';
        let recommendations = ['This conversation looks normal. Keep practicing safe phone practices (never reveal OTP codes to any caller).'];

        const hasArrest = /arrest|police|police custody|customs|court|jail|case|illegal|officer/i.test(lowerText);
        const hasUrgency = /immediate|hurry|quickly|fast|now|minute|disconnect/i.test(lowerText);
        const hasMoney = /transfer|deposit|rs|inr|cash|upi|id|account|pay/i.test(lowerText);
        const hasRemote = /anydesk|teamviewer|remote|install|download|software/i.test(lowerText);
        const hasAccident = /accident|hospital|son|daughter|family|injured|critical/i.test(lowerText);

        if (hasArrest || hasUrgency || hasMoney || hasRemote || hasAccident) {
          score = 55;
          category = 'suspicious';
          label = 'Suspicious Call';
          details = 'The call transcript contains terms related to urgent financial transactions, authority pressure, or software installations.';
          indicators.push({ title: 'Suspicious Demands', desc: 'Mentions remote access tools, cash transfers, or legal consequences.' });
          recommendations = [
            'Hangs up and verify the caller via official contacts.',
            'Never share banking PINs, OTP codes, or install tools requested by callers.'
          ];
        }

        if ((hasArrest && hasMoney) || (hasAccident && hasMoney) || (hasRemote && hasMoney) || (hasArrest && hasUrgency)) {
          score = 94;
          category = 'dangerous';
          label = 'Extortion / Impersonation Scam';
          details = 'Highly dangerous call transcript pattern. Uses severe fear tactics (arrest, relative accident) or remote software demands combined with pressure to wire/send funds immediately.';
          indicators = [
            { title: 'Authority & Fear Tactics', desc: 'Impersonates law enforcement or critical services to induce immediate compliance.' },
            { title: 'Coerced P2P/UPI Payment', desc: 'Requests instant peer-to-peer or mobile wallet transactions under duress.' }
          ];
          if (hasRemote) {
            indicators.push({ title: 'Remote Access Threat', desc: 'Attempts to gain direct control of device screens to compromise net banking.' });
          }
          recommendations = [
            'HANG UP IMMEDIATELY.',
            'Under no circumstances send money, pay "fines", or download remote control tools.',
            'Inform family members and report the phone number to local telecom fraud cells.'
          ];
        }

        finalResult = { score, label, category, details, indicators, recommendations };
      }

      onScanComplete(finalResult);
      setScanning(false);
    }, 1800);
  };

  return (
    <div className="bg-cyber-card border border-zinc-800 rounded-xl p-5 glow-indigo relative overflow-hidden transition-all duration-300">
      {/* Laser Scanning Line / Radar Ripple */}
      {scanning && (
        <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-xs flex items-center justify-center z-20">
          <div className="text-center relative">
            {/* Pulsing Radar Ring */}
            <div className="w-24 h-24 rounded-full border border-indigo-500/60 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-radar"></div>
              <div className="absolute inset-4 rounded-full border border-indigo-500/40 animate-pulse bg-indigo-500/10"></div>
              <Radio className="w-8 h-8 text-indigo-400 animate-bounce" />
            </div>
            <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase mt-4">
              Analyzing voice tactics...
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 p-2 rounded-lg">
          <PhoneCall className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">Voice Call Scam Detector</h2>
          <p className="text-xs text-slate-400">Analyze call dialogue transcripts for urgency, fear tactics, or authority claims</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={scanning}
            rows={5}
            placeholder="Paste call transcript dialog here (e.g. Agent: hello, User: hi, Agent: we found a parcel...)"
            className="w-full bg-zinc-950 text-slate-200 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans resize-none"
          />
        </div>

        {/* Scan Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setTranscript('')}
            disabled={scanning || !transcript}
            className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handleScan}
            disabled={scanning || !transcript.trim()}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 hover:border-indigo-400/40 rounded-lg cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} className="animate-pulse" />
            Scan Transcript
          </button>
        </div>

        {/* Presets List */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Try Demo Transcripts (Click to paste)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sample)}
                disabled={scanning}
                className="text-left bg-zinc-950 hover:bg-zinc-900/80 border border-zinc-900 hover:border-indigo-500/20 p-2.5 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-20"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-200 block truncate pr-1">
                    {sample.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    sample.result.category === 'dangerous' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}></span>
                </div>
                <span className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                  {sample.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
