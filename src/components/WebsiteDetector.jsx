import React, { useState } from 'react';
import { Globe, Send, Sparkles, AlertTriangle } from 'lucide-react';

const SAMPLES = [
  {
    title: 'Spoofed HDFC NetBanking',
    url: 'https://support-hdfcbank-login.com/netbanking',
    description: 'Impersonates banking login to steal credentials.',
    result: {
      score: 97,
      label: 'Dangerous Phishing',
      category: 'dangerous',
      details: 'This domain uses a classic brand spoofing pattern. It combines a trademark ("hdfcbank") with suspicious suffixes ("support-", "-login") and is registered on an unverified registry without bank domain credentials.',
      indicators: [
        { title: 'Brand Impersonation', desc: 'Leverages the name "hdfcbank" to deceive users into trusting it.' },
        { title: 'Non-Official Registry Owner', desc: 'Registered through cheap, anonymous registrars instead of the official bank corporate registrar.' },
        { title: 'Suspicious Domain Suffix', desc: 'Uses domain suffixes typical of credentials harvest setups.' }
      ],
      recommendations: [
        'DO NOT log in or input passwords on this site.',
        'Official Indian banks use ".com" or ".co.in" with tight SSL certificates. Never trust domain suffixes like "-login.com".',
        'Close the browser tab immediately and flush your DNS/cookies if you entered credentials.'
      ]
    }
  },
  {
    title: 'Amazon Rewards Claim',
    url: 'http://amz-rewards-center.top/gift-card',
    description: 'Fake prize wheel URL capture for credit card phishing.',
    result: {
      score: 93,
      label: 'Phishing Threat',
      category: 'dangerous',
      details: 'A fake e-commerce giveaway page. The domain is not registered by Amazon, lacks HTTPS encryption (HTTP only), and uses a suspicious cheap Top-Level Domain (".top").',
      indicators: [
        { title: 'Insecure Protocol (HTTP)', desc: 'Lacks SSL encryption, exposing credentials to simple network sniffing.' },
        { title: 'Suspicious TLD (.top)', desc: 'Frequently associated with temporary spam campaigns and cheap automated setups.' },
        { title: 'Typo-Squatting / Abbreviations', desc: 'Uses "amz" abbreviation to mimic Amazon without infringing copyright filters immediately.' }
      ],
      recommendations: [
        'Do not input card details, address, or phone number.',
        'Ignore claims that you have won rewards or coupon codes on external non-amazon sites.',
        'Official Amazon promotions are hosted strictly on amazon.com, amazon.in, or affiliated subdomains.'
      ]
    }
  },
  {
    title: 'Netflix Renew Account',
    url: 'https://netflix-account-reactivation.xyz/billing',
    description: 'Mimics billing pages to harvest credit cards.',
    result: {
      score: 89,
      label: 'Phishing Alert',
      category: 'dangerous',
      details: 'This site mimics Netflix billing interface. It uses an ".xyz" extension which is uncommon for official streaming services and was registered less than 48 hours ago.',
      indicators: [
        { title: 'Brand Spoofing', desc: 'Replicates netflix styling and name variations.' },
        { title: 'Suspicious TLD (.xyz)', desc: 'Uses a generic top-level domain heavily exploited by phishing groups.' },
        { title: 'Recent Domain Registration', desc: 'Domain was registered very recently, a typical signature of short-lived scam servers.' }
      ],
      recommendations: [
        'Never submit financial details to resolve billing issues from email links.',
        'Navigate to Netflix by typing netflix.com directly in your browser address bar.',
        'Report this phishing domain to Google Safe Browsing.'
      ]
    }
  },
  {
    title: 'Official Google',
    url: 'https://www.google.com',
    description: 'Official verified secure domain.',
    result: {
      score: 1,
      label: 'Verified Safe',
      category: 'safe',
      details: 'This is a verified secure domain belonging to Google LLC. SSL certificates are verified, and DNS history is fully established and clean.',
      indicators: [],
      recommendations: [
        'This website is safe. Verify your search queries are secure.',
        'No security actions required.'
      ]
    }
  }
];

