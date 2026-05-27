import React, { useState } from 'react';
import { FileText, Send, Sparkles, AlertTriangle, Eye } from 'lucide-react';

const SAMPLES = [
  {
    title: 'Electricity Overdue',
    description: 'Electricity bill UPI scam targeting fear and urgency.',
    text: 'ALERT: Dear customer, your electricity connection will be DISCONNECTED tonight at 9:30 PM due to non-payment of previous bill. Instantly call Electricity Officer at 98765-XXXXX to pay and avoid outage.',
    result: {
      score: 94,
      label: 'Critical Threat',
      category: 'dangerous',
      details: 'This message matches a very common electricity bill fraud campaign. Scam actors exploit fears of immediate utility disconnection to coerce victims into calling a fake number and sending instant UPI transfers.',
      indicators: [
        { title: 'Urgency Manipulation', desc: 'Threatens service cutoff tonight at 9:30 PM, forcing panic.' },
        { title: 'Suspicious Personal Number', desc: 'Directs calls to a mobile line instead of official utility helpline numbers.' },
        { title: 'Coercive Action', desc: 'Demands direct action to avoid utility outage.' }
      ],
      recommendations: [
        'DO NOT call the number provided in this text message.',
        'Official utilities never request UPI payments via personal phone numbers.',
        'Verify your account status directly in your official electricity provider portal or app.',
        'Report this sender immediately to the National Cyber Crime portal.'
      ]
    }
  },
  {
    title: 'KYC Bank Block',
    description: 'HDFC / SBI banking verification phishing scam.',
    text: 'Dear customer, your HDFC bank account is BLOCKED today because your KYC has expired. Please verify immediately by visiting: http://hdfc-bank-verification.net/login.html to restore your NetBanking.',
    result: {
      score: 98,
      label: 'Critical Phishing',
      category: 'dangerous',
      details: 'Phishing message mimicking HDFC Bank. Contains a suspicious non-secure link that captures NetBanking passwords and OTP tokens.',
      indicators: [
        { title: 'Spoofed Brand Identity', desc: 'Claims to represent HDFC Bank but sends from an arbitrary number.' },
        { title: 'Fake Domain Link', desc: 'Uses a non-secured HTTP URL that mimics HDFC but belongs to a malicious domain.' },
        { title: 'Urgency Pressure', desc: 'Claims your account is blocked "today" to rush verification.' }
      ],
      recommendations: [
        'DO NOT click the hyperlink under any circumstances.',
        'Banks never ask for NetBanking credentials or OTP updates via SMS.',
        'Check bank status by typing the official, secured URL directly in your browser: https://www.hdfcbank.com.',
        'Delete the SMS and report the number.'
      ]
    }
  },
  {
    title: 'KBC Lottery Prize',
    description: 'Kaun Banega Crorepati WhatsApp scam requesting advance processing fees.',
    text: 'CONGRATULATIONS! You have won Rs 25,00,000 lottery from KBC and Jio. Your lottery number is JIO-9099. Contact KBC Head Office Manager Mr. Akash Verma on WhatsApp +91-88888-88888 to claim cash.',
    result: {
      score: 87,
      label: 'High Suspicion',
      category: 'dangerous',
      details: 'A classic advance-fee lottery scam. It convinces victims they have won a cash lottery, but later demands standard processing fees or taxes which the scammers pocket.',
      indicators: [
        { title: 'Advance-Fee Trap', desc: 'Claims you won a massive lottery without having bought any ticket.' },
        { title: 'WhatsApp Redirection', desc: 'Directs communication to a personal WhatsApp contact to bypass carrier SMS filters.' },
        { title: 'Impersonation of Brands', desc: 'Leverages TV show KBC and Jio brands for false legitimacy.' }
      ],
      recommendations: [
        'Treat any claim of unrequested lottery wins as a scam.',
        'Never transfer any processing fees, registration fees, or advance taxes to claim prizes.',
        'Block and report the contact on WhatsApp immediately.'
      ]
    }
  },
  {
    title: 'Family Plan Dinner',
    description: 'Legitimate personal chat message.',
    text: 'Hey! Are we still on for dinner tonight at 7 PM? Mom wants to try that new restaurant downtown. Let me know if I should reserve a table.',
    result: {
      score: 5,
      label: 'Verified Safe',
      category: 'safe',
      details: 'This message presents no indicators of phishing, panic-inducing language, links, or utility coercion. It appears to be standard conversational chat.',
      indicators: [],
      recommendations: [
        'This message is safe to read and reply to.',
        'Verify with your contact directly if you did not expect them to message you.'
      ]
    }
  }
];

