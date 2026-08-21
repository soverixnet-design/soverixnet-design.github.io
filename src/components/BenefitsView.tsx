import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  EyeOff, 
  Gamepad2, 
  Tv, 
  CheckCircle2, 
  Sparkles, 
  Globe2, 
  ArrowRight, 
  CreditCard, 
  Ban, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Award, 
  Server,
  AlertTriangle,
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface BenefitsViewProps {
  lang: 'en' | 'bn';
  onConnectNow: () => void;
}

export const BenefitsView: React.FC<BenefitsViewProps> = ({ lang, onConnectNow }) => {
  const t = TRANSLATIONS[lang];

  // Interactive Privacy Calculator State
  const [usePublicWifi, setUsePublicWifi] = useState(true);
  const [useOnlineBanking, setUseOnlineBanking] = useState(true);
  const [useGamingStreaming, setUseGamingStreaming] = useState(true);
  const [visitBlockedSites, setVisitBlockedSites] = useState(true);
  const [worryIspTracking, setWorryIspTracking] = useState(true);

  // FAQ Accordion Open Items
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculate simulated risk level
  const riskFactors = [usePublicWifi, useOnlineBanking, useGamingStreaming, visitBlockedSites, worryIspTracking].filter(Boolean).length;
  const vulnerabilityPercent = riskFactors * 20; // 0 to 100%

  const benefitsList = [
    {
      icon: Lock,
      color: 'from-cyan-500 to-blue-600',
      title: lang === 'bn' ? '১. ১০০% হ্যাকার ও স্নুপিং প্রটেকশন' : '1. Military-Grade Snooping Protection',
      subtitle: lang === 'bn' ? 'পাবলিক ওয়াইফাইতে সর্বোচ্চ নিরাপত্তা' : 'Absolute defense on coffee shop & hotel Wi-Fi',
      desc: lang === 'bn' 
        ? 'হোটেল, ক্যাফে বা ফ্রি পাবলিক ওয়াইফাই ব্যবহার করলে হ্যাকাররা সহজেই আপনার পাসওয়ার্ড ও কার্ড ডাটা চুরি করতে পারে। সোভারিক্সনেট-এর কোয়ান্টাম এনক্রিপশন আপনার সব ডাটাকে অভেদ্য দুর্গের মতো সুরক্ষিত রাখে।' 
        : 'Public Wi-Fi networks in airports and cafes are prime hunting grounds for packet sniffing. Soverixnet encapsulates all traffic in a post-quantum encrypted tunnel that no attacker can breach.'
    },
    {
      icon: CreditCard,
      color: 'from-emerald-500 to-teal-600',
      title: lang === 'bn' ? '২. নিরাপদ অনলাইন ব্যাংকিং ও পেমেন্ট' : '2. Bank-Grade Financial Shield',
      subtitle: lang === 'bn' ? 'বিকাশ, নগদ ও ক্রেডিট কার্ড সুরক্ষা' : 'Safeguard credit cards, bKash & crypto wallets',
      desc: lang === 'bn' 
        ? 'অনলাইনে কেনাকাটা বা মোবাইল ব্যাংকিং লেনদেনের সময় ফিশিং আক্রমণ ও ম্যান-ইন-দ্য-মিডল (MITM) অ্যাটাক বন্ধ করে ১০০% নিরাপদ ট্রানজ্যাকশন নিশ্চিত করে।' 
        : 'Zero-leak DNS and TLS 1.3 Reality ensure your bank credentials, crypto seeds, and OTP sessions can never be intercepted by malicious intermediate proxies.'
    },
    {
      icon: Gamepad2,
      color: 'from-purple-500 to-indigo-600',
      title: lang === 'bn' ? '৩. আল্ট্রা লো-পিং গেমিং (Esports Ready)' : '3. Ultra Low-Ping Esports Gaming',
      subtitle: lang === 'bn' ? 'ফ্রি ফায়ার, পাবজি ও ভ্যালোর্যান্ট-এ জিরো ল্যাগ' : 'Eliminate jitter & packet loss in competitive titles',
      desc: lang === 'bn' 
        ? 'গেমিংয়ের সময় আইএসপি থ্রোটলিং দূর করে এবং ঢাকা, সিঙ্গাপুর, টোকিওর সরাসরি নোডের মাধ্যমে পিং সর্বনিম্ন (৮-২৮ ms) নামিয়ে আনে। কোনো ফ্রেম ড্রপ বা প্যাকেট লস হবে না।' 
        : 'Bypass ISP throttling and inefficient routing with dedicated 10 Gbps low-jitter game servers optimized for PUBG, Free Fire, Valorant, and Warzone.'
    },
    {
      icon: Tv,
      color: 'from-rose-500 to-pink-600',
      title: lang === 'bn' ? '৪. আনলিমিটেড 4K স্ট্রিমিং ও ব্লক সাইট আনব্লক' : '4. 4K UHD Buffer-Free Streaming',
      subtitle: lang === 'bn' ? 'Netflix, Disney+, BBC iPlayer আনব্লক' : 'Access global libraries without geographic blocks',
      desc: lang === 'bn' 
        ? 'বিশ্বের যেকোনো দেশের ব্লক করা ওয়েবসাইট, অ্যাপস বা ওটিটি প্ল্যাটফর্মের কন্টেন্ট 4K আল্ট্রা HD কোয়ালিটিতে বাফারিং ছাড়াই উপভোগ করুন।' 
        : 'Bypass harsh geographic restrictions instantly. Unlock full US, UK, and Japan catalogues on Netflix, YouTube 4K, Disney+, and live sports streams with zero buffering.'
    },
    {
      icon: Ban,
      color: 'from-amber-500 to-orange-600',
      title: lang === 'bn' ? '৫. ক্লিন-নেট অ্যাডব্লকার (৪০% ডাটা সাশ্রয়)' : '5. CleanNet AdBlock (Save 40% Mobile Data)',
      subtitle: lang === 'bn' ? 'বিরক্তিকর পপ-আপ ও ক্ষতিকর ট্র্যাকার মুক্ত' : 'Strip annoying ads, banners, and battery drains',
      desc: lang === 'bn' 
        ? 'ওয়েবসাইট এবং অ্যাপসের ভেতরে থাকা ভারী বিজ্ঞাপন ও ট্র্যাকার ব্লক করে পেজ লোডিং স্পিড দ্বিগুণ করে এবং আপনার মোবাইল ডাটা ও ফোনের ব্যাটারি বাঁচায়।' 
        : 'Intelligent DNS filters wipe out malicious ads, popups, and crypto-mining scripts before they load, saving mobile bandwidth and dramatically speeding up browsing.'
    },
    {
      icon: EyeOff,
      color: 'from-cyan-400 to-emerald-500',
      title: lang === 'bn' ? '৬. ১০০% জিরো-লগ নীতি ও প্রাইভেসি গ্যারান্টি' : '6. Absolute Zero-Logs Guarantee',
      subtitle: lang === 'bn' ? 'র‍্যাম-অনলি সার্ভার (কোনো তথ্য সংরক্ষণ নয়)' : 'RAM-only volatile servers leave zero digital trace',
      desc: lang === 'bn' 
        ? 'আপনার ব্রাউজিং হিস্টোরি, আইপি এড্রেস বা ডাউনলোড সংক্রান্ত কোনো তথ্য সোভারিক্সনেট কখনো রেকর্ড বা বিক্রি করে না। সার্ভার রিস্টার্টের সাথে সব মেমরি স্বয়ংক্রিয়ভাবে মুছে যায়।' 
        : 'We never log connection timestamps, IP allocations, or destination metadata. Certified RAM-only architecture wipes all volatility on reboot.'
    }
  ];

  const faqs = [
    {
      q: lang === 'bn' ? 'সোভারিক্সনেট (Soverixnet) ভিপিএন কেন সবার চেয়ে আলাদা?' : 'Why is Soverixnet superior to conventional VPNs?',
      a: lang === 'bn' 
        ? 'সোভারিক্সনেট সাধারণ ভিপিএন-এর চেয়ে বহুগুণ দ্রুত কারণ এটি WireGuard এবং V2Ray VLESS Reality-র মতো সর্বাধুনিক ও হালকা প্রোটোকল ব্যবহার করে। এতে কোনো স্পিড ড্রপ হয় না এবং এটি যেকোনো কঠোর সেন্সরশিপ অদৃশ্যভাবে বাইপাস করতে পারে।' 
        : 'Soverixnet incorporates cutting-edge WireGuard and V2Ray VLESS XTLS Reality protocols, running on 10 Gbps bare-metal RAM servers with post-quantum Kyber cryptography.'
    },
    {
      q: lang === 'bn' ? 'সোভারিক্সনেট ব্যবহার করলে কি আমার ইন্টারনেটের গতি কমে যাবে?' : 'Will Soverixnet slow down my internet speed?',
      a: lang === 'bn' 
        ? 'একেবারেই না! বরং অনেক ক্ষেত্রে আইএসপি (ISP)-এর কৃত্রিম স্পিড লিমিট এবং থ্রোটলিং বাইপাস করে আপনার ডাউনলোড ও ব্রাউজিং স্পিড আরও বৃদ্ধি পাবে।' 
        : 'No. In fact, by defeating aggressive ISP bandwidth throttling and routing via direct fiber peering nodes, latency is reduced and streaming speeds often improve.'
    },
    {
      q: lang === 'bn' ? 'আমি কি মোবাইল, কম্পিউটার এবং অ্যান্ড্রয়েড টিভিতে একসাথে ব্যবহার করতে পারব?' : 'Can I use Soverixnet across my phones, PCs, and Android TVs?',
      a: lang === 'bn' 
        ? 'হ্যাঁ, সোভারিক্সনেট আপনার সব ডিভাইসে সাপোর্ট করে (Android, iOS, Windows, Mac, Linux, Android TV এবং Router)। একটি অ্যাকাউন্ট দিয়ে ১০টি ডিভাইস একসাথে কানেক্ট করা যায়।' 
        : 'Yes! Soverixnet provides cross-platform configurations compatible with Android, iPhone, Windows, macOS, Linux, Android TV, and OpenWrt routers (up to 10 devices simultaneously).'
    },
    {
      q: lang === 'bn' ? 'আমার আসল আইপি ও অবস্থান কি সম্পূর্ণ গোপন থাকবে?' : 'Is my true IP address and physical location completely hidden?',
      a: lang === 'bn' 
        ? 'হ্যাঁ, সোভারিক্সনেট আপনার আসল আইপি সম্পূর্ণ লুকিয়ে নির্বাচিত দেশের সুরক্ষিত ভার্চুয়াল আইপি দিয়ে রিপ্লেস করে দেয়। ফলে ইন্টারনেটে আপনার পরিচয় সম্পূর্ণ গোপন ও বেনামী (Anonymous) থাকে।' 
        : 'Yes. Your genuine IPv4, IPv6, and WebRTC fingerprints are masked by our sovereign node IP addresses, rendering your online identity 100% anonymous.'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-cyan-500/30 bg-gradient-to-b from-slate-900 via-[#050c1e] to-[#02050e] shadow-2xl">
        
        {/* Glow ambient background rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'bn' ? 'ডিজিটাল নিরাপত্তার এক নতুন দিগন্ত' : 'Next-Generation Cyber Protection'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {lang === 'bn' ? (
              <>
                কেন ব্যবহার করবেন <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Soverixnet VPN</span>?
              </>
            ) : (
              <>
                Why Choose <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Soverixnet VPN</span>?
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn' 
              ? 'সোভারিক্সনেট শুধুমাত্র একটি ভিপিএন নয় — এটি আপনার অনলাইন প্রাইভেসি, দ্রুতগতির গেমিং, সুরক্ষিত ব্যাংকিং এবং বাফারিংহীন 4K বিনোদনের পূর্ণাঙ্গ ডিজিটাল প্রতিরক্ষা ব্যবস্থা।' 
              : 'Soverixnet is an enterprise-grade cyber shield engineered to guarantee 100% online anonymity, low-ping esports throughput, and barrier-free digital freedom.'}
          </p>

          {/* Quick CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onConnectNow}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 shadow-xl shadow-cyan-500/25 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{lang === 'bn' ? 'এখনই সোভারিক্সনেটে যুক্ত হোন' : 'Connect to Soverixnet Now'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? '১০০% জিরো-লগ নিশ্চিত' : '100% Zero-Logs Verified'}</span>
            </div>
          </div>

        </div>

      </div>

      {/* 6 Key Benefits Cards Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'bn' ? 'সোভারিক্সনেট ব্যবহারের ৬টি অভাবনীয় সুবিধা' : '6 Powerful Advantages of Soverixnet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn' ? 'প্রতিটি ক্লিক ও বাইটে আপনার পূর্ণ সুরক্ষা নিশ্চিত' : 'Engineered for ultimate privacy, speed, and reliability'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefitsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 shadow-lg mb-4 group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-cyan-400/80 block mt-0.5 mb-2.5">
                    {item.subtitle}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'লাইফটাইম সক্রিয় ফিচার' : 'Active VIP Feature'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Privacy Risk Assessment Calculator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-[#060e22] via-[#040916] to-[#02050c]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Checkbox Questions */}
          <div className="lg:col-span-7 space-y-4">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                {lang === 'bn' ? 'সাইবার সিকিউরিটি ক্যালকুলেটর' : 'Interactive Security Risk Meter'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                {lang === 'bn' ? 'ভিপিএন ছাড়া ইন্টারনেটে আপনি কতটা ঝুঁকিতে আছেন?' : 'How Vulnerable Are You Without Soverixnet?'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'bn' ? 'আপনার প্রতিদিনের ইন্টারনেট ব্যবহারের ধরন সিলেক্ট করুন:' : 'Check the online activities you regularly perform:'}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <input
                  type="checkbox"
                  checked={usePublicWifi}
                  onChange={(e) => setUsePublicWifi(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {lang === 'bn' ? 'ক্যাফে, বিমানবন্দর বা পাবলিক ওয়াইফাই ব্যবহার করেন' : 'Use free public Wi-Fi at coffee shops or airports'}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <input
                  type="checkbox"
                  checked={useOnlineBanking}
                  onChange={(e) => setUseOnlineBanking(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {lang === 'bn' ? 'বিকাশ, নগদ, অনলাইন ব্যাংক ও কার্ড দিয়ে লেনদেন করেন' : 'Perform online banking, card payments or crypto transfers'}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <input
                  type="checkbox"
                  checked={useGamingStreaming}
                  onChange={(e) => setUseGamingStreaming(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {lang === 'bn' ? 'অনলাইন মাল্টিপ্লেয়ার গেম খেলেন ও 4K ভিডিও স্ট্রিম করেন' : 'Play multiplayer games (PUBG/Valorant) & stream videos'}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <input
                  type="checkbox"
                  checked={visitBlockedSites}
                  onChange={(e) => setVisitBlockedSites(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {lang === 'bn' ? 'ব্লক করা ওয়েবসাইট বা আন্তর্জাতিক কন্টেন্ট ব্রাউজ করেন' : 'Access geo-restricted international websites & media'}
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <input
                  type="checkbox"
                  checked={worryIspTracking}
                  onChange={(e) => setWorryIspTracking(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {lang === 'bn' ? 'আইএসপি বা বিজ্ঞাপনদাতারা আপনার ডাটা ট্র্যাক করছে বলে চিন্তা করেন' : 'Concerned about ISP logging & third-party data tracking'}
                </span>
              </label>

            </div>

          </div>

          {/* Right Column: Comparative Risk vs Protected Gauge */}
          <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-3xl border border-cyan-500/30 text-center flex flex-col justify-between">
            
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                {lang === 'bn' ? 'ডিজিটাল দুর্বলতার সূচক (ভিপিএন ছাড়া)' : 'Unprotected Risk Index'}
              </span>

              <div className="text-4xl sm:text-5xl font-mono font-black text-rose-400 mb-2">
                {vulnerabilityPercent}% {lang === 'bn' ? 'ঝুঁকিপূর্ণ' : 'Vulnerable'}
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden my-3 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500" 
                  style={{ width: `${vulnerabilityPercent}%` }} 
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                {vulnerabilityPercent > 60 
                  ? (lang === 'bn' ? '⚠️ আপনার পাসওয়ার্ড ও অনলাইন পরিচয় সম্পূর্ণ অরক্ষিত অবস্থায় আছে!' : '⚠️ Your IP, passwords, and banking sessions are severely exposed!') 
                  : (lang === 'bn' ? 'অনলাইন নিরাপত্তা বজায় রাখতে সুরক্ষা নেওয়া জরুরি।' : 'Moderate vulnerability detected across daily sessions.')}
              </p>
            </div>

            {/* With Soverixnet Box */}
            <div className="mt-6 pt-5 border-t border-slate-800 bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                <span>{lang === 'bn' ? 'Soverixnet চালু করলে:' : 'With Soverixnet Active:'}</span>
                <span>100% SHIELDED</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden my-2">
                <div className="h-full bg-emerald-400 w-full" />
              </div>
              <span className="text-[11px] text-emerald-300 font-mono">
                {lang === 'bn' ? '✓ কোয়ান্টাম এনক্রিপশন সক্রিয় ✓ জিরো লিক প্রটেকশন' : '✓ Quantum Cryptography Active ✓ Zero Leak Shield'}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Comparison Table: Soverixnet vs Ordinary VPNs */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
        
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'bn' ? 'Soverixnet বনাম সাধারণ অন্যান্য ভিপিএন' : 'Soverixnet vs Ordinary VPN Providers'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn' ? 'কেন সোভারিক্সনেট সেরা তার পরিষ্কার তুলনা দেখুন' : 'Compare technical specifications and real privacy benchmarks'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3.5 px-4">{lang === 'bn' ? 'ফিচার / প্রযুক্তি' : 'Feature / Capability'}</th>
                <th className="py-3.5 px-4 bg-cyan-500/10 text-cyan-300 font-bold border-x border-cyan-500/20">Soverixnet VPN</th>
                <th className="py-3.5 px-4 text-slate-400">{lang === 'bn' ? 'সাধারণ অন্যান্য ভিপিএন' : 'Ordinary Free/Paid VPNs'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'প্রোটোকল প্রযুক্তি' : 'Protocols Supported'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold font-mono border-x border-cyan-500/20">
                  WireGuard® + V2Ray VLESS Reality + Hysteria 2
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  Legacy OpenVPN / Slow PPTP
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'সার্ভার পোর্ট ও স্পিড' : 'Port Capacity & Bandwidth'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold font-mono border-x border-cyan-500/20">
                  10 Gbps Unmetered (Zero Throttling)
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  1 Gbps Shared (High Congestion)
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'কোয়ান্টাম-সেফ ক্রিপ্টোগ্রাফি' : 'Post-Quantum Defense'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold border-x border-cyan-500/20">
                  ✓ NIST Kyber-1024 Quantum Protected
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  ✗ No Quantum Defense
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'ক্লিন-নেট অ্যাড ও ম্যালওয়্যার ব্লকার' : 'CleanNet AdBlock & Anti-Phish'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold border-x border-cyan-500/20">
                  ✓ Built-in (Saves 40% Mobile Data)
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  ✗ In-App Ads / Sells Data
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'জিরো-লগ র‍্যাম সার্ভার' : 'RAM-Only Zero Logs'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold border-x border-cyan-500/20">
                  ✓ 100% RAM Volatile (No Hard Disks)
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Persistent Disk Logs Stored
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {lang === 'bn' ? 'মোবাইল কনফিগ ও QR এক্সপোর্ট' : 'QR Code & Client Profiles'}
                </td>
                <td className="py-3.5 px-4 bg-cyan-500/5 text-emerald-400 font-bold border-x border-cyan-500/20">
                  ✓ WireGuard, v2rayNG, Clash, Sing-box
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  ✗ Locked Proprietary App Only
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      {/* Trust Badges & User Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {lang === 'bn' 
                ? '"গেমিংয়ে পিং কমে একেবারে স্মুথ হয়ে গেছে! ফ্রি ফায়ার ও পাবজিতে কোনো ল্যাগ ছাড়াই খেলতে পারছি। Soverixnet সেরা!"' 
                : '"Latency in PUBG & Valorant dropped from 90ms down to 18ms. Phenomenal zero-lag experience."'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-white">তারেক রহমান (Esports Gamer)</span>
            <span className="text-emerald-400">Verified Pro</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {lang === 'bn' 
                ? '"পাবলিক ওয়াইফাই ব্যবহারের সময় অনলাইন ব্যাংকিং নিয়ে আর কোনো ভয় নেই। ক্লিন-নেট দিয়ে সব বিরক্তিকর বিজ্ঞাপন বন্ধ থাকে।"' 
                : '"CleanNet blocks all obnoxious trackers and the banking security gives me 100% peace of mind."'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-white">সাকিব হাসান (Freelancer)</span>
            <span className="text-emerald-400">Verified Pro</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {lang === 'bn' 
                ? '"V2Ray Reality ও WireGuard সাপোর্ট থাকায় যেকোনো সাইট সহজে আনব্লক করা যায়। ৪কে ভিডিওতে কোনো বাফারিং হয় না!"' 
                : '"V2Ray Reality bypasses strict firewalls effortlessly. 4K streams load instantly without buffers."'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-white">মাহমুদ আহমেদ (Software Engineer)</span>
            <span className="text-emerald-400">Verified Pro</span>
          </div>
        </div>

      </div>

      {/* SEO Frequently Asked Questions (FAQ Accordion) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'bn' ? 'প্রায়শই জিজ্ঞাসিত প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'সোভারিক্সনেট ভিপিএন সম্পর্কে সাধারণ প্রশ্নের সহজ উত্তর' : 'Everything you need to know about Soverixnet VPN'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50"
                >
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Conversion CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 text-center flex flex-col items-center justify-center">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          {lang === 'bn' ? 'আপনার অনলাইন জীবন আজই ১০০% সুরক্ষিত করুন' : 'Secure Your Entire Digital Footprint Today'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
          {lang === 'bn' 
            ? 'সোভারিক্সনেট-এর আল্ট্রা-ফাস্ট 10Gbps কোয়ান্টাম এনক্রিপ্টেড নেটওয়ার্কে যুক্ত হয়ে নিশ্চিন্তে ব্রাউজিং ও গেমিং উপভোগ করুন।' 
            : 'Join Soverixnet’s sovereign quantum-encrypted mesh network and experience true borderless speed.'}
        </p>

        <button
          onClick={onConnectNow}
          className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ড্যাশবোর্ডে গিয়ে ভিপিএন কানেক্ট করুন ➔' : 'Go to Dashboard & Connect ➔'}</span>
        </button>
      </div>

    </div>
  );
};
