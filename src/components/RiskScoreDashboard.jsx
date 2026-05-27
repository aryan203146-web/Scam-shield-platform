import React from 'react';
import { CheckCircle, AlertTriangle, ShieldAlert, Sparkles, Send, Copy, AlertOctagon } from 'lucide-react';

export default function RiskScoreDashboard({ analysisResult, elderlyMode }) {
  if (!analysisResult) {
    return (
      <div className="bg-cyber-card border border-zinc-800 rounded-xl p-8 text-center glow-indigo transition-all duration-300 h-full flex flex-col justify-center items-center relative overflow-hidden">
        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 text-indigo-500/60 mb-4 animate-pulse mx-auto" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">Awaiting Fraud Analysis</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Input a message, website link, or call transcript on the left pane and click "Scan" to run AI detection.
          </p>
        </div>
      </div>
    );
  }

  const { score, label, category, details, indicators, recommendations } = analysisResult;

  // Color mapping based on category
  let cardClass = 'glow-green border-emerald-500/30';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let textClass = 'text-emerald-400';
  let icon = <CheckCircle className="w-8 h-8 text-emerald-400" />;
  let strokeColor = '#10b981';

  if (category === 'suspicious') {
    cardClass = 'glow-yellow border-amber-500/30';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    textClass = 'text-amber-400';
    icon = <AlertTriangle className="w-8 h-8 text-amber-400" />;
    strokeColor = '#f59e0b';
  } else if (category === 'dangerous') {
    cardClass = 'glow-red border-red-500/30';
    badgeBg = 'bg-red-500/10 text-rose-400 border-red-500/30';
    textClass = 'text-rose-400';
    icon = <ShieldAlert className="w-8 h-8 text-rose-400" />;
    strokeColor = '#ef4444';
  }

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-cyber-card border rounded-xl p-6 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between ${cardClass}`}>
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles size={12} className="animate-spin-slow" />
              Analysis Engine Report
            </h3>
            <h2 className="text-xl font-bold font-display text-white">Fraud Risk Index</h2>
          </div>
          <span className={`text-xs font-mono uppercase font-bold border px-3 py-1 rounded-full ${badgeBg}`}>
            {label}
          </span>
        </div>

        {/* Score & Gauge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 bg-zinc-950/40 rounded-lg p-4 border border-zinc-800/50">
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke={strokeColor}
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-display text-white leading-none">{score}%</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-1">Threat</span>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
              {icon}
              <h3 className={`text-xl font-extrabold font-display uppercase tracking-wide ${textClass}`}>
                {category === 'dangerous' ? 'Danger Flagged' : category === 'suspicious' ? 'Suspicion Flagged' : 'Safe Result'}
              </h3>
            </div>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {details}
            </p>
          </div>
        </div>

        {/* Threat Indicators / Evidence */}
        {indicators && indicators.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2">
              Detected Phishing Signals ({indicators.length})
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {indicators.map((ind, i) => (
                <div key={i} className="flex gap-2.5 items-start bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80">
                  <div className="mt-0.5 bg-red-500/20 text-red-400 p-0.5 rounded border border-red-500/30">
                    <AlertOctagon size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{ind.title}</span>
                    <span className="text-[11px] text-slate-400 leading-snug">{ind.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immediate Remediation Action Steps */}
        <div className="mt-auto border-t border-zinc-800/80 pt-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2.5">
            Recommended Actions
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
