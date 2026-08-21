import React, { useState } from 'react';
import { VPNProtocol } from '../types';
import { PROTOCOL_INFO } from '../data/servers';
import { 
  Zap, 
  Shield, 
  EyeOff, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Info, 
  Scale, 
  Layers, 
  Lock, 
  Radio, 
  Sparkles,
  X,
  ArrowRight,
  Wifi
} from 'lucide-react';

interface ProtocolTooltipProps {
  protocol: VPNProtocol;
  lang: 'en' | 'bn';
  children: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onOpenDetailedModal?: (proto: VPNProtocol) => void;
}

export const ProtocolTooltip: React.FC<ProtocolTooltipProps> = ({
  protocol,
  lang,
  children,
  isSelected,
  onSelect,
  onOpenDetailedModal
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = PROTOCOL_INFO[protocol];

  if (!info) return <>{children}</>;

  const getBarColor = (score: number) => {
    if (score >= 5) return 'bg-gradient-to-r from-emerald-500 to-cyan-400';
    if (score === 4) return 'bg-gradient-to-r from-cyan-500 to-blue-500';
    if (score === 3) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-500 to-orange-400';
  };

  return (
    <div 
      className="relative group/proto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The Protocol Button Child Component */}
      {children}

      {/* Interactive Tooltip Card Hover Overlay */}
      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 sm:w-96 p-4 rounded-2xl bg-gradient-to-b from-slate-900/98 via-[#040918]/98 to-slate-950/98 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-xl animate-fade-in pointer-events-auto">
          
          {/* Top Arrow Pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#040918] border-b border-r border-cyan-500/40 rotate-45" />

          {/* Header & Badges */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">{info.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {lang === 'bn' ? (info as any).badgeBn || info.badge : info.badge}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                {info.fullName} • <strong className="text-cyan-300">{info.port}</strong>
              </span>
            </div>

            {onOpenDetailedModal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetailedModal(protocol);
                }}
                className="p-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 transition-all text-[10px] flex items-center gap-1 font-semibold cursor-pointer shrink-0"
                title={lang === 'bn' ? 'বিস্তারিত টেকনিক্যাল বিশ্লেষণ' : 'Detailed Technical Specs'}
              >
                <Scale className="w-3 h-3" />
                <span>{lang === 'bn' ? 'তুলনা' : 'Specs'}</span>
              </button>
            )}
          </div>

          {/* Speed vs Security Comparison Meters */}
          <div className="py-2.5 space-y-2 border-b border-slate-800/80 text-xs">
            
            {/* Speed Meter */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'bn' ? 'গতি ও থ্রুপুট (Speed & Throughput)' : 'Raw Speed & Throughput'}</span>
                </span>
                <span className="font-mono font-bold text-white">{info.speedRating}/5</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(info.speedRating)}`}
                  style={{ width: `${(info.speedRating / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Security Meter */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'এনক্রিপশন ও নিরাপত্তা (Security)' : 'Cryptographic Security'}</span>
                </span>
                <span className="font-mono font-bold text-white">{info.securityRating}/5</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(info.securityRating)}`}
                  style={{ width: `${(info.securityRating / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* DPI Stealth / Censorship Bypass */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'bn' ? 'ফায়ারওয়াল বাইপাস / স্টেলথ (Bypass)' : 'Censorship & DPI Bypass'}</span>
                </span>
                <span className="font-mono font-bold text-white">{info.bypassRating}/5</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(info.bypassRating)}`}
                  style={{ width: `${(info.bypassRating / 5) * 100}%` }}
                />
              </div>
            </div>

          </div>

          {/* Speed vs. Security Technical Trade-Off Explanation */}
          <div className="py-2.5 space-y-1.5 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'গতি বনাম নিরাপত্তা বিশ্লেষণ (Speed vs. Security):' : 'Speed vs. Security Analysis:'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
              {lang === 'bn' ? (info as any).speedVsSecurityBn || info.descriptionBn : (info as any).speedVsSecurity || info.description}
            </p>
          </div>

          {/* Technical Specs 2x2 Grid */}
          <div className="py-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-500 block uppercase">{lang === 'bn' ? 'সাইফার' : 'Cipher'}</span>
              <span className="text-cyan-300 font-bold truncate block">{info.cipher}</span>
            </div>
            <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-500 block uppercase">{lang === 'bn' ? 'হ্যান্ডশেক' : 'Latency'}</span>
              <span className="text-emerald-300 font-bold truncate block">{(info as any).latencySpec || '< 15ms'}</span>
            </div>
          </div>

          {/* Best For Tagline */}
          <div className="pt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <strong className="text-white">{lang === 'bn' ? 'ব্যবহার:' : 'Best For:'}</strong>
              <span className="text-slate-300 truncate">
                {lang === 'bn' ? (info as any).bestForBn || 'অনলাইন সিকিউরিটি' : (info as any).bestFor || 'Secure Privacy'}
              </span>
            </span>

            {onSelect && !isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] transition-all cursor-pointer shrink-0 ml-2"
              >
                {lang === 'bn' ? 'সক্রিয় করুন' : 'Select'}
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

/* Full Screen / Popover Comparison Matrix Modal Component */
interface ProtocolComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  activeProtocol: VPNProtocol;
  onSelectProtocol: (proto: VPNProtocol) => void;
}

export const ProtocolComparisonModal: React.FC<ProtocolComparisonModalProps> = ({
  isOpen,
  onClose,
  lang,
  activeProtocol,
  onSelectProtocol
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'speed' | 'stealth' | 'security'>('all');

  if (!isOpen) return null;

  const protocolKeys: VPNProtocol[] = [
    'wireguard',
    'v2ray',
    'hysteria2',
    'shadowsocks',
    'trojan',
    'openvpn_udp',
    'openvpn_tcp'
  ];

  const filteredKeys = protocolKeys.filter((proto) => {
    const p = PROTOCOL_INFO[proto];
    if (filterCategory === 'speed') return p.speedRating >= 4;
    if (filterCategory === 'stealth') return p.bypassRating >= 4;
    if (filterCategory === 'security') return p.securityRating >= 5;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl rounded-3xl border border-cyan-500/30 bg-[#030712]/95 shadow-[0_0_60px_rgba(6,182,212,0.2)] p-6 sm:p-8 my-8 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/20 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {lang === 'bn' ? 'ভিপিএন প্রোটোকল গভীর প্রযুক্তিগত তুলনা' : 'VPN Protocol Architecture & Speed vs. Security Matrix'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  WireGuard vs V2Ray vs VLESS vs Hysteria 2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn'
                  ? 'ওয়্যারগার্ড (WireGuard), ভি২রে (V2Ray/VLESS) এবং অন্যান্য প্রোটোকলের স্পিড, সিকিউরিটি ও বাইপাস ক্ষমতার পুঙ্খানুপুঙ্খ তুলনা।'
                  : 'In-depth analysis of cryptographic strength, kernel vs userspace efficiency, packet overhead, and anti-firewall DPI evasion.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="py-4 flex items-center gap-2 flex-wrap border-b border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 mr-2">
            {lang === 'bn' ? 'ফিল্টার করুন:' : 'Filter View:'}
          </span>
          {[
            { id: 'all', label: lang === 'bn' ? 'সকল প্রোটোকল (All 7)' : 'All Protocols (7)' },
            { id: 'speed', label: lang === 'bn' ? '⚡ দ্রুততম গেমিং ও স্পিড (Speed/Gaming)' : '⚡ Fast Speed & Gaming' },
            { id: 'stealth', label: lang === 'bn' ? '🕶️ অ্যান্টি-সেন্সরশিপ / বাইপাস (Stealth/VLESS)' : '🕶️ Anti-Censorship / Stealth' },
            { id: 'security', label: lang === 'bn' ? '🛡️ মিলিটারী এনক্রিপশন (Military Security)' : '🛡️ High Security Standard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Comparison Cards Grid */}
        <div className="py-5 overflow-y-auto pr-1 space-y-4 flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKeys.map((proto) => {
              const info = PROTOCOL_INFO[proto];
              const isSelected = activeProtocol === proto;

              return (
                <div 
                  key={proto}
                  className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-white">{info.name}</h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-black">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono block mt-0.5">
                          {info.fullName}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-slate-950 text-cyan-300 border border-cyan-500/30">
                        {lang === 'bn' ? (info as any).badgeBn || info.badge : info.badge}
                      </span>
                    </div>

                    {/* Metrics Bars */}
                    <div className="space-y-2 mb-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === 'bn' ? 'গতি ও রেসপন্স' : 'Speed & Throughput'}</span>
                        </span>
                        <span className="font-mono font-bold text-white">{info.speedRating}/5</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'bn' ? 'ক্রিপ্টোগ্রাফি নিরাপত্তা' : 'Crypto Security'}</span>
                        </span>
                        <span className="font-mono font-bold text-white">{info.securityRating}/5</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                          <span>{lang === 'bn' ? 'ফায়ারওয়াল বাইপাস / স্টেলথ' : 'DPI Firewall Evasion'}</span>
                        </span>
                        <span className="font-mono font-bold text-white">{info.bypassRating}/5</span>
                      </div>

                    </div>

                    {/* Speed vs. Security Narrative */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-amber-300 block mb-1 uppercase tracking-wider">
                        {lang === 'bn' ? 'গতি বনাম নিরাপত্তা ট্রেড-অফ:' : 'Speed vs. Security Trade-Off:'}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/90 p-2.5 rounded-xl border border-slate-800/80">
                        {lang === 'bn' ? (info as any).speedVsSecurityBn || info.descriptionBn : (info as any).speedVsSecurity || info.description}
                      </p>
                    </div>

                    {/* Technical Specs Key Values */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4">
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block">{lang === 'bn' ? 'পোর্ট ও প্রোটোকল' : 'Port / Proto'}</span>
                        <span className="text-cyan-300 font-bold truncate block">{info.port}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block">{lang === 'bn' ? 'এনক্রিপশন সাইফার' : 'Cipher'}</span>
                        <span className="text-emerald-300 font-bold truncate block">{info.cipher.split('+')[0]}</span>
                      </div>
                    </div>

                    {/* Key Strengths Bullets */}
                    <div className="mb-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'bn' ? 'প্রধান প্রযুক্তিগত সুবিধাসমূহ:' : 'Key Architectural Strengths:'}
                      </span>
                      {((lang === 'bn' ? (info as any).keyStrengthsBn : info.keyStrengths) || []).map((strength: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Select Protocol Button */}
                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        onSelectProtocol(proto);
                        onClose();
                      }}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-md shadow-cyan-500/20'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'বর্তমানে নির্বাচিত প্রোটোকল' : 'Currently Active Engine'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>{lang === 'bn' ? `এই প্রোটোকল (${info.name}) চালু করুন` : `Switch to ${info.name}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'bn' 
                ? 'টিপ: গেমিং ও ফাস্ট স্ট্রিমিংয়ের জন্য WireGuard ব্যবহার করুন। ফায়ারওয়াল বা অবরুদ্ধ ওয়াইফাইয়ের জন্য V2Ray / VLESS Reality সেরা।' 
                : 'Pro Tip: Use WireGuard for gaming & 4K streaming. Switch to V2Ray/VLESS Reality when encountering strict firewalls or blocked networks.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-all shrink-0"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close Matrix'}
          </button>
        </div>

      </div>
    </div>
  );
};
