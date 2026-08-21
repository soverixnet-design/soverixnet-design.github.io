import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Zap, 
  ShieldCheck, 
  Globe2, 
  CreditCard, 
  Smartphone, 
  Coins, 
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  X,
  Gift
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import confetti from 'canvas-confetti';

interface VipPlansViewProps {
  lang: 'en' | 'bn';
  onOpenAuthModal?: (tab?: 'signin' | 'signup') => void;
  onNavigateToReferrals?: () => void;
}

export const VipPlansView: React.FC<VipPlansViewProps> = ({ lang, onOpenAuthModal, onNavigateToReferrals }) => {
  const { user, userProfile, updateUserPreferences, signInDemoVip } = useAuth();
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'crypto'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const plans = [
    {
      id: 'turbo',
      name: lang === 'bn' ? 'গেমিং টার্বো (Gaming Turbo)' : 'Gaming Turbo 1-Month',
      duration: lang === 'bn' ? '১ মাস' : '1 Month',
      priceBDT: '২৯০',
      priceUSD: '$2.99',
      period: lang === 'bn' ? '/মাস' : '/mo',
      badge: lang === 'bn' ? 'লো-পিং স্পেশাল' : 'Low Ping',
      highlight: false,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      features: [
        lang === 'bn' ? '১৫ms আল্ট্রা-লো পিং গেমিং রুট' : '15ms Ultra-Low Ping Gaming Routes',
        lang === 'bn' ? '৩টি ডিভাইস একসাথে কানেক্ট' : '3 Simultaneous Device Connections',
        lang === 'bn' ? 'WireGuard ও Shadowsocks প্রোটোকল' : 'WireGuard & Shadowsocks 10Gbps',
        lang === 'bn' ? 'BDIX হাই-স্পিড ক্যাশ বাইপাস' : 'BDIX Ultra-Speed Routing',
        lang === 'bn' ? 'বিজ্ঞাপন ও ট্র্যাকার ব্লক (CleanNet)' : 'CleanNet AdBlocker Included',
      ]
    },
    {
      id: 'cyber_pro',
      name: lang === 'bn' ? 'সাইবার প্রো (Cyber Pro)' : 'Cyber Pro 1-Year',
      duration: lang === 'bn' ? '১ বছর' : '1 Year',
      priceBDT: '১,৯৫০',
      priceUSD: '$19.99',
      period: lang === 'bn' ? '/বছর' : '/yr',
      badge: lang === 'bn' ? 'সবচেয়ে জনপ্রিয় (Best Value)' : 'Most Popular',
      highlight: true,
      color: 'from-cyan-500 via-teal-400 to-blue-600',
      borderColor: 'border-cyan-400 shadow-xl shadow-cyan-500/20',
      features: [
        lang === 'bn' ? '৫০+ প্রিমিয়াম গ্লোবাল নোড এক্সেস' : 'All 50+ Global Server Locations',
        lang === 'bn' ? '৫টি ডিভাইস একসাথে কানেক্ট' : '5 Simultaneous Device Connections',
        lang === 'bn' ? '4K/8K বাফারিং ছাড়া স্ট্রিমিং' : '4K/8K Buffer-free Streaming Unlock',
        lang === 'bn' ? 'V2Ray VLESS Reality স্টিলথ মোড' : 'V2Ray VLESS Reality Stealth DPI Bypass',
        lang === 'bn' ? 'ডেডিকেটেড স্ট্যাটিক আইপি অপশন' : 'Dedicated Static IP Support',
        lang === 'bn' ? '২৪/৭ প্রায়োরিটি কাস্টমার সাপোর্ট' : '24/7 Priority Tech Support',
      ]
    },
    {
      id: 'lifetime',
      name: lang === 'bn' ? 'সার্বভৌম ভিআইপি লাইফটাইম (VIP Lifetime)' : 'Sovereign VIP Lifetime',
      duration: lang === 'bn' ? 'আজীবন (Lifetime)' : 'Lifetime Pass',
      priceBDT: '৪,৯০০',
      priceUSD: '$49.00',
      period: lang === 'bn' ? 'এককালীন' : 'one-time',
      badge: lang === 'bn' ? '👑 মেগা লাইফটাইম ডিল' : '👑 Elite Lifetime Pass',
      highlight: true,
      color: 'from-amber-400 via-yellow-500 to-orange-500',
      borderColor: 'border-amber-400/80 shadow-2xl shadow-amber-500/25',
      features: [
        lang === 'bn' ? 'আজীবন কোনো মাসিক ফি ছাড়া আনলিমিটেড' : 'Lifetime Access with Zero Monthly Fees',
        lang === 'bn' ? '১০টি ডিভাইস সম্পূর্ণ লাইফটাইম সিঙ্ক' : '10 Device Simultaneous Slots',
        lang === 'bn' ? 'NIST Kyber-1024 কোয়ান্টাম এনক্রিপশন' : 'NIST Kyber-1024 Quantum Shield',
        lang === 'bn' ? 'এক্সক্লুসিভ VIP মাস্টার সিকিউরিটি কি' : 'Cryptographic VIP Master Key Token',
        lang === 'bn' ? 'আনলিমিটেড ব্যান্ডউইথ ও RAM সার্ভার' : 'Unlimited Bandwidth RAM-Only Server',
        lang === 'bn' ? 'জিরো-লগ অডিট ভেরিফাইড গ্যারান্টি' : 'Zero-Log Certified Architecture',
      ]
    },
    {
      id: 'enterprise',
      name: lang === 'bn' ? 'কোয়ান্টাম এন্টারপ্রাইজ (Quantum Enterprise)' : 'Quantum Enterprise Pass',
      duration: lang === 'bn' ? 'কাস্টম' : 'Custom',
      priceBDT: '৯,৯০০',
      priceUSD: '$99.00',
      period: lang === 'bn' ? '/বছর' : '/yr',
      badge: lang === 'bn' ? 'বিজনেস ও টিম' : 'Business & Teams',
      highlight: false,
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500/30',
      features: [
        lang === 'bn' ? 'আনলিমিটেড ডিভাইস কানেকশন' : 'Unlimited Device Connections',
        lang === 'bn' ? 'কাস্টম ডেডিকেটেড ১০০Gbps সার্ভার' : 'Custom Dedicated 100Gbps Server Rack',
        lang === 'bn' ? 'টিম সেন্ট্রাল ম্যানেজমেন্ট ড্যাশবোর্ড' : 'Central Admin Team Management',
        lang === 'bn' ? 'কাস্টম DNS ও ফায়ারওয়াল রুলস' : 'Custom Internal DNS & Firewall Rules',
        lang === 'bn' ? 'ডেডিকেটেড একাউন্ট ম্যানেজার' : 'Dedicated Key Account Manager',
      ]
    }
  ];

  const handleSelectPlan = (plan: any) => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal('signin');
      return;
    }
    setSelectedPlanForPayment(plan);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      const planName = selectedPlanForPayment?.name || 'Sovereign VIP Lifetime';
      
      // Update locally or in Firestore
      if (userProfile) {
        userProfile.plan = planName;
      }
      
      try {
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      } catch {}

      setSuccessToast(
        lang === 'bn'
          ? `অভিনন্দন! আপনার ${planName} সফলভাবে সক্রিয় হয়েছে!`
          : `Congratulations! ${planName} is now active on your account!`
      );
      setSelectedPlanForPayment(null);
      setTrxId('');

      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md shadow-amber-500/10">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>{lang === 'bn' ? 'সোভারিক্সনেট অফিসিয়াল ভিআইপি সাবস্ক্রিপশন' : 'Soverixnet Official VIP Subscription'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {lang === 'bn' 
            ? 'কোয়ান্টাম স্পিড ও আনলিমিটেড প্রাইভেসি আনলক করুন' 
            : 'Upgrade to Ultra-Fast Sovereign VIP Privacy'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {lang === 'bn' 
            ? 'বিকাশ, নগদ, রকেট বা ক্রিপ্টোর মাধ্যমে সহজে পেমেন্ট করুন। ইনস্ট্যান্ট লাইফটাইম এক্টিভেশন ও ১০টি ডিভাইসে সম্পূর্ণ ক্লাউড সিঙ্ক।' 
            : 'Instant activation via bKash, Nagad, Cards & Crypto. Zero bandwidth caps, 15ms low-ping gaming, and 4K ultra-streaming.'}
        </p>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-3 shadow-2xl animate-bounce">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Free VIP via Referral Program Callout */}
      {onNavigateToReferrals && (
        <div 
          onClick={onNavigateToReferrals}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/40 border border-teal-500/40 hover:border-teal-400 transition-all cursor-pointer shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-teal-300 transition-colors">
                {lang === 'bn' 
                  ? 'টাকা ছাড়া ফ্রি ভিআইপি চান? বন্ধুদের রেফার করে জিতে নিন আজীবন মেম্বারশিপ!' 
                  : 'Want Free VIP without paying? Refer friends & unlock free subscription passes!'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'bn'
                  ? 'প্রতিটি সফল রেফারে পাবেন ১৫ দিন ফ্রি ভিআইপি ও ৳১৫০ আর্নিং ক্রেডিট।'
                  : 'Earn +15 VIP days & ৳150 credit for every friend who signs up with your invite link.'}
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-teal-500/20">
            <span>{lang === 'bn' ? 'রেফারেল লিংক তৈরি করুন ➔' : 'Get Referral Link ➔'}</span>
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isCurrentPlan = userProfile?.plan?.includes(plan.name) || (plan.id === 'lifetime' && userProfile?.plan?.includes('Lifetime'));
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-slate-900/95 via-[#071329] to-[#030917] border-2 ' + plan.borderColor
                  : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg text-black bg-gradient-to-r ${plan.color}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-base font-extrabold text-white mt-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{plan.duration}</p>

                {/* Price Display */}
                <div className="my-5 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ৳{plan.priceBDT}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({plan.priceUSD}) {plan.period}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4">
                {isCurrentPlan ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'বর্তমান সক্রিয় প্ল্যান' : 'Current Active Plan'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      plan.highlight
                        ? 'bg-gradient-to-r ' + plan.color + ' text-black hover:opacity-90 shadow-cyan-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'প্ল্যানটি নিন (Upgrade)' : 'Get This Plan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Payment Gateway Modal Dialog */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#050b18] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanForPayment(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center text-black">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'bn' ? 'পেমেন্ট গেটওয়ে - সোভারিক্সনেট' : 'Checkout & Instant Activation'}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedPlanForPayment.name} • ৳{selectedPlanForPayment.priceBDT} ({selectedPlanForPayment.priceUSD})
                </p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>বিকাশ (bKash)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'bg-orange-600/20 border-orange-500 text-orange-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>নগদ (Nagad)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>Card (Visa)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  paymentMethod === 'crypto'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>Crypto (USDT)</span>
              </button>
            </div>

            {/* Payment Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-300">
                <span>{lang === 'bn' ? 'মার্চেন্ট / একাউন্ট নম্বর:' : 'Merchant Number:'}</span>
                <span className="font-mono font-bold text-cyan-400">01700-SOVERIX (01799-887766)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{lang === 'bn' ? 'পরিশোধযোগ্য মোট টাকা:' : 'Total Payable Amount:'}</span>
                <span className="font-mono font-black text-amber-400 text-sm">৳{selectedPlanForPayment.priceBDT} BDT</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn' 
                  ? 'Send Money অথবা Make Payment সম্পন্ন করে নিচে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।' 
                  : 'Complete payment and enter your TrxID or press Instant Activate for demo mode.'}
              </p>
            </div>

            {/* TrxID Input */}
            <div className="mt-4 space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300">
                {lang === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) / কার্ড রেফারেন্স' : 'Transaction ID (TrxID) / Reference'}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. BLX9882771 / DEMO-VIP-ACTIVATE"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Confirm Submit */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlanForPayment(null)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold cursor-pointer"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পেমেন্ট নিশ্চিত ও সক্রিয় করুন' : 'Confirm & Activate VIP'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">
              {lang === 'bn' ? 'ইনস্ট্যান্ট অটো-অ্যাক্টিভেশন' : 'Instant Auto-Activation'}
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'bn' ? 'পেমেন্টের পর সাথে সাথে ভিআইপি ফিচার চালু হবে' : 'Immediate access to all nodes & quantum keys.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">
              {lang === 'bn' ? '৭ দিনের মানি-ব্যাক গ্যারান্টি' : '7-Day Money-Back Guarantee'}
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'bn' ? 'সার্ভিসে সন্তুষ্ট না হলে সম্পূর্ণ রিফান্ড' : '100% risk-free trial with full refund option.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">
              {lang === 'bn' ? '১০টি ডিভাইসে আনলিমিটেড সিঙ্ক' : '10 Device Multi-Login'}
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'bn' ? 'পিসি, মোবাইল ও টিভিতে এক পাসওয়ার্ডেই চলবে' : 'Share access across all your personal devices.'}
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Channel Help & Free Configs Card */}
      <div className="p-5 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-1.99-.46-1.657-.683-2.73-2.366-2.812-2.476-.083-.11-1.01-1.348-1.01-2.572 0-1.223.636-1.824.862-2.073.226-.249.493-.311.658-.311.164 0 .328.002.472.01.153.007.358-.058.56.427.207.499.704 1.722.766 1.847.062.125.103.271.021.434-.083.164-.124.266-.247.41-.124.144-.261.322-.373.432-.124.123-.254.256-.11.503.144.247.641 1.057 1.376 1.713.946.843 1.744 1.104 1.991 1.228.247.124.391.103.535-.062.145-.165.618-.719.783-.967.165-.247.33-.206.556-.123.226.082 1.436.677 1.683.801.247.124.412.185.473.288.062.103.062.597-.082 1.002zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.174L2 22l4.981-1.306C8.441 21.545 10.16 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-bold text-white">
              {lang === 'bn' ? 'কাস্টম সাহায্য বা ফ্রি আপডেটের জন্য WhatsApp চ্যানেলে যুক্ত থাকুন' : 'Follow Global Free Internet on WhatsApp'}
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'bn' ? 'যে কোনো প্রশ্ন, পেমেন্ট সংক্রান্ত তথ্য ও ফ্রি সার্ভার কনফিগ ট্রিক্স।' : 'Join our official WhatsApp channel for direct support & free daily config files.'}
            </p>
          </div>
        </div>

        <a
          href="https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>{lang === 'bn' ? 'WhatsApp চ্যানেলে জয়েন করুন ➔' : 'Join WhatsApp Channel ➔'}</span>
        </a>
      </div>

    </div>
  );
};
