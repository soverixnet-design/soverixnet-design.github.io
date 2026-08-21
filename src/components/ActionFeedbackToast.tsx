import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Globe2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Crown, 
  X,
  Radio
} from 'lucide-react';
import { VPNServer } from '../types';

export interface ServerSwitchToastData {
  type: 'server_switch';
  server: VPNServer;
  prevServer?: VPNServer;
}

export interface AuthSuccessToastData {
  type: 'auth_success';
  userName?: string;
  email?: string;
  isVip?: boolean;
  actionType?: 'signin' | 'signup' | 'instant_vip';
}

export type ToastFeedbackData = ServerSwitchToastData | AuthSuccessToastData;

interface ActionFeedbackToastProps {
  toast: ToastFeedbackData | null;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const ActionFeedbackToast: React.FC<ActionFeedbackToastProps> = ({
  toast,
  onClose,
  lang,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[9999] pointer-events-none max-w-md w-[calc(100vw-2rem)]">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.type === 'server_switch' ? `srv-${toast.server.id}-${Date.now()}` : `auth-${Date.now()}`}
            initial={{ opacity: 0, y: -24, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, scale: 0.95, filter: 'blur(6px)', transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-cyan-400/40 bg-slate-950/90 text-white"
            style={{
              boxShadow: '0 20px 40px -15px rgba(6, 182, 212, 0.25), 0 0 25px rgba(16, 185, 129, 0.15)',
            }}
          >
            {/* Cyber neon ambient backdrop glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Server Switch Feedback */}
            {toast.type === 'server_switch' && (
              <div className="relative z-10 flex items-start gap-3.5">
                <div className="relative flex-shrink-0 mt-0.5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.25, 1] }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/50 flex items-center justify-center text-2xl shadow-inner shadow-cyan-500/30"
                  >
                    {toast.server.flag}
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </motion.span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                      {lang === 'bn' ? 'নোড পরিবর্তন সফল' : 'Node Switched'}
                    </span>
                    {toast.server.isFreeNet && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        FREE SIM
                      </span>
                    )}
                    {toast.server.isVip && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        VIP
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1 truncate flex items-center gap-1.5">
                    {lang === 'bn' ? toast.server.countryBn : toast.server.country} 
                    <span className="text-xs text-slate-400 font-normal">({lang === 'bn' ? toast.server.cityBn : toast.server.city})</span>
                  </h4>

                  <div className="mt-1 flex items-center gap-2 text-xs font-mono text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {toast.server.ping} ms
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 text-[11px]">{toast.server.ip}</span>
                    {toast.server.simOperator && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-300 text-[11px] font-sans font-medium bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-500/30">
                          📶 {lang === 'bn' ? toast.server.simOperatorBn || toast.server.simOperator : toast.server.simOperator}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Auth Sign In / Sign Up Success Feedback */}
            {toast.type === 'auth_success' && (
              <div className="relative z-10 flex items-start gap-3.5">
                <div className="relative flex-shrink-0 mt-0.5">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                    transition={{ duration: 0.45, ease: 'backOut' }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-indigo-500/30 border border-emerald-400/50 flex items-center justify-center shadow-inner shadow-emerald-500/40"
                  >
                    <Crown className="w-6 h-6 text-amber-300 drop-shadow" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 text-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </motion.span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                      {toast.actionType === 'signup' 
                        ? (lang === 'bn' ? 'রেজিস্ট্রেশন সফল' : 'Account Created')
                        : (lang === 'bn' ? 'লগইন সফল' : 'Welcome Back')}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                      VIP PRO
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1 truncate">
                    {toast.userName || toast.email?.split('@')[0] || (lang === 'bn' ? 'সম্মানিত VIP মেম্বার' : 'Valued VIP Member')}
                  </h4>

                  <p className="text-xs text-slate-300 mt-0.5">
                    {lang === 'bn' 
                      ? 'হাই-স্পিড সার্ভার ও অটো ফ্রি নেট এক্সেস একটিভ করা হয়েছে।' 
                      : 'High-speed servers & Arab Free Net payload access unlocked.'}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Subtle animated progress timer bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.2, ease: 'linear' }}
              style={{ originX: 0 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
