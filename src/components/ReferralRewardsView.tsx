import React, { useState } from 'react';
import { 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Award, 
  Trophy, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Crown, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  Coins, 
  Send,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import confetti from 'canvas-confetti';

interface ReferralRewardsViewProps {
  lang: 'en' | 'bn';
  onNavigateToPlans?: () => void;
  onOpenAuth?: () => void;
}

export const ReferralRewardsView: React.FC<ReferralRewardsViewProps> = ({
  lang,
  onNavigateToPlans,
  onOpenAuth
}) => {
  const { 
    user, 
    userProfile, 
    referrals, 
    userReferralLink, 
    userReferralCode, 
    claimReferralReward 
  } = useAuth();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [claimLoading, setClaimLoading] = useState<string | null>(null);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  const referralCount = userProfile?.referralCount || referrals.length || 0;
  const earningsBDT = userProfile?.referralEarningsBDT || (referralCount * 150) || 0;
  const bonusDays = userProfile?.referralBonusDays || (referralCount * 15) || 0;
  const currentTier = userProfile?.referralRewardTier || (
    referralCount >= 25 ? 'Quantum Titan' :
    referralCount >= 10 ? 'Gold Commander' :
    referralCount >= 5 ? 'Silver Voyager' : 'Bronze Pilot'
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userReferralLink);
    setCopiedLink(true);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userReferralCode);
    setCopiedCode(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareNative = async () => {
    const shareTitle = lang === 'bn' 
      ? 'সোভারিক্সনেট আল্ট্রা-ফাস্ট কোয়ান্টাম ভিপিএন' 
      : 'Soverixnet Cyber VPN - Free VIP Pass';
    const shareText = lang === 'bn'
      ? `আমার রেফারেল কোড [${userReferralCode}] ব্যবহার করে সাইন আপ করুন এবং ফ্রি হাই-স্পিড ভিআইপি ভিপিএন ও রিওয়ার্ড পান! 🚀\nজয়েন লিংক:`
      : `Get Free High-Speed VIP Quantum VPN Access with my invite code [${userReferralCode}]! 🚀\nJoin here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: userReferralLink,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    const text = lang === 'bn'
      ? `🚀 Soverixnet VPN এ জয়েন করে ফ্রি আনলিমিটেড কোয়ান্টাম সিকিউর ইন্টারনেট ও ভিআইপি এক্সেস উপভোগ করুন!\n\nআমার রেফারেল কোড: *${userReferralCode}*\nরেজিস্ট্রেশন লিংক: ${userReferralLink}\n\nহোয়াটসঅ্যাপ চ্যানেল: https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13`
      : `🚀 Experience ultra-fast quantum security on Soverixnet VPN!\n\nUse my invite code: *${userReferralCode}*\nSign up here: ${userReferralLink}\n\nJoin WhatsApp Channel: https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = lang === 'bn'
      ? `🚀 Soverixnet VPN এ জয়েন করে ফ্রি ভিআইপি মেম্বারশিপ পান! রেফারেল কোড: ${userReferralCode}`
      : `🚀 Join Soverixnet Cyber VPN for free VIP pass! Referral Code: ${userReferralCode}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(userReferralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleClaim = async (rewardType: 'days' | 'credits' | 'upgrade', tierName: string) => {
    setClaimLoading(tierName);
    setClaimSuccessMsg(null);
    try {
      const ok = await claimReferralReward(rewardType);
      if (ok) {
        setClaimSuccessMsg(
          lang === 'bn'
            ? `🎉 অভিনন্দন! "${tierName}" রিওয়ার্ড সফলভাবে আপনার প্রোফাইলে যুক্ত হয়েছে!`
            : `🎉 Congratulations! "${tierName}" reward has been credited to your VIP account!`
        );
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }
    } finally {
      setClaimLoading(null);
    }
  };

  // Gamified Milestones
  const milestones = [
    {
      id: 'm1',
      tier: 'Bronze Pilot',
      requiredRefs: 1,
      rewardTitle: lang === 'bn' ? '+১৫ দিন ফ্রি টার্বো ভিআইপি' : '+15 Days Free Turbo VIP',
      rewardValue: '৳175 Value',
      desc: lang === 'bn' ? 'প্রথম ১ জন বন্ধুকে রেফার করলেই ১৫ দিনের ফুল ভিআইপি ভিপিএন' : 'Get +15 bonus days of high-speed gaming VIP access',
      badgeColor: 'from-amber-700 to-amber-900 border-amber-600/40 text-amber-300',
      icon: Flame,
      claimType: 'days' as const,
    },
    {
      id: 'm2',
      tier: 'Silver Voyager',
      requiredRefs: 5,
      rewardTitle: lang === 'bn' ? '১ মাস ফ্রি সাইবার প্রো মেম্বারশিপ' : '1 Month Cyber Pro VIP Pass',
      rewardValue: '৳350 Value',
      desc: lang === 'bn' ? '৫ জন বন্ধু জয়েন করলে ১ মাসের ফ্রি সাইবার প্রো সাবস্ক্রিপশন' : 'Unlock full month unrestricted global mesh access',
      badgeColor: 'from-slate-400 to-slate-600 border-slate-300/40 text-slate-100',
      icon: Award,
      claimType: 'days' as const,
    },
    {
      id: 'm3',
      tier: 'Gold Commander',
      requiredRefs: 10,
      rewardTitle: lang === 'bn' ? '১ বছর সার্বভৌম ভিআইপি পাস' : '1-Year Sovereign VIP Pass',
      rewardValue: '৳1,850 Value',
      desc: lang === 'bn' ? '১০ জন বন্ধুকে রেফার করে পান ১ বছরের জন্য সম্পূর্ণ ফ্রি ভিআইপি' : 'Full 1-year unrestricted multi-protocol cyber shield',
      badgeColor: 'from-yellow-400 to-amber-600 border-yellow-300/50 text-yellow-200',
      icon: Trophy,
      claimType: 'upgrade' as const,
    },
    {
      id: 'm4',
      tier: 'Quantum Titan',
      requiredRefs: 25,
      rewardTitle: lang === 'bn' ? 'আজীবন লাইফটাইম ভিআইপি + ৳৫,০০০ ক্যাশ' : 'Lifetime VIP Pass + ৳5,000 Reseller Credits',
      rewardValue: '৳5,000+ Value',
      desc: lang === 'bn' ? '২৫ জন বন্ধু জয়েন করলে আজীবন ফ্রি ভিআইপি ও রিসেলার ওয়ালেটে ক্যাশ ক্রেডিট' : 'Permanent Sovereign Lifetime pass + ৳5,000 reseller credit balance',
      badgeColor: 'from-cyan-400 via-blue-600 to-purple-600 border-cyan-300/50 text-cyan-200',
      icon: Crown,
      claimType: 'upgrade' as const,
    },
  ];

  // Top Referrers Mock Leaderboard with live user merged
  const mockLeaderboard = [
    { rank: 1, name: 'Shahidul Sovereign', email: 'shahidul***@gmail.com', count: 42, tier: 'Quantum Titan', earnings: '৳6,300' },
    { rank: 2, name: 'Cyber Hunter BD', email: 'tanvir***@yahoo.com', count: 31, tier: 'Quantum Titan', earnings: '৳4,650' },
    { rank: 3, name: 'Rashed V2Ray Pro', email: 'rashed***@outlook.com', count: 24, tier: 'Gold Commander', earnings: '৳3,600' },
    { rank: 4, name: 'Mehedi WireGuard', email: 'mehedi***@gmail.com', count: 17, tier: 'Gold Commander', earnings: '৳2,550' },
    { rank: 5, name: 'Habib Cyber Pilot', email: 'habib***@gmail.com', count: 12, tier: 'Gold Commander', earnings: '৳1,800' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#09152e] via-[#050b18] to-[#02050f] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide">
              <Gift className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>{lang === 'bn' ? 'সোভারিক্স রেফারেল ও রিওয়ার্ড সিস্টেম' : 'Soverixnet Referral & Rewards System'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'প্রতি রেফারে ৳১৫০ + ১৫ দিন ফ্রি ভিআইপি' : 'Earn ৳150 + 15 Days VIP per Signup'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {lang === 'bn' ? (
              <>
                বন্ধুদের ইনভাইট করুন, জিতুন{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  আজীবন ফ্রি ভিআইপি পাস
                </span>
              </>
            ) : (
              <>
                Invite Friends & Unlock{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  Free Lifetime VIP Access
                </span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6">
            {lang === 'bn'
              ? 'আপনার ইউনিক রেফারেল লিংক বা কোড বন্ধুদের সাথে শেয়ার করুন। তারা সাইন আপ করার সাথে সাথেই আপনার একাউন্টে ইনস্ট্যান্ট ফ্রি বোনাস দিন ও ক্যাশ রিওয়ার্ড যুক্ত হবে!'
              : 'Share your personal referral link or invite code. Every time a friend registers, you instantly earn bonus VIP subscription days and BDT credit rewards.'}
          </p>

          {/* Prompt to Sign In if Guest */}
          {!user && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'bn' ? 'রেফারেল লিংক পেতে সাইন ইন করুন' : 'Sign In to Generate Your Unique Referral Link'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'সাইন ইন করলেই স্বয়ংক্রিয়ভাবে আপনার ইউনিক কোড তৈরি হবে।' : 'Personal invite code & stats will be generated instantly.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <span>{lang === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Referral Link & Share Box */}
          <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-4 sm:p-6 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Link Display */}
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{lang === 'bn' ? 'আপনার ইউনিক রেফারেল লিংক:' : 'Your Unique Referral Link:'}</span>
                  <span className="font-mono text-cyan-400">
                    {lang === 'bn' ? 'কোড:' : 'Code:'} <strong className="text-white px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">{userReferralCode}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900/90 border border-slate-700/80 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono overflow-x-auto whitespace-nowrap scrollbar-thin select-all">
                    {userReferralLink}
                  </div>
                  
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'লিংক কপি' : 'Copy Link')}</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                    title="Copy Code Only"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{lang === 'bn' ? 'কোড' : 'Code'}</span>
                  </button>
                </div>
              </div>

              {/* Social 1-Click Share Buttons */}
              <div className="lg:col-span-4 flex flex-wrap items-center gap-2 pt-2 lg:pt-0 lg:border-l lg:border-slate-800 lg:pl-4">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 min-w-[110px] py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleShareTelegram}
                  className="flex-1 min-w-[110px] py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={handleShareNative}
                  className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="More Share Options"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowQrCode(!showQrCode)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showQrCode 
                      ? 'bg-cyan-500 text-black border-cyan-400' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Display QR Code"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR</span>
                </button>
              </div>

            </div>

            {/* Collapsible QR Code Panel */}
            {showQrCode && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-xl">
                <div className="p-2 bg-white rounded-xl shadow-lg shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(userReferralLink)}`}
                    alt="Referral QR Code"
                    className="w-28 h-28"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h5 className="text-sm font-bold text-white">
                    {lang === 'bn' ? 'মোবাইল দিয়ে কিউআর কোড স্ক্যান করুন' : 'Scan QR Code with Mobile Camera'}
                  </h5>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn'
                      ? 'বন্ধুদের সরাসরি ক্যামেরা দিয়ে স্ক্যান করিয়ে ইনস্ট্যান্ট জয়েন করান।'
                      : 'Point any phone camera to directly open your invitation link and activate rewards.'}
                  </p>
                  <p className="text-[11px] font-mono text-cyan-400">{userReferralLink}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Referrals */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              {lang === 'bn' ? 'মোট সফল রেফারেল' : 'Total Referrals'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {referralCount} <span className="text-xs font-normal text-slate-400">{lang === 'bn' ? 'জন' : 'Users'}</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{lang === 'bn' ? '১০০% ভেরিফাইড সাইনআপ' : '100% Verified Signups'}</span>
          </p>
        </div>

        {/* Total BDT Earned */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              {lang === 'bn' ? 'মোট উপার্জিত কমিশন' : 'Total Earned (BDT)'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            ৳{earningsBDT.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {lang === 'bn' ? '৳১৫০/জন সফল রেফারেল' : '৳150 per referral credit'}
          </p>
        </div>

        {/* Bonus VIP Days */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              {lang === 'bn' ? 'অর্জিত ভিআইপি বোনাস' : 'VIP Bonus Days'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            +{bonusDays} <span className="text-xs font-normal text-slate-400">{lang === 'bn' ? 'দিন' : 'Days'}</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            {lang === 'bn' ? 'সরাসরি সাবস্ক্রিপশনে যোগ' : 'Added to VIP validity'}
          </p>
        </div>

        {/* Current Reward Tier */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              {lang === 'bn' ? 'বর্তমান রিওয়ার্ড টায়ার' : 'Current Reward Tier'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white truncate">
            {currentTier}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (referralCount / 25) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Claim Success Banner */}
      {claimSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{claimSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setClaimSuccessMsg(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Gamified Reward Milestones */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{lang === 'bn' ? 'রেফারেল মাইলস্টোন ও আনলক রিওয়ার্ড' : 'Referral Milestones & Unlockable Rewards'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' 
                ? 'টার্গেট পূরণ করে ইনস্ট্যান্ট ফ্রি ভিআইপি মেম্বারশিপ ও রিসেলার ক্যাশ রিওয়ার্ড ক্লেইম করুন' 
                : 'Reach milestone targets to claim free VIP passes, cash bonuses, and tier rank promotions'}
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400">
            {lang === 'bn' ? `আপনার মোট রেফার: ${referralCount} জন` : `Your Score: ${referralCount} Invites`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => {
            const Icon = m.icon;
            const isUnlocked = referralCount >= m.requiredRefs;
            const progressPct = Math.min(100, Math.round((referralCount / m.requiredRefs) * 100));

            return (
              <div
                key={m.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isUnlocked 
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/40' 
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r border ${m.badgeColor}`}>
                      {m.tier}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {m.requiredRefs} {lang === 'bn' ? 'রেফার' : 'Refs'}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3">
                    <Icon className={`w-5 h-5 ${isUnlocked ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {m.rewardTitle}
                  </h4>
                  <div className="text-xs font-bold text-emerald-400 mb-2">
                    {m.rewardValue}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    {m.desc}
                  </p>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{lang === 'bn' ? 'অগ্রগতি' : 'Progress'}</span>
                      <span className="text-cyan-400 font-bold">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-slate-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    disabled={!isUnlocked || claimLoading === m.tier}
                    onClick={() => handleClaim(m.claimType, m.rewardTitle)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25'
                        : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{claimLoading === m.tier ? (lang === 'bn' ? 'যুক্ত হচ্ছে...' : 'Claiming...') : (lang === 'bn' ? 'রিওয়ার্ড ক্লেইম করুন' : 'Claim Reward')}</span>
                      </>
                    ) : (
                      <span>{lang === 'bn' ? `আরও ${m.requiredRefs - referralCount} জন বাকি` : `${m.requiredRefs - referralCount} more needed`}</span>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Live Referred Friends Table & Global Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Referred Users */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'bn' ? 'আপনার রেফারেল হিস্ট্রি (লাইভ ট্র্যাকিং)' : 'Your Referral History (Live Tracking)'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {referrals.length} {lang === 'bn' ? 'টি এন্ট্রি' : 'entries'}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {referrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">{lang === 'bn' ? 'রেফার করা ইউজার' : 'Referred User'}</th>
                      <th className="p-3.5">{lang === 'bn' ? 'অ্যাক্টিভ প্ল্যান' : 'Plan'}</th>
                      <th className="p-3.5">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                      <th className="p-3.5 text-right">{lang === 'bn' ? 'রিওয়ার্ড স্ট্যাটাস' : 'Reward Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {referrals.map((ref) => (
                      <tr key={ref.id || ref.refId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white font-sans">{ref.referredUserName || 'Cyber Pilot'}</div>
                          <div className="text-[10px] text-slate-400">{ref.referredUserEmail || 'user***@gmail.com'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px]">
                            {ref.plan || 'Sovereign VIP'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            <Check className="w-3 h-3" />
                            <span>+৳{ref.rewardAmountBDT || 150} / +{ref.rewardBonusDays || 15}d</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <Gift className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'bn' ? 'এখনো কোনো রেফারেল রেকর্ড নেই' : 'No Referrals Yet'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {lang === 'bn'
                    ? 'আপনার বন্ধুদের সাথে উপরের ইউনিক লিংকটি শেয়ার করুন। তারা সাইন আপ করলে এখানে সাথে সাথে দৃশ্যমান হবে।'
                    : 'Share your personal referral link above. As soon as your friends join, they will appear here in real-time.'}
                </p>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে ইনভাইট পাঠান' : 'Invite on WhatsApp'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Referral Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? '🏆 সেরা রেফারার লিডারবোর্ড' : '🏆 Top Referrers Leaderboard'}</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সাপ্তাহিক র্যাংক' : 'Weekly Ranks'}</span>
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            {mockLeaderboard.map((item) => (
              <div
                key={item.rank}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  item.rank === 1
                    ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-900 border-amber-500/40 shadow-md'
                    : item.rank === 2
                    ? 'bg-gradient-to-r from-slate-300/10 via-slate-400/5 to-slate-900 border-slate-400/30'
                    : item.rank === 3
                    ? 'bg-gradient-to-r from-amber-700/10 via-amber-800/5 to-slate-900 border-amber-700/30'
                    : 'bg-slate-950/60 border-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30' :
                    item.rank === 2 ? 'bg-slate-300 text-black' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {item.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.rank === 1 && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.email}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-cyan-300 font-mono">
                    {item.count} <span className="text-[10px] text-slate-400 font-normal">{lang === 'bn' ? 'রেফার' : 'invites'}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold font-mono">
                    {item.earnings}
                  </div>
                </div>
              </div>
            ))}

            {/* Official WhatsApp Community Callout */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 p-3 bg-gradient-to-r from-emerald-950/40 to-slate-950 rounded-xl border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'গ্লোবাল ফ্রি ইন্টারনেট চ্যানেল' : 'Global Free Internet WhatsApp'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {lang === 'bn' ? 'প্রতিদিনের ফ্রি ট্রিক ও ভিআইপি কনফিগ আপডেট পান' : 'Join for daily free VPN payloads and server updates'}
                </div>
              </div>
              <a
                href="https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] shrink-0 transition-all"
              >
                {lang === 'bn' ? 'যুক্ত হোন' : 'Join Channel'}
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 3-Step "How It Works" Guide */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-extrabold text-white">
            {lang === 'bn' ? 'রেফারেল সিস্টেম কিভাবে কাজ করে?' : 'How the Referral System Works'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn' 
              ? 'সহজ ৩ ধাপে আনলিমিটেড ফ্রি ভিআইপি মেম্বারশিপ ও ক্যাশ আর্ন করুন' 
              : 'Earn free VIP days and commissions in 3 simple automated steps'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-sm mb-4">
              01
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {lang === 'bn' ? '১. লিংক বা কোড শেয়ার করুন' : '1. Share Invite Link'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আপনার ইউনিক রেফারেল লিংক অথবা কোড কপি করে হোয়াটসঅ্যাপ, টেলিগ্রাম বা ফেসবুকে বন্ধুদের কাছে পাঠান।'
                : 'Copy your personalized invite link or code and share it on WhatsApp, Telegram, or social media.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold text-sm mb-4">
              02
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {lang === 'bn' ? '২. বন্ধু সাইন আপ করবে' : '2. Friend Registers'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আপনার বন্ধু লিংকে ক্লিক করে নতুন অ্যাকাউন্ট খুললে রেফারেল কোডটি স্বয়ংক্রিয়ভাবে ডাটাবেসে কানেক্ট হবে।'
                : 'When your friend opens the link and creates an account, your referral code is automatically tracked in Firestore.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm mb-4">
              03
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              {lang === 'bn' ? '৩. ইনস্ট্যান্ট রিওয়ার্ড পান' : '3. Instant Rewards'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'প্রতি সাইনআপে আপনি পাবেন ১৫ দিন ফ্রি ভিআইপি এবং ৳১৫০ কমিশন। মাইলস্টোন পূর্ণ হলে পাবেন লাইফটাইম পাস!'
                : 'Instantly receive 15 days free VIP pass extension + ৳150 credit. Reach milestones for full Lifetime passes!'}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleShareWhatsApp}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === 'bn' ? 'এখনই বন্ধুদের ইনভাইট করুন' : 'Start Inviting Friends Now'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
