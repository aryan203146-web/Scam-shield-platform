import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Activity, Server, AlertTriangle } from 'lucide-react';

const ATTACK_LOGS = [
  { city: 'Mumbai', country: 'IN', type: 'UPI Scam SMS Blocked', risk: 94, ip: '103.88.22.41', action: 'Intercepted & Logged' },
  { city: 'New York', country: 'US', type: 'CEO Voice Clone Terminated', risk: 98, ip: '198.162.45.109', action: 'Caller Blocked' },
  { city: 'Delhi', country: 'IN', type: 'Electricity Impersonation Redirected', risk: 91, ip: '43.224.156.12', action: 'Outbound Blocked' },
  { city: 'London', country: 'UK', type: 'Fake Tax Rebate Form Defeated', risk: 89, ip: '82.165.90.23', action: 'Phishing Domain Flagged' },
  { city: 'Tokyo', country: 'JP', type: 'AI Deepfake Call Intercepted', risk: 95, ip: '210.140.10.98', action: 'Disconnected' },
  { city: 'Berlin', country: 'DE', type: 'Spoofed Bank Portal Blocked', risk: 97, ip: '195.50.80.124', action: 'SSL Revoked' },
  { city: 'Sydney', country: 'AU', type: 'Fake Package Update URL Blocked', risk: 85, ip: '1.120.30.54', action: 'Domain Blocklisted' },
  { city: 'Nairobi', country: 'KE', type: 'Mobile Wallet Fraud Neutralized', risk: 92, ip: '197.248.8.7', action: 'Account Suspended' }
];