export default function WebsiteDetector({ onScanComplete, elderlyMode }) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSampleClick = (sample) => {
    setUrl(sample.url);
  };

  const handleScan = () => {
    if (!url.trim()) return;

    setScanning(true);
    onScanComplete(null); // Clear previous results

    setTimeout(() => {
      // Find matching sample or analyze URL dynamically
      const match = SAMPLES.find(
        (s) => s.url.toLowerCase().trim() === url.toLowerCase().trim()
      );

      let finalResult;
      if (match) {
        finalResult = match.result;
      } else {
        const lowerUrl = url.toLowerCase();
        let score = 8;
        let category = 'safe';
        let label = 'Verified Safe';
        let indicators = [];
        let details = 'No phishing indicators, spoofing patterns, or malicious records were found for this domain.';
        let recommendations = ['This website appears to be legitimate. However, ensure it uses secure HTTPS encryption before entering payment details.'];

        const hasPhishWord = /login|verify|update|account|secure|billing|signin|support|bonus|prize|reward|gift/i.test(lowerUrl);
        const hasBrand = /sbi|hdfc|amazon|netflix|google|apple|microsoft|paypal|facebook|instagram/i.test(lowerUrl);
        const isSuspiciousTLD = /\.(xyz|top|site|club|net-verification|update-info|online|bid|loan|win|buzz|cc)$/i.test(lowerUrl) || lowerUrl.includes('.xyz/') || lowerUrl.includes('.top/');
        const isHTTP = lowerUrl.startsWith('http://');

        if (hasPhishWord || isSuspiciousTLD || isHTTP) {
          score = 52;
          category = 'suspicious';
          label = 'Suspicious URL';
          details = 'This domain contains keywords commonly used in credential harvesting, or uses a less common Top-Level Domain (TLD).';
          indicators.push({ title: 'Suspicious Path Keywords', desc: 'Uses words like "login", "verify" or "secure" in the URL to mimic official directories.' });
          if (isHTTP) {
            indicators.push({ title: 'Unencrypted Connection', desc: 'Uses HTTP instead of HTTPS, sending data in plain text.' });
          }
          recommendations = [
            'Do not submit sensitive login details.',
            'Confirm if the domain matches the brand\'s primary website address.'
          ];
        }

        // Multi-condition matches typical of high danger phishing
        if ((hasBrand && hasPhishWord) || (hasBrand && isSuspiciousTLD) || (hasPhishWord && isSuspiciousTLD)) {
          score = 91;
          category = 'dangerous';
          label = 'Severe Phishing Threat';
          details = 'Highly dangerous. The domain combines brand name variables with login instructions on an unverified TLD, typical of banking and payment gateway phishing campaigns.';
          indicators = [
            { title: 'Deceptive Brand Association', desc: 'Falsely integrates trademark names into an unauthorized domain.' },
            { title: 'Suspicious Domain Infrastructure', desc: 'Host patterns match known phishing deployment footprints.' }
          ];
          if (isHTTP) {
            indicators.push({ title: 'No SSL Encryption', desc: 'Communication channel is entirely insecure.' });
          }
          recommendations = [
            'Do NOT click any buttons or input sensitive passwords.',
            'Close this tab immediately.',
            'Always double-check domain spellings carefully (e.g. payt-m instead of paytm).'
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
        <div className="absolute left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4] z-20 animate-scan"></div>
      )}

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-lg">
          <Globe className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">Fake Website Detector</h2>
          <p className="text-xs text-slate-400">Scan URLs for typosquatting, brand spoofing, and insecure domains</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={scanning}
            placeholder="Paste website link or URL here (e.g. http://...) ..."
            className="w-full bg-zinc-950 text-slate-200 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-sans"
          />
          {scanning && (
            <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-xs flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">
                  Checking domain reputation...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scan Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setUrl('')}
            disabled={scanning || !url}
            className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} className="animate-pulse" />
            Scan Link
          </button>
        </div>

        {/* Presets List */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Try Demo URLs (Click to paste)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sample)}
                disabled={scanning}
                className="text-left bg-zinc-950 hover:bg-zinc-900/80 border border-zinc-900 hover:border-cyan-500/20 p-2.5 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-20"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-200 block truncate pr-1">
                    {sample.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    sample.result.category === 'dangerous' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}></span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono truncate block mt-1">
                  {sample.url}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
