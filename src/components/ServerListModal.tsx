import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VPNServer, ServerCapability } from '../types';
import { SERVERS_DATA } from '../data/servers';
import { 
  Search, 
  Globe, 
  Sparkles, 
  Tv, 
  Gamepad2, 
  FolderDown, 
  ShieldAlert, 
  Layers, 
  Check, 
  ArrowUpDown, 
  RefreshCw,
  Zap,
  Lock,
  Radio
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface ServerListModalProps {
  selectedServer: VPNServer;
  onSelectServer: (server: VPNServer) => void;
  lang: 'en' | 'bn';
  onClose?: () => void;
}

export const ServerListModal: React.FC<ServerListModalProps> = ({
  selectedServer,
  onSelectServer,
  lang,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'ping' | 'load' | 'name'>('ping');
  const [servers, setServers] = useState<VPNServer[]>(SERVERS_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justSelectedId, setJustSelectedId] = useState<string | null>(null);

  // Ping refresh simulation
  const handleRefreshPings = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          ping: Math.max(8, s.ping + Math.floor(Math.random() * 6 - 3)),
          load: Math.min(95, Math.max(10, s.load + Math.floor(Math.random() * 8 - 4))),
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  const handlePickServer = (server: VPNServer) => {
    setJustSelectedId(server.id);
    onSelectServer(server);
    setTimeout(() => {
      if (onClose) onClose();
    }, 280);
  };

  const categories = [
    { id: 'all', label: t.serverCategories.all, icon: Globe },
    { id: 'free_net', label: t.serverCategories.freeNet, icon: Zap },
    { id: 'recommended', label: t.serverCategories.recommended, icon: Sparkles },
    { id: 'streaming', label: t.serverCategories.streaming, icon: Tv },
    { id: 'gaming', label: t.serverCategories.gaming, icon: Gamepad2 },
    { id: 'p2p', label: t.serverCategories.p2p, icon: FolderDown },
    { id: 'double_vpn', label: t.serverCategories.doubleVpn, icon: Layers },
    { id: 'obfuscated', label: t.serverCategories.obfuscated, icon: ShieldAlert },
  ];

  // Filter and sort servers
  const filteredServers = servers
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.country.toLowerCase().includes(q) ||
        s.countryBn.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.cityBn.toLowerCase().includes(q) ||
        s.ip.includes(q) ||
        (s.simOperator && s.simOperator.toLowerCase().includes(q)) ||
        (s.simOperatorBn && s.simOperatorBn.toLowerCase().includes(q)) ||
        (s.freeNetSni && s.freeNetSni.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'free_net') return s.isFreeNet;
      if (activeCategory === 'recommended') return s.isRecommended;
      return s.capabilities.includes(activeCategory as ServerCapability);
    })
    .sort((a, b) => {
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'load') return a.load - b.load;
      return a.country.localeCompare(b.country);
    });

  return (
    <div className="space-y-6">
      
      {/* Search & Utility Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 sm:p-5 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'দেশ, শহর, সিম অপারেটর বা আইপি খুঁজুন...' : 'Search by country, SIM, or IP...'}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Sort & Ping Refresh */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setSortBy('ping')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                sortBy === 'ping' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'bn' ? 'পিং' : 'Ping'}
            </button>
            <button
              onClick={() => setSortBy('load')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                sortBy === 'load' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'bn' ? 'লোড' : 'Load'}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRefreshPings}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title="Refresh Server Latencies"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Server Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredServers.map((server, idx) => {
          const isSelected = selectedServer.id === server.id;
          const isJustSelected = justSelectedId === server.id;

          return (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3), duration: 0.25 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePickServer(server)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                isSelected || isJustSelected
                  ? 'bg-gradient-to-br from-cyan-950/50 via-slate-900/90 to-blue-950/50 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                  : 'glass-panel border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/70'
              }`}
            >
              {/* Highlight ribbon for recommended */}
              {server.isRecommended && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[8px] font-black uppercase py-0.5 text-center transform rotate-45 translate-x-4 translate-y-2 shadow-sm">
                    FAST
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <motion.span 
                    animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="text-3xl filter drop-shadow select-none"
                  >
                    {server.flag}
                  </motion.span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {lang === 'bn' ? server.countryBn : server.country}
                      </h4>
                      {server.isFreeNet && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-emerald-400" />
                          FREE SIM
                        </span>
                      )}
                      {server.isVip && (
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'bn' ? server.cityBn : server.city}
                    </p>

                    {/* Arab SIM Operator Tag */}
                    {server.simOperator && (
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5 text-amber-400" />
                          {lang === 'bn' ? server.simOperatorBn || server.simOperator : server.simOperator}
                        </span>
                        {server.freeNetSni && (
                          <span className="text-[9px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            SNI: {server.freeNetSni}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ping & Load */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className={`w-2 h-2 rounded-full ${
                      server.ping < 50 ? 'bg-emerald-400' : server.ping < 120 ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <span className="text-xs font-mono font-bold text-slate-200">{server.ping} ms</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end mt-1">
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          server.load < 40 ? 'bg-emerald-400' : server.load < 70 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{server.load}%</span>
                  </div>
                </div>
              </div>

              {/* Badges & Protocols */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  {server.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-800/90 text-slate-300 border border-slate-700 uppercase"
                    >
                      {cap.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-bold">
                  {isSelected ? (
                    <motion.span 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-emerald-400 font-semibold"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {lang === 'bn' ? 'সক্রিয় নোড' : 'Active Node'}
                    </motion.span>
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300">
                      {lang === 'bn' ? 'সংযোগ' : 'Connect'} ➔
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredServers.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 text-center glass-panel rounded-3xl border border-slate-800"
        >
          <p className="text-slate-400 text-sm">
            {lang === 'bn' ? 'কোনো সার্ভার পাওয়া যায়নি। অন্য কিওয়ার্ড দিয়ে অনুসন্ধান করুন।' : 'No servers found matching your query.'}
          </p>
        </motion.div>
      )}

    </div>
  );
};