export default function ThreatMap() {
  const [logs, setLogs] = useState([]);
  const [attackCount, setAttackCount] = useState(148590);
  const [activeNode, setActiveNode] = useState(0);

  // Initialize with some logs
  useEffect(() => {
    setLogs(ATTACK_LOGS.slice(0, 4));
  }, []);

  // Update counters and logs dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Select random attack item
      const randomItem = ATTACK_LOGS[Math.floor(Math.random() * ATTACK_LOGS.length)];
      const randomNodeIdx = Math.floor(Math.random() * 6); // Matches node indices in the SVG map
      setActiveNode(randomNodeIdx);

      // Create log entry with timestamp
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newLog = {
        ...randomItem,
        time: timeStr,
        // Make IP slightly variable
        ip: randomItem.ip.substring(0, randomItem.ip.lastIndexOf('.')) + '.' + Math.floor(Math.random() * 255)
      };

      // Add to logs, limit to last 5
      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
      
      // Increment threats blocked counter
      setAttackCount(c => c + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Node coordinates on simplified 100x60 SVG grid
  const NODES = [
    { id: 0, name: 'New York', x: 22, y: 22, color: 'text-cyan-400' },
    { id: 1, name: 'London', x: 44, y: 16, color: 'text-indigo-400' },
    { id: 2, name: 'Berlin', x: 50, y: 15, color: 'text-indigo-400' },
    { id: 3, name: 'Delhi/Mumbai', x: 67, y: 28, color: 'text-amber-400' },
    { id: 4, name: 'Tokyo', x: 86, y: 20, color: 'text-rose-400' },
    { id: 5, name: 'Sydney', x: 90, y: 48, color: 'text-emerald-400' }
  ];

  const centerNode = { x: 55, y: 35 }; // ScamShield Security Core Hub

  return (
    <div className="bg-[#0b0f19] border border-zinc-800 rounded-xl p-5 glow-indigo relative overflow-hidden flex flex-col justify-between h-full min-h-[460px]">
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-4 h-full">
        {/* Title and Active Status */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-md font-bold font-display text-white tracking-wide">Threat Intel Center</h2>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block mt-0.5">
                Live Global Attack Map
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Blocked Threats</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tracking-tight">
              {attackCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Global Network Visual - SVG Map Grid */}
        <div className="relative bg-zinc-950/60 border border-zinc-900 rounded-lg p-3 overflow-hidden flex items-center justify-center min-h-[200px]">
          {/* Futuristic Background grid lines */}
          <div className="absolute inset-0 grid-scan-bg opacity-15 pointer-events-none"></div>
          
          <svg viewBox="0 0 100 55" className="w-full h-auto max-h-[190px] relative z-10 select-none">
            {/* Outline representing mock continents */}
            <path 
              d="M 12 12 Q 18 10 25 15 T 32 25 T 28 35 T 20 40 Z M 40 10 Q 50 8 60 12 T 70 20 T 65 30 T 55 45 T 45 35 T 38 18 Z M 75 18 Q 85 15 92 22 T 88 38 T 80 45 Z" 
              fill="none" 
              stroke="rgba(63, 63, 70, 0.25)" 
              strokeWidth="0.8" 
              strokeDasharray="2,2"
            />
            
            {/* Network lasers pointing to center ScamShield server */}
            {NODES.map((node) => (
              <line
                key={`line-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={centerNode.x}
                y2={centerNode.y}
                className="stroke-indigo-500/20"
                strokeWidth="0.5"
              />
            ))}

            {/* Glowing lines for the ACTIVE alert node */}
            <line
              x1={NODES[activeNode].x}
              y1={NODES[activeNode].y}
              x2={centerNode.x}
              y2={centerNode.y}
              className="stroke-rose-500/80 stroke-dasharray-[1,1] animate-[pulse_0.8s_infinite]"
              strokeWidth="1.2"
            />

            {/* Central Core Shield Hub */}
            <circle 
              cx={centerNode.x} 
              cy={centerNode.y} 
              r="2.5" 
              className="fill-indigo-500 shadow-[0_0_10px_#6366f1]" 
            />
            <circle 
              cx={centerNode.x} 
              cy={centerNode.y} 
              r="5" 
              className="fill-transparent stroke-indigo-400/40 animate-ping" 
              strokeWidth="0.5"
            />

            {/* Attack Destination pulse */}
            <circle
              cx={NODES[activeNode].x}
              cy={NODES[activeNode].y}
              r="4"
              className="fill-transparent stroke-rose-500 animate-ping"
              strokeWidth="0.8"
            />

            {/* Render Nodes */}
            {NODES.map((node) => {
              const isActive = node.id === activeNode;
              return (
                <g key={`node-${node.id}`} className="cursor-pointer">
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? "2" : "1.2"}
                    className={`${isActive ? 'fill-rose-500' : 'fill-indigo-400/80'}`}
                  />
                  {/* Subtle City labels */}
                  <text
                    x={node.x}
                    y={node.y - 3}
                    textAnchor="middle"
                    className="text-[3px] font-mono font-semibold fill-slate-400 pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Network Overlay Stats HUD */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] font-mono text-slate-500 bg-zinc-950/80 py-1 px-2 rounded border border-zinc-900">
            <span className="flex items-center gap-1">
              <Server size={10} className="text-indigo-400" />
              SHIELD CORE: ACTIVE
            </span>
            <span className="flex items-center gap-1">
              <Cpu size={10} className="text-cyan-400" />
              INTELLIGENCE AGENTS: 4,198
            </span>
            <span className="text-emerald-400 font-bold">HEALTH: 99.8%</span>
          </div>
        </div>

        {/* Real-time Threat Logs Terminal */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <span>Security Event Stream</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Auto-refreshing</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-2 font-mono text-[10px] md:text-xs text-slate-300 space-y-1.5 min-h-[140px] flex flex-col justify-start">
            {logs.map((log, idx) => (
              <div 
                key={`${log.city}-${idx}`} 
                className={`flex flex-col sm:flex-row justify-between sm:items-center py-1 px-2 rounded border border-zinc-900/50 transition-all duration-300 ${
                  idx === 0 
                    ? 'bg-rose-950/20 border-rose-500/20 text-rose-300 animate-pulse' 
                    : 'bg-zinc-900/30 text-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                  <span className="font-bold uppercase tracking-wider text-[10px] bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800 text-slate-400">
                    {log.city}, {log.country}
                  </span>
                  <span className="text-slate-200">{log.type}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  <span className="text-slate-500 text-[9px]">IP: {log.ip}</span>
                  <span className={`text-[10px] font-bold ${
                    log.risk >= 95 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {log.risk}% Threat
                  </span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center text-slate-600 py-8 italic">Establishing link to database feeds...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
