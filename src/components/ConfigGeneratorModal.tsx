import React, { useState } from 'react';
import { VPNServer, VPNProtocol } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FileCode2, 
  Copy, 
  Download, 
  Check, 
  QrCode, 
  Layers, 
  Share2, 
  Terminal,
  Key,
  Shield
} from 'lucide-react';

interface ConfigGeneratorModalProps {
  selectedServer: VPNServer;
  activeProtocol: VPNProtocol;
  lang: 'en' | 'bn';
}

export const ConfigGeneratorModal: React.FC<ConfigGeneratorModalProps> = ({
  selectedServer,
  activeProtocol,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedFormat, setSelectedFormat] = useState<'wireguard' | 'vless' | 'http_custom' | 'hysteria2' | 'clash' | 'openvpn'>('wireguard');
  const [copied, setCopied] = useState(false);
  const [customSni, setCustomSni] = useState(selectedServer.freeNetSni || '');

  const effectiveSni = customSni || selectedServer.freeNetSni || 'gateway.soverixnet.com';

  // Generate realistic configuration strings
  const generateWireguardConfig = () => {
    return `[Interface]
PrivateKey = yAn7G9z...SoverixNetSovereignKey99==
Address = 10.66.66.2/32, fd42:42:42::2/128
DNS = 1.1.1.1, 1.0.0.1
MTU = 1280

[Peer]
PublicKey = aK9L2xQ+SoverixNetGateNodeKey${selectedServer.countryCode}==
PresharedKey = pSK79x...QuantumKyber1024Shield==
Endpoint = ${selectedServer.ip}:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;
  };

  const generateVlessUri = () => {
    return `vless://8b392835-972b-47cc-b1c1-770dc30af179@${selectedServer.ip}:443?encryption=none&security=reality&sni=${effectiveSni}&fp=chrome&pbk=soverixPublicRealityKey1024&sid=1a2b3c4d&type=tcp&headerType=none#SoverixNet-${selectedServer.country.replace(/\s+/g, '')}-${selectedServer.simOperator ? selectedServer.simOperator.replace(/\s+/g, '_') : selectedServer.city}`;
  };

  const generateHttpCustomPayload = () => {
    return `[Config Name: SoverixNet Free Net - ${selectedServer.country} ${selectedServer.simOperator || ''}]
Server: ${selectedServer.ip}
Port: 443 / 80
SNI / Bug Host: ${effectiveSni}

--- HTTP CUSTOM / INJECTOR PAYLOAD ---
GET / HTTP/1.1[crlf]Host: ${effectiveSni}[crlf]X-Online-Host: ${effectiveSni}[crlf]X-Forward-Host: ${effectiveSni}[crlf]Connection: Upgrade[crlf]Upgrade: websocket[crlf][crlf]

--- FAST SSH/WS INSTRUCTIONS ---
1. Open HTTP Custom / HTTP Injector / v2rayNG
2. Set Server IP: ${selectedServer.ip}
3. Set Remote Proxy: ${selectedServer.ip}:443 (or direct 80/8080)
4. Enable SSL/TLS with SNI: ${effectiveSni}
5. Connect & Enjoy Unlimited Zero-Rating Internet!`;
  };

  const generateHysteria2Uri = () => {
    return `hysteria2://soverixnet_vip@${selectedServer.ip}:38290/?sni=${effectiveSni}&insecure=0&mport=20000-40000#SoverixNet-Hysteria2-${selectedServer.city}`;
  };

  const generateClashYaml = () => {
    return `proxies:
  - name: "SoverixNet ${selectedServer.country} ${selectedServer.city}"
    type: vless
    server: ${selectedServer.ip}
    port: 443
    uuid: 8b392835-972b-47cc-b1c1-770dc30af179
    network: ws
    tls: true
    servername: ${effectiveSni}
    ws-opts:
      path: /
      headers:
        Host: ${effectiveSni}
    udp: true`;
  };

  const generateOpenVpnConfig = () => {
    return `client
dev tun
proto udp
remote ${selectedServer.ip} 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA512
cipher AES-256-GCM
ignore-unknown-option block-outside-dns
block-outside-dns
verb 3
<ca>
-----BEGIN CERTIFICATE-----
MIIBojCCAUegAwIBAgIU...SOVERIXNET-ROOT-CA...
-----END CERTIFICATE-----
</ca>`;
  };

  const getConfigText = () => {
    switch (selectedFormat) {
      case 'wireguard': return generateWireguardConfig();
      case 'vless': return generateVlessUri();
      case 'http_custom': return generateHttpCustomPayload();
      case 'hysteria2': return generateHysteria2Uri();
      case 'clash': return generateClashYaml();
      case 'openvpn': return generateOpenVpnConfig();
      default: return generateWireguardConfig();
    }
  };

  const configText = getConfigText();

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedFormat === 'wireguard' ? 'conf' : selectedFormat === 'clash' ? 'yaml' : selectedFormat === 'openvpn' ? 'ovpn' : 'txt';
    const blob = new Blob([configText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soverixnet-${selectedServer.id}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {t.configExport.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t.configExport.subtitle}
            </p>
          </div>
        </div>

        {/* Selected Server Context Pill */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedServer.flag}</span>
            <div>
              <span className="text-xs font-bold text-white">
                {lang === 'bn' ? selectedServer.countryBn : selectedServer.country} ({selectedServer.city})
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">Node IP: {selectedServer.ip}</span>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {selectedServer.speed}
          </span>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'http_custom', label: '🇸🇦 HTTP Custom / Injector Payload' },
          { id: 'vless', label: 'V2Ray / VLESS Reality (URI)' },
          { id: 'wireguard', label: 'WireGuard (.conf)' },
          { id: 'hysteria2', label: 'Hysteria 2 (URI)' },
          { id: 'clash', label: 'Clash / Sing-box (YAML)' },
          { id: 'openvpn', label: 'OpenVPN (.ovpn)' },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id as unknown as typeof selectedFormat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFormat === fmt.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* SNI / Zero-Rating Bug Host Customizer */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">
              {lang === 'bn' ? 'জিরো-রেটিং SNI / বাগ হোস্ট কাস্টমাইজেশন' : 'Zero-Rating SNI / Bug Host Presets:'}
            </span>
            {selectedServer.simOperator && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                📶 {selectedServer.simOperator}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            Current SNI: {effectiveSni}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { name: 'STC Sawa (SA)', sni: 'sawa.stc.com.sa' },
            { name: 'Mobily 60 (SA)', sni: 'api.mobily.com.sa' },
            { name: 'Zain KSA (SA)', sni: 'zain.sa' },
            { name: 'Etisalat e& (UAE)', sni: 'etisalat.ae' },
            { name: 'Du (UAE)', sni: 'du.ae' },
            { name: 'Ooredoo (QA)', sni: 'ooredoo.qa' },
            { name: 'Omantel (OM)', sni: 'omantel.om' },
            { name: 'WhatsApp CDN', sni: 'web.whatsapp.com' },
            { name: 'Cloudflare WARP', sni: '1.1.1.1' },
          ].map((item) => (
            <button
              key={item.sni}
              onClick={() => setCustomSni(item.sni)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                effectiveSni === item.sni
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor & QR Code Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Config Code Display Box */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>PROFILE PAYLOAD</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                READY TO IMPORT
              </span>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto max-h-72 leading-relaxed selection:bg-cyan-500 selection:text-black">
              {configText}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.configExport.copiedToast}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.configExport.copyString}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{t.configExport.downloadConf}</span>
            </button>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.configExport.qrCodeTitle}
            </h4>
          </div>

          {/* High-Tech Cyber QR Matrix SVG */}
          <div className="p-3.5 bg-white rounded-2xl shadow-xl shadow-cyan-500/10 my-2">
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="#030712">
              {/* Corner Markers */}
              <rect x="5" y="5" width="25" height="25" fill="#030712" rx="4" />
              <rect x="10" y="10" width="15" height="15" fill="#ffffff" rx="2" />
              <rect x="14" y="14" width="7" height="7" fill="#06b6d4" rx="1" />

              <rect x="70" y="5" width="25" height="25" fill="#030712" rx="4" />
              <rect x="75" y="10" width="15" height="15" fill="#ffffff" rx="2" />
              <rect x="79" y="14" width="7" height="7" fill="#06b6d4" rx="1" />

              <rect x="5" y="70" width="25" height="25" fill="#030712" rx="4" />
              <rect x="10" y="75" width="15" height="15" fill="#ffffff" rx="2" />
              <rect x="14" y="79" width="7" height="7" fill="#06b6d4" rx="1" />

              {/* Data matrix dots */}
              <rect x="36" y="8" width="5" height="5" />
              <rect x="44" y="8" width="5" height="5" />
              <rect x="56" y="8" width="5" height="5" />
              <rect x="36" y="16" width="5" height="5" fill="#06b6d4" />
              <rect x="52" y="16" width="5" height="5" />
              <rect x="44" y="24" width="5" height="5" />

              <rect x="8" y="36" width="5" height="5" />
              <rect x="16" y="44" width="5" height="5" fill="#06b6d4" />
              <rect x="24" y="36" width="5" height="5" />

              {/* Center matrix cluster */}
              <rect x="36" y="36" width="6" height="6" fill="#030712" />
              <rect x="44" y="36" width="6" height="6" fill="#06b6d4" />
              <rect x="52" y="36" width="6" height="6" fill="#030712" />
              <rect x="60" y="36" width="6" height="6" fill="#06b6d4" />
              <rect x="36" y="44" width="6" height="6" fill="#06b6d4" />
              <rect x="44" y="44" width="6" height="6" fill="#030712" />
              <rect x="52" y="44" width="6" height="6" fill="#06b6d4" />
              <rect x="60" y="44" width="6" height="6" fill="#030712" />
              <rect x="36" y="52" width="6" height="6" fill="#030712" />
              <rect x="44" y="52" width="6" height="6" fill="#06b6d4" />
              <rect x="52" y="52" width="6" height="6" fill="#030712" />
              <rect x="60" y="52" width="6" height="6" fill="#06b6d4" />

              <rect x="72" y="44" width="5" height="5" />
              <rect x="84" y="44" width="5" height="5" fill="#06b6d4" />
              <rect x="76" y="56" width="5" height="5" />
              <rect x="88" y="56" width="5" height="5" />

              <rect x="36" y="72" width="5" height="5" fill="#06b6d4" />
              <rect x="48" y="72" width="5" height="5" />
              <rect x="56" y="80" width="5" height="5" />
              <rect x="40" y="88" width="5" height="5" fill="#06b6d4" />
              <rect x="72" y="72" width="6" height="6" fill="#030712" />
              <rect x="82" y="72" width="6" height="6" fill="#06b6d4" />
              <rect x="72" y="82" width="6" height="6" fill="#06b6d4" />
              <rect x="82" y="82" width="6" height="6" fill="#030712" />
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {lang === 'bn' ? 'v2rayNG, Shadowrocket বা WireGuard অ্যাপের ক্যামেরা দিয়ে স্ক্যান করুন' : 'Scan with v2rayNG, Shadowrocket, WireGuard or Sing-box app'}
          </p>

          {/* WhatsApp Channel Free Configs CTA */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              {lang === 'bn' ? '🔥 আরও নতুন ফ্রি কনফিগ ও ট্রিক্স পেতে:' : '🔥 For more updated free configs & payloads:'}
            </span>
            <a
              href="https://whatsapp.com/channel/0029VbCB2eb1Hsq1gDX4HP13"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>{lang === 'bn' ? 'WhatsApp চ্যানেলে জয়েন করুন ➔' : 'Join WhatsApp Channel ➔'}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
