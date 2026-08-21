import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Gauge, 
  Shield, 
  FileCode2, 
  User, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Flame, 
  Radio, 
  Sliders, 
  Sparkles, 
  LogIn, 
  Crown,
  Briefcase,
  Sun,
  Moon,
  Gift
} from 'lucide-react';
import { ConnectionStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { useAuth } from '../firebase/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
  theme: 'dark' | 'cyber-light';
  setTheme: (theme: 'dark' | 'cyber-light') => void;
  status: ConnectionStatus;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  killSwitchActive: boolean;
  onOpenQuickSettings: () => void;
  onOpenAuthModal: (tab?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  theme,
  setTheme,
  status,
  soundEnabled,
  setSoundEnabled,
  killSwitchActive,
  onOpenQuickSettings,
  onOpenAuthModal,
}) => {
  const t = TRANSLATIONS[lang];
  const isConnected = status === 'connected';
  const { user, isSuperAdmin, isAdmin, isReseller, canAccessAdminPanel, userProfile } = useAuth();

  const allNavItems = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: Radio },
    { id: 'referrals', label: t.tabs.referrals, icon: Gift, giftHighlight: true },
    { id: 'vipPlans', label: t.tabs.vipPlans, icon: Crown, highlight: true },
    { id: 'benefits', label: t.tabs.benefits, icon: Sparkles },
    { id: 'servers', label: t.tabs.servers, icon: Globe },
    { id: 'worldMap', label: t.tabs.worldMap, icon: Sliders },
    { id: 'speedTest', label: t.tabs.speedTest, icon: Gauge },
    { id: 'security', label: t.tabs.security, icon: Shield },
    { id: 'configs', label: t.tabs.configs, icon: FileCode2 },
    { id: 'account', label: t.tabs.account, icon: User },
    ...(canAccessAdminPanel ? [{
      id: 'admin',
      label: isSuperAdmin 
        ? (lang === 'bn' ? 'এডমিন প্যানেল' : 'Admin Console') 
        : isReseller 
        ? (lang === 'bn' ? 'রিসেলার প্যানেল' : 'Reseller Panel') 
        : (lang === 'bn' ? 'এডমিন প্যানেল' : 'Admin Console'),
      icon: isReseller && !isSuperAdmin ? Briefcase : ShieldAlert,
      adminOnly: true
    }] : []),
    { id: 'logs', label: t.tabs.logs, icon: Terminal },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'cyber-light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 transform group-hover:scale-105 border border-cyan-300/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {isConnected && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#030712]"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Soverixnet
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md">
                  VPN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {lang === 'bn' ? 'কোয়ান্টাম সাইবার শিল্ড ও প্রাইভেসি' : 'Quantum Privacy & Cyber Shield'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            {allNavItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : item.giftHighlight
                      ? 'text-teal-300 hover:text-teal-200 hover:bg-teal-950/40'
                      : item.highlight
                      ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : item.giftHighlight ? 'text-teal-400 animate-pulse' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Refer & Earn Header Pill */}
            <button
              onClick={() => setActiveTab('referrals')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-teal-500/10"
              title="Refer Friends & Earn Free VIP"
            >
              <Gift className="w-3.5 h-3.5 text-teal-400 animate-bounce" />
              <span>{lang === 'bn' ? 'রেফার ও আর্ন' : 'Refer & Earn'}</span>
            </button>

            {/* WhatsApp Channel Follow Pill */}
            <a
              href="https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow Global Free Internet Channel on WhatsApp"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-1.99-.46-1.657-.683-2.73-2.366-2.812-2.476-.083-.11-1.01-1.348-1.01-2.572 0-1.223.636-1.824.862-2.073.226-.249.493-.311.658-.311.164 0 .328.002.472.01.153.007.358-.058.56.427.207.499.704 1.722.766 1.847.062.125.103.271.021.434-.083.164-.124.266-.247.41-.124.144-.261.322-.373.432-.124.123-.254.256-.11.503.144.247.641 1.057 1.376 1.713.946.843 1.744 1.104 1.991 1.228.247.124.391.103.535-.062.145-.165.618-.719.783-.967.165-.247.33-.206.556-.123.226.082 1.436.677 1.683.801.247.124.412.185.473.288.062.103.062.597-.082 1.002zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.174L2 22l4.981-1.306C8.441 21.545 10.16 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              <span className="hidden md:inline">{lang === 'bn' ? 'WhatsApp চ্যানেল' : 'WhatsApp'}</span>
            </a>

            {/* VIP Plans Button Pill */}
            <button
              onClick={() => setActiveTab('vipPlans')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-400/20 hover:from-amber-500/30 hover:to-yellow-400/30 border border-amber-500/40 text-amber-300 text-xs font-black transition-all cursor-pointer shadow-sm shadow-amber-500/10"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'VIP প্ল্যান' : 'VIP Plans'}</span>
            </button>

            {/* ONLY VISIBLE FOR AUTHORIZED SUPER ADMIN / ADMIN / RESELLER */}
            {canAccessAdminPanel && (
              <button
                onClick={() => setActiveTab('admin')}
                title={
                  isSuperAdmin 
                    ? (lang === 'bn' ? 'মাস্টার ওনার এডমিন কন্ট্রোল সেন্টার' : 'Master Owner Admin Center') 
                    : isReseller 
                    ? (lang === 'bn' ? 'রিসেলার প্যানেল ও ব্যালেন্স' : 'Reseller Panel') 
                    : (lang === 'bn' ? 'এডমিন মনিটরিং কনসোল' : 'Admin Console')
                }
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? isSuperAdmin
                      ? 'bg-red-500/20 border-red-400 text-red-300 shadow-md shadow-red-500/20'
                      : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                    : isSuperAdmin
                    ? 'bg-slate-900 border-red-500/40 text-red-400 hover:bg-red-950/40'
                    : 'bg-slate-900 border-amber-500/40 text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                {isReseller && !isSuperAdmin ? (
                  <Briefcase className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs font-black hidden xl:inline">
                  {isSuperAdmin ? '👑 OWNER' : isReseller ? '💼 RESELLER' : '🛡️ ADMIN'}
                </span>
              </button>
            )}

            {/* Global Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={
                theme === 'dark' 
                  ? (lang === 'bn' ? 'হাই-কনট্রাস্ট সাইবার-লাইট মোডে স্যুইচ করুন' : 'Switch to Cyber-Light Mode')
                  : (lang === 'bn' ? 'সাইবার ডার্ক মোডে স্যুইচ করুন' : 'Switch to Dark Mode')
              }
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                theme === 'cyber-light'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-600 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 border-slate-700/80 text-cyan-400 hover:border-cyan-400 shadow-sm'
              }`}
            >
              {theme === 'cyber-light' ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Cyber Sounds'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-700 text-cyan-400'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Login / Profile Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User Avatar" 
                      className="w-5 h-5 rounded-full object-cover border border-amber-400" 
                    />
                  ) : (
                    <Flame className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-xs font-bold hidden sm:inline truncate max-w-[90px]">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'VIP'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('signin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Navigation Horizontal Bar */}
        <div className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto no-scrollbar pt-1">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : item.giftHighlight
                    ? 'text-teal-300 bg-teal-950/30 border border-teal-500/40 font-bold'
                    : item.highlight
                    ? 'text-amber-300 bg-amber-950/30 border border-amber-500/30'
                    : item.adminOnly
                    ? 'text-red-300 bg-red-950/30 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : item.giftHighlight ? 'text-teal-400 animate-pulse' : item.highlight ? 'text-amber-400' : item.adminOnly ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
