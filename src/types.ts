export type VPNProtocol = 
  | 'wireguard' 
  | 'v2ray' 
  | 'shadowsocks' 
  | 'trojan' 
  | 'openvpn_udp' 
  | 'openvpn_tcp' 
  | 'hysteria2';

export type ServerCapability = 
  | 'streaming' 
  | 'gaming' 
  | 'p2p' 
  | 'onion' 
  | 'double_vpn' 
  | 'obfuscated'
  | 'free_net';

export type ServerRegion = 
  | 'asia' 
  | 'europe' 
  | 'north_america' 
  | 'south_america' 
  | 'oceania' 
  | 'middle_east';

export interface VPNServer {
  id: string;
  name: string;
  country: string;
  countryBn: string;
  countryCode: string;
  city: string;
  cityBn: string;
  flag: string;
  ip: string;
  ping: number; // in ms
  load: number; // in %
  isVip: boolean;
  isRecommended?: boolean;
  isFreeNet?: boolean;
  simOperator?: string;
  simOperatorBn?: string;
  freeNetSni?: string;
  payloadTemplate?: string;
  capabilities: ServerCapability[];
  protocols: VPNProtocol[];
  lat: number;
  lng: number;
  region: ServerRegion;
  speed: string; // e.g. "10 Gbps"
  exitNode?: {
    country: string;
    city: string;
    flag: string;
  };
}

export type ConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'handshaking' 
  | 'connected' 
  | 'disconnecting';

export interface SecuritySettings {
  killSwitch: boolean;
  cleanNetAdBlock: boolean;
  malwareShield: boolean;
  antiPhishing: boolean;
  preventDnsLeaks: boolean;
  preventWebRtcLeaks: boolean;
  splitTunnelingEnabled: boolean;
  autoConnectOnUntrustedWifi: boolean;
  stealthObfuscation: boolean;
  mtuSize: number;
  dnsProvider: 'soverix_secure' | 'cloudflare' | 'adguard' | 'quad9' | 'custom';
  customDnsIp: string;
  quantumSafeKyber: boolean;
}

export interface SplitTunnelApp {
  id: string;
  name: string;
  icon: string;
  category: 'browser' | 'gaming' | 'media' | 'finance' | 'tools';
  isBypassed: boolean; // true means bypass VPN, false means use VPN
  packageOrExe: string;
}

export interface SpeedTestState {
  isRunning: boolean;
  stage: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  progress: number;
}

export interface LeakShieldStatus {
  ipMasked: boolean;
  dnsProtected: boolean;
  webRtcBlocked: boolean;
  ipv6Secured: boolean;
  stealthVerified: boolean;
}

export interface LiveTrafficData {
  time: string;
  download: number;
  upload: number;
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'security' | 'cyber';
  module: 'CORE' | 'WIREGUARD' | 'V2RAY' | 'DNS' | 'FIREWALL' | 'CRYPTO';
  message: string;
}

export interface UserSession {
  email: string;
  tier: 'VIP Sovereign Pass' | 'Enterprise Shield' | 'Pro Member';
  activeDevicesCount: number;
  maxDevices: number;
  expiryDate: string;
  dataTransferredGB: number;
  dataLimitGB: number; // 0 for unlimited
  joinedDate: string;
  accountToken: string;
}
