import React, { useState } from 'react';
import { VPNServer, ConnectionStatus } from '../types';
import { SERVERS_DATA } from '../data/servers';
import { ShieldCheck, MapPin, Zap, Lock, Globe2, Radio, Check, ChevronRight } from 'lucide-react';

interface WorldMapVisualizerProps {
  selectedServer: VPNServer;
  onSelectServer: (server: VPNServer) => void;
  status: ConnectionStatus;
  lang: 'en' | 'bn';
  onToggleConnect: () => void;
}

export const WorldMapVisualizer: React.FC<WorldMapVisualizerProps> = ({
  selectedServer,
  onSelectServer,
  status,
  lang,
  onToggleConnect,
}) => {
  const [hoveredServer, setHoveredServer] = useState<VPNServer | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('all');

  const isConnected = status === 'connected';

  // Origin point (Dhaka user base: lat 23.81, lng 90.41)
  const origin = { lat: 23.81, lng: 90.41, label: 'User Location (Dhaka)' };

  // Convert lat/lng to SVG percentage coordinates for equirectangular projection
  // Lat: 90 to -90 -> 0% to 100%
  // Lng: -180 to 180 -> 0% to 100%
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const originPos = projectCoords(origin.lat, origin.lng);
  const targetPos = projectCoords(selectedServer.lat, selectedServer.lng);

  // Filter servers
  const filteredServers = SERVERS_DATA.filter((s) => {
    if (activeRegionFilter === 'all') return true;
    return s.region === activeRegionFilter;
  });

  const regions = [
    { id: 'all', label: lang === 'bn' ? 'সকল অঞ্চল' : 'All Regions' },
    { id: 'asia', label: lang === 'bn' ? 'এশিয়া' : 'Asia' },
    { id: 'europe', label: lang === 'bn' ? 'ইউরোপ' : 'Europe' },
    { id: 'north_america', label: lang === 'bn' ? 'উত্তর আমেরিকা' : 'North America' },
    { id: 'middle_east', label: lang === 'bn' ? 'মধ্যপ্রাচ্য' : 'Middle East' },
    { id: 'oceania', label: lang === 'bn' ? 'ওশেনিয়া' : 'Oceania' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              {lang === 'bn' ? 'গ্লোবাল সাইবার টপোলজি ম্যাপ' : 'Global Cyber Mesh Map'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'বিশ্বজুড়ে হাই-স্পিড নোড এবং সুরক্ষিত এনক্রিপ্টেড রুট ইন্টার‍্যাক্টিভভাবে নির্বাচন করুন' 
              : 'Interactive low-latency sovereign nodes with live cryptographic route telemetry.'}
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setActiveRegionFilter(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeRegionFilter === reg.id
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas Container */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[580px] bg-gradient-to-b from-[#060c1c] via-[#040814] to-[#02040a] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        
        {/* Background Grid Lines & Coordinates */}
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

        {/* HUD Latitude / Longitude Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 text-[11px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
          <span className="text-cyan-400 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            TARGET: {selectedServer.city.toUpperCase()} [{selectedServer.lat.toFixed(2)}°, {selectedServer.lng.toFixed(2)}°]
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">PING: {selectedServer.ping}ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">
            {isConnected ? 'ENCRYPTED TUNNEL ACTIVE' : 'STANDBY'}
          </span>
        </div>

        {/* World Map SVG Canvas */}
        <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {/* Gradient for connecting route line */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Continents Simplified Abstract Mesh Paths for dark cyber aesthetic */}
          <g fill="rgba(30, 41, 59, 0.4)" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="0.3" opacity="0.8">
            {/* North America */}
            <path d="M 12 18 Q 22 12 35 15 Q 32 35 22 42 Q 15 48 10 38 Z" />
            {/* South America */}
            <path d="M 25 50 Q 35 52 38 65 Q 32 85 28 88 Q 23 75 25 50 Z" />
            {/* Europe */}
            <path d="M 45 18 Q 58 14 58 28 Q 50 35 44 32 Z" />
            {/* Africa */}
            <path d="M 46 36 Q 58 35 60 55 Q 55 75 48 70 Q 44 50 46 36 Z" />
            {/* Asia */}
            <path d="M 60 16 Q 85 14 88 38 Q 78 55 64 45 Q 60 30 60 16 Z" />
            {/* Australia */}
            <path d="M 78 65 Q 90 62 92 78 Q 80 82 78 65 Z" />
          </g>

          {/* User Origin Node Pulse */}
          <circle cx={originPos.x} cy={originPos.y} r="2.2" fill="#06b6d4" opacity="0.3" className="animate-ping" />
          <circle cx={originPos.x} cy={originPos.y} r="1.2" fill="#06b6d4" filter="url(#glow)" />
          <circle cx={originPos.x} cy={originPos.y} r="0.6" fill="#ffffff" />

          {/* Active VPN Connection Route Line (Animated Bezier Curve) */}
          {isConnected && (
            <>
              {/* Curved Arc */}
              <path
                d={`M ${originPos.x} ${originPos.y} Q ${(originPos.x + targetPos.x) / 2} ${
                  Math.min(originPos.y, targetPos.y) - 15
                } ${targetPos.x} ${targetPos.y}`}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="0.8"
                strokeDasharray="2, 1"
                filter="url(#glow)"
              />

              {/* Animated Photon Packet along the route */}
              <circle r="0.8" fill="#ffffff" filter="url(#glow)">
                <animateMotion
                  path={`M ${originPos.x} ${originPos.y} Q ${(originPos.x + targetPos.x) / 2} ${
                    Math.min(originPos.y, targetPos.y) - 15
                  } ${targetPos.x} ${targetPos.y}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
        </svg>

        {/* Interactive Server Pin Markers overlay */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {filteredServers.map((server) => {
            const pos = projectCoords(server.lat, server.lng);
            const isSelected = selectedServer.id === server.id;

            return (
              <div
                key={server.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                onMouseEnter={() => setHoveredServer(server)}
                onMouseLeave={() => setHoveredServer(null)}
                onClick={() => onSelectServer(server)}
              >
                {/* Pulsing selection aura */}
                {isSelected && (
                  <div className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-pulse-ring" />
                )}

                {/* Pin Head */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 transform group-hover:scale-125 border ${
                  isSelected
                    ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black font-bold shadow-lg shadow-cyan-400/60 border-white'
                    : 'bg-slate-900/90 text-slate-200 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-950'
                }`}>
                  <span className="text-[10px]">{server.flag}</span>
                </div>

                {/* Floating Node Label on Hover or Active */}
                {(isSelected || hoveredServer?.id === server.id) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs shadow-2xl backdrop-blur-xl z-30 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">
                        {lang === 'bn' ? server.countryBn : server.country}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">{server.ping}ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{server.city}</span>
                      <span className="text-emerald-400">{server.speed}</span>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">Load: {server.load}%</span>
                      <span className="text-cyan-300 font-semibold">{isSelected ? 'ACTIVE' : 'Click to Select'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Control Bar on the map */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/85 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedServer.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {lang === 'bn' ? selectedServer.countryBn : selectedServer.country} ({selectedServer.city})
                </span>
                <span className="text-xs font-mono text-emerald-400">{selectedServer.ip}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'লেটেন্সি:' : 'Latency:'} <span className="font-mono text-cyan-300">{selectedServer.ping} ms</span> | {lang === 'bn' ? 'লোড:' : 'Load:'} <span className="font-mono text-slate-300">{selectedServer.load}%</span>
              </p>
            </div>
          </div>

          <button
            onClick={onToggleConnect}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              isConnected
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
            }`}
          >
            {isConnected ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সংযোগ বিচ্ছিন্ন করুন' : 'Disconnect'}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-black" />
                <span>{lang === 'bn' ? 'এই নোডে সংযোগ করুন' : 'Connect to Node'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Grid of featured low-latency nodes */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'bn' ? 'জনপ্রিয় ও দ্রুততম নোডস' : 'Ultra Low-Latency Recommended Nodes'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVERS_DATA.slice(0, 6).map((server) => {
            const isSelected = selectedServer.id === server.id;
            return (
              <div
                key={server.id}
                onClick={() => onSelectServer(server)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{server.flag}</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {lang === 'bn' ? server.countryBn : server.country}
                    </h5>
                    <p className="text-[11px] text-slate-400">{server.city}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300">{server.ping} ms</span>
                  <span className="block text-[10px] text-slate-500 font-mono">Load {server.load}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
