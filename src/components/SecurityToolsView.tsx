import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  Lock, 
  Zap, 
  Layers, 
  Plus, 
  Trash2, 
  Check, 
  Globe, 
  EyeOff, 
  Cpu, 
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { SecuritySettings, SplitTunnelApp } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SecurityToolsViewProps {
  settings: SecuritySettings;
  onUpdateSettings: (newSettings: Partial<SecuritySettings>) => void;
  lang: 'en' | 'bn';
}

export const SecurityToolsView: React.FC<SecurityToolsViewProps> = ({
  settings,
  onUpdateSettings,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Mock initial apps for split tunneling
  const [apps, setApps] = useState<SplitTunnelApp[]>([
    { id: '1', name: 'Google Chrome', icon: '🌐', category: 'browser', isBypassed: false, packageOrExe: 'chrome.exe' },
    { id: '2', name: 'Steam Gaming', icon: '🎮', category: 'gaming', isBypassed: true, packageOrExe: 'steam.exe' },
    { id: '3', name: 'Telegram Desktop', icon: '💬', category: 'media', isBypassed: false, packageOrExe: 'telegram.exe' },
    { id: '4', name: 'Local Bank App', icon: '🏦', category: 'finance', isBypassed: true, packageOrExe: 'bank_secure.exe' },
    { id: '5', name: 'BitTorrent Client', icon: '📥', category: 'tools', isBypassed: false, packageOrExe: 'qbittorrent.exe' },
  ]);

  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<'browser' | 'gaming' | 'media' | 'finance' | 'tools'>('tools');

  const handleToggleAppBypass = (id: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isBypassed: !app.isBypassed } : app))
    );
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: SplitTunnelApp = {
      id: Date.now().toString(),
      name: newAppName.trim(),
      icon: newAppCategory === 'gaming' ? '🎮' : newAppCategory === 'finance' ? '🏦' : newAppCategory === 'browser' ? '🌐' : '📱',
      category: newAppCategory,
      isBypassed: true,
      packageOrExe: `${newAppName.toLowerCase().replace(/\s+/g, '_')}.exe`,
    };

    setApps([...apps, newApp]);
    setNewAppName('');
  };

  const handleDeleteApp = (id: string) => {
    setApps(apps.filter((app) => app.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cyber Protection Master Matrix */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'bn' ? 'সোভারিক্সনেট সাইবার গার্ড সিকিউরিটি' : 'SoverixNet Cyber Guard Suite'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' 
                ? 'অনলাইন থ্রেট, ম্যালওয়্যার, ট্র্যাকিং এবং আইএসপি থ্রোটলিং থেকে সম্পূর্ণ সুরক্ষা' 
                : 'Military-grade perimeter shield, DNS leak prevention, and DPI firewall bypass.'}
            </p>
          </div>
        </div>

        {/* Security Toggles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Kill Switch */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white">{t.killSwitch}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.killSwitchDesc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input 
                type="checkbox" 
                checked={settings.killSwitch} 
                onChange={(e) => onUpdateSettings({ killSwitch: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* CleanNet AdBlock */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">{t.cleanNet}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.cleanNetDesc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input 
                type="checkbox" 
                checked={settings.cleanNetAdBlock} 
                onChange={(e) => onUpdateSettings({ cleanNetAdBlock: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Malware & Phishing Defense */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'ম্যালওয়্যার ও অ্যান্টি-ফিশিং' : 'Anti-Malware & Phishing Shield'}
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'bn' ? 'ঝুঁকিপূর্ণ ডোমেন এবং স্ক্যাম ওয়েবসাইটে প্রবেশ বন্ধ করে' : 'Automatically intercepts known malicious domains and dangerous ransomware hosts.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input 
                type="checkbox" 
                checked={settings.malwareShield} 
                onChange={(e) => onUpdateSettings({ malwareShield: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Stealth Obfuscation */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">{t.stealthMode}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.stealthModeDesc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input 
                type="checkbox" 
                checked={settings.stealthObfuscation} 
                onChange={(e) => onUpdateSettings({ stealthObfuscation: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

        </div>

      </div>

      {/* Split Tunneling Module */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">
                {lang === 'bn' ? 'স্প্লিট টানেলিং (Split Tunneling)' : 'App-Level Split Tunneling'}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' 
                ? 'কোন কোন অ্যাপ ভিপিএন বাইপাস করবে বা ভিপিএন দিয়ে চলবে তা নির্ধারণ করুন' 
                : 'Select specific apps to route through or bypass the encrypted VPN tunnel.'}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.splitTunnelingEnabled} 
              onChange={(e) => onUpdateSettings({ splitTunnelingEnabled: e.target.checked })} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Add App Form */}
        <form onSubmit={handleAddApp} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            placeholder={lang === 'bn' ? 'নতুন অ্যাপ বা গেমের নাম লিখুন (যেমন: Valorant, Discord)...' : 'Add custom app name (e.g. Valorant, Discord)...'}
            className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
          />
          <select
            value={newAppCategory}
            onChange={(e) => setNewAppCategory(e.target.value as unknown as typeof newAppCategory)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="gaming">Gaming</option>
            <option value="browser">Browser</option>
            <option value="finance">Banking</option>
            <option value="media">Media</option>
            <option value="tools">Tools</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
          </button>
        </form>

        {/* Apps List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {apps.map((app) => (
            <div
              key={app.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{app.icon}</span>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{app.name}</h5>
                  <span className="text-[10px] text-slate-500 font-mono">{app.packageOrExe}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleAppBypass(app.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    app.isBypassed
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  {app.isBypassed 
                    ? (lang === 'bn' ? 'বাইপাস ভিপিএন (সরাসরি ইন্টারনেট)' : 'Bypass VPN') 
                    : (lang === 'bn' ? 'ভিপিএন সুরক্ষিত' : 'Route via VPN')}
                </button>

                <button
                  onClick={() => handleDeleteApp(app.id)}
                  className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Encrypted DNS Resolver Provider */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-white">
            {lang === 'bn' ? 'এনক্রিপ্টেড ডিএনএস প্রোভাইডার (DNS-over-HTTPS)' : 'Encrypted DNS Resolvers'}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'soverix_secure', name: 'SoverixNet Zero-Log', desc: 'Default ad-blocking + malware filter', ip: '10.0.0.1' },
            { id: 'cloudflare', name: 'Cloudflare 1.1.1.1', desc: 'Fastest global resolver', ip: '1.1.1.1' },
            { id: 'adguard', name: 'AdGuard Family DNS', desc: 'Strict tracking removal', ip: '94.140.14.14' },
            { id: 'quad9', name: 'Quad9 Security DNS', desc: 'Threat intelligence shield', ip: '9.9.9.9' },
          ].map((dns) => {
            const isSelected = settings.dnsProvider === dns.id;
            return (
              <button
                key={dns.id}
                onClick={() => onUpdateSettings({ dnsProvider: dns.id as unknown as typeof settings.dnsProvider })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-bold text-white">{dns.name}</h5>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight mb-2">{dns.desc}</p>
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {dns.ip}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
