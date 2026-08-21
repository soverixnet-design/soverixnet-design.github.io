import React, { useState, useEffect } from 'react';
import { 
  ConnectionStatus, 
  VPNServer, 
  VPNProtocol, 
  SecuritySettings 
} from './types';
import { SERVERS_DATA } from './data/servers';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { MainConnectView } from './components/MainConnectView';
import { BenefitsView } from './components/BenefitsView';
import { VipPlansView } from './components/VipPlansView';
import { ServerListModal } from './components/ServerListModal';
import { WorldMapVisualizer } from './components/WorldMapVisualizer';
import { SpeedTestView } from './components/SpeedTestView';
import { SecurityToolsView } from './components/SecurityToolsView';
import { ConfigGeneratorModal } from './components/ConfigGeneratorModal';
import { AccountView } from './components/AccountView';
import { ReferralRewardsView } from './components/ReferralRewardsView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { LiveConsoleLogs } from './components/LiveConsoleLogs';
import { AuthModal } from './components/AuthModal';
import { ActionFeedbackToast, ToastFeedbackData } from './components/ActionFeedbackToast';
import { soundEffects } from './services/soundEffects';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { 
  ShieldCheck, 
  Globe2, 
  X, 
  Sliders
} from 'lucide-react';

const THEME_STORAGE_KEY = 'soverix_app_theme';

