import React, { useState, useEffect, useRef } from 'react';
import { ConsoleLogEntry, ConnectionStatus, VPNProtocol, VPNServer } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Pause, 
  Play, 
  ShieldCheck, 
  Radio,
  Filter
} from 'lucide-react';

interface LiveConsoleLogsProps {
  status: ConnectionStatus;
  activeProtocol: VPNProtocol;
  selectedServer: VPNServer;
  lang: 'en' | 'bn';
}

export const LiveConsoleLogs: React.FC<LiveConsoleLogsProps> = ({
  status,
  activeProtocol,
  selectedServer,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initial seed logs
  useEffect(() => {
    const initialLogs: ConsoleLogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
        level: 'info',
        module: 'CORE',
        message: 'SoverixNet Cyber Daemon v4.18.0 initialized on localhost.',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 12000).toLocaleTimeString(),
        level: 'security',
        module: 'CRYPTO',
        message: 'Quantum-Safe NIST Kyber-1024 / ChaCha20-Poly1305 engine loaded.',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 9000).toLocaleTimeString(),
        level: 'cyber',
        module: 'FIREWALL',
        message: 'CleanNet DNS filter rules loaded (348,200 ad/malware signatures active).',
      },
    ];
    setLogs(initialLogs);
  }, []);

  // React to connection status changes
  useEffect(() => {
    if (status === 'connecting') {
      addLog('info', 'CORE', `Connecting to target node ${selectedServer.name} (${selectedServer.ip}:51820)...`);
      addLog('cyber', 'WIREGUARD', `Initiating cryptokey exchange handshake with peer ${selectedServer.ip}...`);
    } else if (status === 'handshaking') {
      addLog('security', 'CRYPTO', 'Handshake 1/2 verified. Ephemeral Curve25519 DH completed.');
      addLog('security', 'CRYPTO', 'Kyber-1024 post-quantum preshared key negotiation verified.');
    } else if (status === 'connected') {
      addLog('success', 'WIREGUARD', `Tunnel interface 'soverix0' UP. Virtual IP 10.66.66.2/32 assigned.`);
      addLog('success', 'FIREWALL', `Kill Switch armed. System IPv4/IPv6 default route bound to 'soverix0'.`);
    } else if (status === 'disconnecting') {
      addLog('warn', 'CORE', 'Tear down request received. Flushing ephemeral cryptographic sessions...');
    } else if (status === 'disconnected') {
      addLog('info', 'CORE', 'Tunnel interface down. Default routes safely restored.');
    }
  }, [status, selectedServer]);

  // Periodic heartbeat logs while connected
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = setInterval(() => {
      const logGenerators = [
        () => ({
          level: 'cyber' as const,
          module: 'WIREGUARD' as const,
          message: `Keepalive ping acknowledged by node ${selectedServer.ip} (${selectedServer.ping}ms).`,
        }),
        () => ({
          level: 'security' as const,
          module: 'FIREWALL' as const,
          message: `CleanNet intercepted and dropped telemetry tracker ping (Google Analytics / AppsFlyer).`,
        }),
        () => ({
          level: 'info' as const,
          module: 'DNS' as const,
          message: `Encrypted DNS query resolved via DoH (api.soverixnet.com -> 10.0.0.1).`,
        }),
        () => ({
          level: 'success' as const,
          module: 'CRYPTO' as const,
          message: `Session key rotated seamlessly (PFS 0-RTT ChaCha20 cipher block verified).`,
        }),
      ];

      const chosen = logGenerators[Math.floor(Math.random() * logGenerators.length)]();
      addLog(chosen.level, chosen.module, chosen.message);
    }, 4500);

    return () => clearInterval(interval);
  }, [status, selectedServer]);

  const addLog = (level: ConsoleLogEntry['level'], module: ConsoleLogEntry['module'], message: string) => {
    const newEntry: ConsoleLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      module,
      message,
    };
    setLogs((prev) => [...prev, newEntry]);
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const filteredLogs = logs.filter((l) => {
    if (filterModule === 'ALL') return true;
    return l.module === filterModule;
  });

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.module}] [${l.level.toUpperCase()}]: ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soverixnet-logs-${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* Console Card Header */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t.logsTitle}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' ? 'টানেল ইন্টারফেস, ক্রিপ্টো হ্যান্ডশেক ও সিকিউরিটি ফিল্টার ইভেন্টস' : 'Live socket diagnostics, TLS renegotiations, and firewall filter telemetry.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Module Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['ALL', 'WIREGUARD', 'CRYPTO', 'FIREWALL', 'DNS'].map((mod) => (
              <button
                key={mod}
                onClick={() => setFilterModule(mod)}
                className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
                  filterModule === mod
                    ? 'bg-cyan-500 text-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Pause / Auto-scroll */}
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 cursor-pointer ${
              isAutoScroll ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Auto-Scroll"
          >
            {isAutoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Clear */}
          <button
            onClick={handleClearLogs}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Export */}
          <button
            onClick={handleExportLogs}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

        </div>

      </div>

      {/* Terminal Window Box */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[#02050e] shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Terminal Title Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-[11px] text-slate-400 ml-2 font-bold tracking-wider">
              soverixnet-cyber-console // node: {selectedServer.id}
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            {activeProtocol.toUpperCase()}
          </span>
        </div>

        {/* Logs Output Body */}
        <div
          ref={scrollRef}
          className="p-4 sm:p-5 h-96 overflow-y-auto space-y-2 select-text"
        >
          {filteredLogs.map((log) => {
            const levelColor =
              log.level === 'success'
                ? 'text-emerald-400'
                : log.level === 'warn'
                ? 'text-amber-400'
                : log.level === 'security'
                ? 'text-purple-400'
                : log.level === 'cyber'
                ? 'text-cyan-400'
                : 'text-slate-300';

            const moduleBadge =
              log.module === 'WIREGUARD'
                ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                : log.module === 'CRYPTO'
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                : log.module === 'FIREWALL'
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                : log.module === 'DNS'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-700';

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/30 p-1 rounded transition-colors">
                <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded border shrink-0 ${moduleBadge}`}>
                  {log.module}
                </span>
                <span className={`${levelColor} break-all`}>
                  {log.message}
                </span>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              No logs recorded in this category yet.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
