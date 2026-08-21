import React, { useState } from 'react';
import { 
  User, 
  Flame, 
  Laptop, 
  Smartphone, 
  Tv, 
  Router, 
  ShieldCheck, 
  Key, 
  Calendar, 
  Activity, 
  FileCheck, 
  Check,
  Copy,
  LogOut,
  Sparkles,
  Plus,
  LogIn,
  UserPlus,
  HelpCircle,
  X,
  Info,
  ShieldAlert,
  Gift,
  Trophy,
  Share2,
  Coins,
  ArrowRight,
  MessageCircle,
  Send
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { useAuth } from '../firebase/AuthContext';
import confetti from 'canvas-confetti';

interface AccountViewProps {
  lang: 'en' | 'bn';
  onOpenAuthModal?: (tab?: 'signin' | 'signup') => void;
  onNavigateToReferrals?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ lang, onOpenAuthModal, onNavigateToReferrals }) => {
  const t = TRANSLATIONS[lang];
  const { 
    user, 
    userProfile, 
    devices, 
    connectionLogs, 
    referrals,
    userReferralLink,
    userReferralCode,
    claimReferralReward,
    signOutUser, 
    addNewDevice, 
    removeDevice 
  } = useAuth();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRefLink, setCopiedRefLink] = useState(false);
  const [copiedRefCode, setCopiedRefCode] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showMasterKeyExplainer, setShowMasterKeyExplainer] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'pc' | 'mobile' | 'tv' | 'router'>('mobile');

  const fallbackEmail = 'soverixnet@gmail.com';
  const displayEmail = user?.email || userProfile?.email || fallbackEmail;
  const displayName = user?.displayName || userProfile?.displayName || 'Soverix VIP Member';
  const masterKey = userProfile?.vipMasterKey || 'SOVERIX-VIP-8B392835-972B-47CC-B1C1-770DC30AF179';

  const referralCount = userProfile?.referralCount || referrals.length || 0;
  const referralEarningsBDT = userProfile?.referralEarningsBDT || (referralCount * 150) || 0;
  const referralBonusDays = userProfile?.referralBonusDays || (referralCount * 15) || 0;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(masterKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyRefLink = () => {
    navigator.clipboard.writeText(userReferralLink);
    setCopiedRefLink(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setCopiedRefLink(false), 2000);
  };

  const handleCopyRefCode = () => {
    navigator.clipboard.writeText(userReferralCode);
    setCopiedRefCode(true);
    setTimeout(() => setCopiedRefCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = lang === 'bn'
      ? `🚀 Soverixnet VIP ভিপিএন এ জয়েন করে ফ্রি আনলিমিটেড কোয়ান্টাম সিকিউর ইন্টারনেট ও রিওয়ার্ড পান!\nআমার কোড: *${userReferralCode}*\nরেজিস্ট্রেশন লিংক: ${userReferralLink}`
      : `🚀 Get Ultra-Fast VIP Cyber VPN Access with my invite code: *${userReferralCode}*\nJoin link: ${userReferralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    await addNewDevice(newDeviceName.trim(), newDeviceType);
    setNewDeviceName('');
    setShowAddDeviceModal(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'pc': return Laptop;
      case 'tv': return Tv;
      case 'router': return Router;
      default: return Smartphone;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* If Not Authenticated, Show Prominent Login/Signup Hero Card */}
      {!user && (
        <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সোভারিক্সনেট ক্লাউড অ্যাকাউন্ট' : 'SoverixNet Cloud Account'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'সাইন ইন অথবা নতুন অ্যাকাউন্ট খুলুন' : 'Sign In or Create Your Account'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনার সেটিংস, ফেভারিট সার্ভার, লাইভ লগইন সেশন এবং ১০টি পর্যন্ত ডিভাইস ক্লাউড ডাটাবেসে সিঙ্ক রাখতে এখনই সাইন ইন করুন।' 
                  : 'Sync your security preferences, favorite nodes, multi-device sessions and connection history across all your devices.'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-400 text-cyan-300 font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'লগইন / সাইন ইন' : 'Sign In'}</span>
              </button>
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সাইন আপ করুন' : 'Sign Up Free'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Profile Card Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/20 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 shrink-0">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={displayName} 
                  className="w-full h-full rounded-2xl object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Flame className="w-8 h-8 text-amber-400" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-white tracking-wide">
                  {displayEmail}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  {userProfile?.plan || 'VIP PASS'}
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-medium mt-1">
                {displayName} • {t.account.plan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {user ? (
              <button
                onClick={signOutUser}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Register'}</span>
              </button>
            )}

            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-500/30 text-xs">
              <span className="text-slate-400 block text-[10px]">FIRESTORE SYNC</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {user ? (lang === 'bn' ? 'ক্লাউডে সক্রিয়' : 'Live Cloud') : (lang === 'bn' ? 'গেস্ট সেশন' : 'Guest Session')}
              </span>
            </div>
          </div>

        </div>

        {/* License Master Key Bar with Help Explanation trigger */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300 truncate max-w-full">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-400 shrink-0 flex items-center gap-1">
              <span>{lang === 'bn' ? 'মাস্টার কি (Master Key):' : 'Master Key:'}</span>
              <button
                onClick={() => setShowMasterKeyExplainer(true)}
                title={lang === 'bn' ? 'মাস্টার কি কী এবং কীভাবে কাজ করে?' : 'What is Master Key?'}
                className="text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-amber-300 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800 truncate select-all">
              {masterKey}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowMasterKeyExplainer(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:border-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'এটি কি?' : 'What is this?'}</span>
            </button>

            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? (lang === 'bn' ? 'টোকেন কপি হয়েছে!' : 'Token Copied!') : (lang === 'bn' ? 'মাস্টার কি কপি করুন' : 'Copy Key')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* VIP Referral & Earnings Hub Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900/90 via-teal-950/20 to-slate-900/90 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center text-black shadow-lg shadow-teal-500/20 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  {lang === 'bn' ? 'রেফারেল প্রোগ্রাম ও ফ্রি রিওয়ার্ডস' : 'Referral Program & VIP Rewards'}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {userProfile?.referralRewardTier || 'Bronze Pilot'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn' 
                  ? 'প্রতি সাইনআপে পান ১৫ দিন ফ্রি ভিআইপি এবং ৳১৫০ আর্নিং ক্রেডিট' 
                  : 'Earn 15 days free VIP boost + ৳150 credit for each friend who signs up'}
              </p>
            </div>
          </div>

          {onNavigateToReferrals && (
            <button
              onClick={onNavigateToReferrals}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal-500/20"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সম্পূর্ণ রেফারেল হাব ও লিডারবোর্ড ➔' : 'Open Referral Hub ➔'}</span>
            </button>
          )}
        </div>

        {/* 3 Metrics Mini Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
              {lang === 'bn' ? 'মোট রেফারেল' : 'Referrals'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-white font-mono">
              {referralCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
              {lang === 'bn' ? 'বোনাস ভিআইপি দিন' : 'Bonus Days'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-emerald-300 font-mono">
              +{referralBonusDays}d
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
              {lang === 'bn' ? 'অর্জিত ক্রেডিট' : 'Earnings'}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-amber-300 font-mono">
              ৳{referralEarningsBDT}
            </span>
          </div>
        </div>

        {/* Referral Link Quick Box */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>{lang === 'bn' ? 'আপনার ব্যক্তিগত ইনভাইট লিংক:' : 'Your Personal Invite Link:'}</span>
            <span className="font-mono text-teal-400">
              {lang === 'bn' ? 'কোড:' : 'Code:'} <strong className="text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{userReferralCode}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-teal-300 font-mono overflow-x-auto whitespace-nowrap scrollbar-thin select-all">
              {userReferralLink}
            </div>

            <button
              onClick={handleCopyRefLink}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
              title="Copy Link"
            >
              {copiedRefLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRefLink ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'লিংক কপি' : 'Copy')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
              title="Share to WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Live Referrals Mini List if Available */}
        {referrals.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {lang === 'bn' ? 'সাম্প্রতিক সাইনআপ তালিকা:' : 'Recent Referrals List:'}
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {referrals.slice(0, 4).map((r) => (
                <div key={r.id || r.refId} className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-sans font-semibold">{r.referredUserName || 'User'}</span>
                    <span className="text-[10px] text-slate-500">({r.referredUserEmail || 'masked'})</span>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    +৳{r.rewardAmountBDT || 150} / +{r.rewardBonusDays || 15}d ✅
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Connected Devices Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
              <span>{t.account.connectedDevices} ({devices.length > 0 ? devices.length : (user ? 1 : 4)}/10 Slots)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' ? 'আপনার অ্যাকাউন্টের সাথে সংযুক্ত সমস্ত সক্রিয় ডিভাইস পরিচালনা করুন' : 'Manage authorized sessions across phones, computers, and home routers.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => setShowAddDeviceModal(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ডিভাইস যোগ করুন' : 'Add Device'}</span>
              </button>
            )}
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
              MULTI-DEVICE SYNC
            </span>
          </div>
        </div>

        {/* Device List */}
        <div className="space-y-2.5">
          {devices.length > 0 ? (
            devices.map((device) => {
              const Icon = getDeviceIcon(device.deviceType);
              return (
                <div
                  key={device.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{device.deviceName}</h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono flex-wrap">
                        <span>{device.virtualIp}</span>
                        <span className="text-slate-600">•</span>
                        <span>{device.location}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-400">{device.activeSince}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeDevice(device.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'বিচ্ছিন্ন করুন' : 'Revoke'}</span>
                  </button>
                </div>
              );
            })
          ) : (
            [
              { id: '1', name: 'Windows 11 Cyber Rig', type: 'pc', ip: '10.66.66.2', location: 'Dhaka Node', activeSince: '2 hours ago' },
              { id: '2', name: 'iPhone 16 Pro Max', type: 'mobile', ip: '10.66.66.3', location: 'Singapore Node', activeSince: 'Just now' },
              { id: '3', name: 'MacBook Air M3', type: 'pc', ip: '10.66.66.4', location: 'Tokyo Node', activeSince: '1 day ago' },
              { id: '4', name: 'Sony Bravia 4K TV', type: 'tv', ip: '10.66.66.5', location: 'Frankfurt Node', activeSince: '5 days ago' },
            ].map((device) => {
              const Icon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{device.name}</h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                        <span>{device.ip}</span>
                        <span className="text-slate-600">•</span>
                        <span>{device.location}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-400">{device.activeSince}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
                    className="text-[11px] text-cyan-400 hover:underline font-mono cursor-pointer"
                  >
                    {lang === 'bn' ? 'লগইন করে সিঙ্ক করুন ➔' : 'Sign in to sync ➔'}
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Master Key Explainer Modal Popup */}
      {showMasterKeyExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#050b18] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
            
            <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setShowMasterKeyExplainer(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center text-black shadow-lg shadow-amber-500/20 shrink-0">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">
                  {lang === 'bn' ? 'মাস্টার কি (Master Key) কী এবং এর কাজ কী?' : 'What is the VIP Master Key?'}
                </h4>
                <p className="text-xs text-amber-300/80 font-mono">
                  Cryptographic Sovereign Token
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 mb-5">
              
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white mb-0.5">
                    {lang === 'bn' ? '১. পাসওয়ার্ড ছাড়া এক-ক্লিকে লগইন ও এক্সেস' : '1. Passwordless Instant Authentication'}
                  </h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === 'bn' 
                      ? 'এটি আপনার একাউন্টের একটি সিকিউর ডিজিটাল চাবি। স্মার্ট টিভি, রাউটার বা অন্য কোনো ডিভাইসে বারবার ইমেইল/পাসওয়ার্ড না লিখে শুধু এই কোডটি দিলেই আপনার VIP ভিপিএন চালু হয়ে যায়।' 
                      : 'A private license token that unlocks VIP VPN access across smart TVs, home routers, and other devices without typing email or password.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white mb-0.5">
                    {lang === 'bn' ? '২. কোয়ান্টাম এনক্রিপশন শিল্ড' : '2. NIST Kyber-1024 Quantum Encryption'}
                  </h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === 'bn' 
                      ? 'আপনার ইন্টারনেট ট্র্যাফিক মিলিটারি-গ্রেড ক্রিপ্টোগ্রাফি দিয়ে লক রাখতে এই মাস্টার কি-টি ব্যবহার করা হয়।' 
                      : 'Used by the Soverix encryption engine to derive post-quantum cryptographic tunnel handshakes.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white mb-0.5">
                    {lang === 'bn' ? '৩. WireGuard ও V2Ray কনফিগ ব্যাকআপ' : '3. WireGuard & V2Ray Config Authority'}
                  </h5>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === 'bn' 
                      ? 'যখন আপনি কনফিগ ফাইল ডাউনলোড করেন, তখন এই মাস্টার কি দ্বারা ভিপিএন টানেল ভেরিফাই হয়।' 
                      : 'Authenticates your profile when exporting custom WireGuard, OpenVPN, or VLESS Reality config files.'}
                  </p>
                </div>
              </div>

            </div>

            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between mb-4">
              <span className="font-mono truncate select-all">{masterKey}</span>
              <button
                onClick={handleCopyKey}
                className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[10px] shrink-0 ml-2 cursor-pointer"
              >
                {copiedKey ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => setShowMasterKeyExplainer(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {lang === 'bn' ? 'বুঝেছি, ধন্যবাদ!' : 'Understood, Close!'}
            </button>

          </div>
        </div>
      )}

      {/* Add Device Modal Dialog */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#050b18] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-4">
              {lang === 'bn' ? 'নতুন ডিভাইস নিবন্ধন করুন' : 'Register New Device Slot'}
            </h4>
            <form onSubmit={handleCreateDevice} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {lang === 'bn' ? 'ডিভাইসের নাম' : 'Device Name'}
                </label>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="e.g. iPad Pro M4 / Windows Workstation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {lang === 'bn' ? 'ডিভাইস টাইপ' : 'Device Type'}
                </label>
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="pc">Computer / Laptop (PC/Mac)</option>
                  <option value="mobile">Smartphone (Android/iOS)</option>
                  <option value="tv">Smart TV (Android TV/Apple TV)</option>
                  <option value="router">Home Gigabit Router (OpenWrt)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security & Zero Log Guarantee Certificate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'জিরো-লগ নীতি সার্টিফিকেশন' : 'Verified Zero-Logs Architecture'}
            </h5>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {lang === 'bn' 
                ? 'সোভারিক্সনেট কখনোই ব্যবহারকারীর ব্রাউজিং হিস্টোরি, ট্র্যাফিক ডেস্টিনেশন বা ডাটা সামগ্রী রেকর্ড বা সংরক্ষণ করে না। RAM-ডিস্ক সার্ভার মেমরি রিস্টার্টের সাথে সম্পূর্ণ তথ্য মুছে যায়।' 
                : '100% RAM-only servers. No connection logs, browsing metadata, or IP logs are ever written to persistent storage.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'ডেডিকেটেড প্রাইভেট আইপি সাপোর্ট' : 'Dedicated Private IP Tunnel'}
            </h5>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {lang === 'bn' 
                ? 'ব্যাংকিং বা সিকিউর সার্ভার এক্সেসের জন্য স্ট্যাটিক আন-শেয়ার্ড ডেডিকেটেড আইপি অ্যাক্টিভ আছে।' 
                : 'Exclusive static IPv4/IPv6 address assigned to your VIP account to avoid CAPTCHA triggers on banking portals.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