function AppContent() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [theme, setTheme] = useState<'dark' | 'cyber-light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved === 'cyber-light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedServer, setSelectedServer] = useState<VPNServer>(SERVERS_DATA[0]);
  const [activeProtocol, setActiveProtocol] = useState<VPNProtocol>('wireguard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isServerModalOpen, setIsServerModalOpen] = useState<boolean>(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [toastFeedback, setToastFeedback] = useState<ToastFeedbackData | null>(null);

  const { user, updateUserPreferences, saveConnectionSession } = useAuth();

  const [settings, setSettings] = useState<SecuritySettings>({
    killSwitch: true,
    cleanNetAdBlock: true,
    malwareShield: true,
    antiPhishing: true,
    preventDnsLeaks: true,
    preventWebRtcLeaks: true,
    splitTunnelingEnabled: true,
    autoConnectOnUntrustedWifi: true,
    stealthObfuscation: false,
    mtuSize: 1420,
    dnsProvider: 'soverix_secure',
    customDnsIp: '',
    quantumSafeKyber: true,
  });

  const t = TRANSLATIONS[lang];

  // Sync theme changes with localStorage and HTML root element
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
    if (theme === 'cyber-light') {
      document.documentElement.classList.add('cyber-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('cyber-light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const handleOpenAuthModal = (initialTab: 'signin' | 'signup' = 'signin') => {
    soundEffects.playClick();
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEffects.setEnabled(enabled);
  };

  const handleToggleConnect = () => {
    soundEffects.playClick();

    if (status === 'connected') {
      if (sessionStartTime) {
        const durationSecs = Math.round((Date.now() - sessionStartTime) / 1000);
        const dlMB = +(durationSecs * 18.5).toFixed(1);
        const ulMB = +(durationSecs * 9.2).toFixed(1);
        saveConnectionSession(
          selectedServer.id,
          selectedServer.name,
          activeProtocol,
          durationSecs,
          dlMB,
          ulMB
        );
      }

      setStatus('disconnecting');
      soundEffects.playDisconnected();
      setSessionStartTime(null);

      setTimeout(() => {
        setStatus('disconnected');
      }, 600);
    } else if (status === 'disconnected') {
      setStatus('connecting');
      soundEffects.playConnecting();

      setTimeout(() => {
        setStatus('handshaking');
        setTimeout(() => {
          setStatus('connected');
          setSessionStartTime(Date.now());
          soundEffects.playConnected();
        }, 800);
      }, 700);
    }
  };

  const handleSelectServer = (server: VPNServer) => {
    soundEffects.playClick();
    const prev = selectedServer;
    setSelectedServer(server);
    
    // Trigger subtle Framer Motion success feedback
    setToastFeedback({
      type: 'server_switch',
      server,
      prevServer: prev,
    });

    if (status === 'connected') {
      setStatus('handshaking');
      soundEffects.playConnecting();
      setTimeout(() => {
        setStatus('connected');
        soundEffects.playConnected();
      }, 700);
    }
  };

  const handleAuthSuccess = (details: { userName?: string; email?: string; isVip?: boolean; actionType: 'signin' | 'signup' | 'instant_vip' }) => {
    setToastFeedback({
      type: 'auth_success',
      userName: details.userName,
      email: details.email,
      isVip: details.isVip,
      actionType: details.actionType,
    });
  };

  const handleSelectProtocol = (proto: VPNProtocol) => {
    soundEffects.playClick();
    setActiveProtocol(proto);
    if (user) {
      updateUserPreferences(settings, proto);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<SecuritySettings>) => {
    soundEffects.playShieldToggle();
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (user) {
      updateUserPreferences(updated, activeProtocol);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'cyber-light' ? 'bg-[#f8fafc] text-slate-900 cyber-light' : 'bg-[#030712] text-slate-100 dark'} flex flex-col selection:bg-cyan-500 selection:text-black relative transition-colors duration-300`}>
      
      {/* Background Ambient Glow & Grid */}
      <div className="fixed inset-0 bg-cyber-grid opacity-25 pointer-events-none z-0" />
      <div className={`fixed top-0 left-1/4 w-96 h-96 ${theme === 'cyber-light' ? 'bg-cyan-500/10' : 'bg-cyan-600/10'} rounded-full blur-[140px] pointer-events-none z-0`} />
      <div className={`fixed bottom-0 right-1/4 w-96 h-96 ${theme === 'cyber-light' ? 'bg-indigo-400/10' : 'bg-indigo-600/10'} rounded-full blur-[140px] pointer-events-none z-0`} />

      {/* Main Top Navbar with Theme Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        status={status}
        soundEnabled={soundEnabled}
        setSoundEnabled={handleToggleSound}
        killSwitchActive={settings.killSwitch}
        onOpenQuickSettings={() => setIsQuickSettingsOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main App Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <MainConnectView
            status={status}
            onToggleConnect={handleToggleConnect}
            selectedServer={selectedServer}
            onOpenServerModal={() => setIsServerModalOpen(true)}
            activeProtocol={activeProtocol}
            onSelectProtocol={handleSelectProtocol}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            lang={lang}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* VIP Plans & Pricing Tab */}
        {activeTab === 'vipPlans' && (
          <VipPlansView
            lang={lang}
            onOpenAuthModal={handleOpenAuthModal}
            onNavigateToReferrals={() => setActiveTab('referrals')}
          />
        )}

        {/* Why Soverixnet / Benefits Tab */}
        {activeTab === 'benefits' && (
          <BenefitsView
            lang={lang}
            onConnectNow={() => {
              setActiveTab('dashboard');
              if (status === 'disconnected') {
                handleToggleConnect();
              }
            }}
          />
        )}

        {/* Server Nodes Tab */}
        {activeTab === 'servers' && (
          <ServerListModal
            selectedServer={selectedServer}
            onSelectServer={handleSelectServer}
            lang={lang}
          />
        )}

        {/* Interactive World Map Tab */}
        {activeTab === 'worldMap' && (
          <WorldMapVisualizer
            selectedServer={selectedServer}
            onSelectServer={handleSelectServer}
            status={status}
            lang={lang}
            onToggleConnect={handleToggleConnect}
          />
        )}

        {/* Speed Test & Diagnostics Tab */}
        {activeTab === 'speedTest' && (
          <SpeedTestView
            selectedServer={selectedServer}
            status={status}
            lang={lang}
          />
        )}

        {/* Security Shield & Split Tunneling Tab */}
        {activeTab === 'security' && (
          <SecurityToolsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            lang={lang}
          />
        )}

        {/* Referral & Rewards Program Hub Tab */}
        {activeTab === 'referrals' && (
          <ReferralRewardsView
            lang={lang}
            onNavigateToPlans={() => setActiveTab('vipPlans')}
            onOpenAuth={() => handleOpenAuthModal('signup')}
          />
        )}

        {/* Config & Profile Exporter Tab */}
        {activeTab === 'configs' && (
          <ConfigGeneratorModal
            selectedServer={selectedServer}
            activeProtocol={activeProtocol}
            lang={lang}
          />
        )}

        {/* VIP Account Tab */}
        {activeTab === 'account' && (
          <AccountView 
            lang={lang} 
            onOpenAuthModal={handleOpenAuthModal} 
            onNavigateToReferrals={() => setActiveTab('referrals')}
          />
        )}

        {/* Master Admin Console Tab */}
        {activeTab === 'admin' && (
          <AdminConsoleView lang={lang} />
        )}

        {/* Live Cyber Logs Tab */}
        {activeTab === 'logs' && (
          <LiveConsoleLogs
            status={status}
            activeProtocol={activeProtocol}
            selectedServer={selectedServer}
            lang={lang}
          />
        )}

      </main>

      {/* Floating Action Feedback Toast (Framer Motion) */}
      <ActionFeedbackToast
        toast={toastFeedback}
        onClose={() => setToastFeedback(null)}
        lang={lang}
      />

      {/* Auth Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        initialTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Global Server Selector Modal */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#050b18] border border-cyan-500/30 rounded-3xl p-6 overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'bn' ? 'সার্ভার লোকেশন পরিবর্তন করুন' : 'Change Server Node Location'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'আপনার পছন্দের দ্রুততম সার্ভারটি সিলেক্ট করুন' : 'Select an ultra-fast sovereign node worldwide'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsServerModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ServerListModal
              selectedServer={selectedServer}
              onSelectServer={(server) => {
                handleSelectServer(server);
                setIsServerModalOpen(false);
              }}
              lang={lang}
              onClose={() => setIsServerModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Quick Settings Drawer Modal */}
      {isQuickSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#050b18] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white">
                  {lang === 'bn' ? 'দ্রুত নিরাপত্তা সেটিংস' : 'Quick Protection Controls'}
                </h4>
              </div>
              <button
                onClick={() => setIsQuickSettingsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{t.killSwitch}</h5>
                  <p className="text-[10px] text-slate-400">{t.killSwitchDesc}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.killSwitch} 
                  onChange={(e) => handleUpdateSettings({ killSwitch: e.target.checked })} 
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{t.cleanNet}</h5>
                  <p className="text-[10px] text-slate-400">{t.cleanNetDesc}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.cleanNetAdBlock} 
                  onChange={(e) => handleUpdateSettings({ cleanNetAdBlock: e.target.checked })} 
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{t.stealthMode}</h5>
                  <p className="text-[10px] text-slate-400">{t.stealthModeDesc}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.stealthObfuscation} 
                  onChange={(e) => handleUpdateSettings({ stealthObfuscation: e.target.checked })} 
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsQuickSettingsOpen(false);
                setActiveTab('security');
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all text-center block cursor-pointer"
            >
              {lang === 'bn' ? 'সকল অ্যাডভান্সড সিকিউরিটি টুলস দেখুন ➔' : 'View Full Security Suite ➔'}
            </button>
          </div>
        </div>
      )}

      {/* Cyber Sleek Footer with SEO Authority Keywords */}
      <footer className="w-full border-t border-slate-800/80 bg-[#02050c] py-8 px-4 sm:px-6 lg:px-8 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6 text-xs text-slate-500">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm">Soverixnet VPN (সোভারিক্সনেট)</span>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'কোয়ান্টাম-রেজিস্ট্যান্ট ক্রিপ্টোগ্রাফিক শিল্ড ও আল্ট্রা-ফাস্ট গ্লোবাল নেটওয়ার্ক' : 'Quantum-Resistant Encrypted Network & Zero-Log Anonymity'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Zero-Logs RAM Verified
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-bold">{user?.email || 'soverixnet@gmail.com'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">v4.30-{theme.toUpperCase()}</span>
            </div>
          </div>

          {/* Global Free Internet WhatsApp Channel Bar */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-1.99-.46-1.657-.683-2.73-2.366-2.812-2.476-.083-.11-1.01-1.348-1.01-2.572 0-1.223.636-1.824.862-2.073.226-.249.493-.311.658-.311.164 0 .328.002.472.01.153.007.358-.058.56.427.207.499.704 1.722.766 1.847.062.125.103.271.021.434-.083.164-.124.266-.247.41-.124.144-.261.322-.373.432-.124.123-.254.256-.11.503.144.247.641 1.057 1.376 1.713.946.843 1.744 1.104 1.991 1.228.247.124.391.103.535-.062.145-.165.618-.719.783-.967.165-.247.33-.206.556-.123.226.082 1.436.677 1.683.801.247.124.412.185.473.288.062.103.062.597-.082 1.002zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.174L2 22l4.981-1.306C8.441 21.545 10.16 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-xs block">
                  {lang === 'bn' ? 'অফিসিয়াল WhatsApp চ্যানেল: Global Free Internet' : 'Official WhatsApp Channel: Global Free Internet'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {lang === 'bn' ? 'ফ্রি ইন্টারনেট ও আনলিমিটেড ভিপিএন ট্রিক্স পেতে যুক্ত থাকুন।' : 'Join our WhatsApp community for free VPN configs & tricks.'}
                </span>
              </div>
            </div>

            <a
              href="https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'Follow on WhatsApp ➔' : 'Follow on WhatsApp ➔'}</span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-900 text-center text-[10px] text-slate-600 leading-relaxed max-w-4xl mx-auto">
            © 2026 <strong>Soverixnet VPN</strong>. All Rights Reserved. Official Portal for Soverixnet, Soverix net, WireGuard VPN, V2Ray VLESS Reality, Low Ping Gaming VPN Bangladesh, 4K Streaming Accelerator & Military-Grade Online Privacy Gateway.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