export default function ScamAnalyzer({ onScanComplete, elderlyMode }) {
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSampleClick = (sample) => {
    setText(sample.text);
  };

  const handleScan = () => {
    if (!text.trim()) return;

    setScanning(true);
    onScanComplete(null); // Clear previous results

    setTimeout(() => {
      // Find matching sample result or generate a generic mock result if customized
      const match = SAMPLES.find(
        (s) => s.text.toLowerCase().trim() === text.toLowerCase().trim()
      );

      let finalResult;
      if (match) {
        finalResult = match.result;
      } else {
        // Generic AI analysis generator based on text content
        const lowerText = text.toLowerCase();
        let score = 10;
        let category = 'safe';
        let label = 'Verified Safe';
        let indicators = [];
        let details = 'Our neural scam-scanning networks found no major threat vectors in this text.';
        let recommendations = ['This text looks safe. However, always exercise general caution before sharing sensitive information.'];

        const hasUrgency = /urgent|verify|blocked|suspend|today|limited|expire|action/i.test(lowerText);
        const hasMoney = /win|lottery|rs|inr|cash|gift|usd|fund|credit|payment|bill/i.test(lowerText);
        const hasLink = /http|https|\.net|\.org|\.in|\.com|\.xyz/i.test(lowerText);
        const hasBank = /bank|hdfc|sbi|icici|gpay|phonepe|paytm|card|account|bill/i.test(lowerText);

        if (hasLink || hasUrgency || hasMoney || hasBank) {
          score = 45;
          category = 'suspicious';
          label = 'Suspicious';
          details = 'This message contains some marketing language or link variables. Review details before clicking links.';
          indicators.push({ title: 'Generic Alert', desc: 'Contains links or call-to-actions that require careful verification.' });
          recommendations = [
            'Avoid logging in via links sent in SMS messages.',
            'Visit the company\'s official website directly instead.'
          ];
        }

        if ((hasLink && hasUrgency) || (hasUrgency && hasMoney) || (hasBank && hasUrgency)) {
          score = 88;
          category = 'dangerous';
          label = 'Dangerous';
          details = 'Highly suspicious. Text matches patterns of urgent social engineering tactics requesting immediate financial actions or logins.';
          indicators = [
            { title: 'High Urgency Dialect', desc: 'Directs high urgency actions and threats of account suspension.' },
            { title: 'Suspicious Hyperlink', desc: 'Directs users to click unverified external links.' }
          ];
          recommendations = [
            'Do not share passwords, OTP tokens, or cards.',
            'Report the number to cyber authorities.',
            'Ignore and delete this conversation.'
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
      {/* Laser Scanning Line */}
      {scanning && (
        <div className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_#6366f1] z-20 animate-scan"></div>
      )}

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">Scam Message Analyzer</h2>
          <p className="text-xs text-slate-400">Scan SMS, WhatsApp, or email texts for social engineering</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={scanning}
            rows={5}
            placeholder="Paste SMS / WhatsApp message text here..."
            className="w-full bg-zinc-950 text-slate-200 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans resize-none"
          />
          {scanning && (
            <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-xs flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">
                  AI neural engine scanning...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scan Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setText('')}
            disabled={scanning || !text}
            className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handleScan}
            disabled={scanning || !text.trim()}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 hover:border-indigo-400/40 rounded-lg cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} className="animate-pulse" />
            Analyze Message
          </button>
        </div>

        {/* Presets List */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Try Demo Templates (Click to paste)
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
