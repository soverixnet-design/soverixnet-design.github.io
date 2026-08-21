import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  Activity, 
  Crown, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Mail, 
  Key, 
  Clock, 
  Sliders, 
  Briefcase, 
  Plus, 
  Wallet, 
  Lock, 
  UserCheck, 
  UserX, 
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth, UserProfileData, UserRole } from '../firebase/AuthContext';

interface AdminConsoleViewProps {
  lang: 'en' | 'bn';
}

const GOOGLE_SHEET_WEBHOOK_KEY = 'soverix_gsheet_webhook_url';

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({ lang }) => {
  const { 
    user, 
    userProfile, 
    isSuperAdmin, 
    isAdmin, 
    isReseller, 
    canAccessAdminPanel,
    updateUserRoleAndCredits 
  } = useAuth();

  const [usersList, setUsersList] = useState<UserProfileData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'reseller' | 'admin'>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [copiedData, setCopiedData] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(GOOGLE_SHEET_WEBHOOK_KEY) || '';
  });
  const [savedWebhook, setSavedWebhook] = useState(false);
  const [showWebhookSetupGuide, setShowWebhookSetupGuide] = useState(false);

  // Reseller Create Customer State
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPlan, setCustomerPlan] = useState('Cyber Pro 1-Year');
  const [createdCustomerKey, setCreatedCustomerKey] = useState<string | null>(null);

  // Super Admin Edit Role Modal State
  const [editingUser, setEditingUser] = useState<UserProfileData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [allocatedCredits, setAllocatedCredits] = useState<number>(0);

  // Listen to all users from Firestore (or fallback mock data)
  useEffect(() => {
    if (!canAccessAdminPanel) return;

    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const loadedUsers: UserProfileData[] = [];
          snapshot.forEach((docSnap) => {
            loadedUsers.push(docSnap.data() as UserProfileData);
          });
          if (loadedUsers.length > 0) {
            setUsersList(loadedUsers);
          } else {
            setUsersList(getFallbackUsers());
          }
        },
        (err) => {
          console.warn('AdminConsole: Live listener error or restricted, using local session view:', err);
          setUsersList(getFallbackUsers());
        }
      );
    } catch {
      setUsersList(getFallbackUsers());
    }

    return () => unsubscribe();
  }, [canAccessAdminPanel]);

  const getFallbackUsers = (): UserProfileData[] => {
    return [
      {
        userId: 'admin-master-01',
        email: 'soverixnet@gmail.com',
        displayName: 'Soverix Master Owner',
        phoneNumber: '+8801700-000000',
        photoURL: '',
        role: 'super_admin',
        resellerCredits: 100000,
        resellerVouchersGenerated: 24,
        plan: 'Sovereign VIP Lifetime',
        vipMasterKey: 'SOVERIX-VIP-8B392835-972B-47CC-B1C1',
        status: 'active',
        lastLoginAt: new Date().toLocaleString(),
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        userId: 'reseller-dhaka-01',
        email: 'reseller.dhaka@soverixnet.com',
        displayName: 'Dhaka Cyber Reseller Point',
        phoneNumber: '+8801811-223344',
        photoURL: '',
        role: 'reseller',
        resellerCredits: 25000,
        resellerVouchersGenerated: 18,
        plan: 'Quantum Elite Pass',
        vipMasterKey: 'SOVERIX-RESELLER-DHK-9921-A',
        status: 'active',
        lastLoginAt: '15 minutes ago',
        createdAt: '2026-08-10T12:00:00Z',
        updatedAt: '2026-08-19T00:00:00Z',
      },
      {
        userId: 'usr-vip-002',
        email: 'rakib.gamer@gmail.com',
        displayName: 'Rakib Hasan (Gaming Pro)',
        phoneNumber: '+8801912-345678',
        photoURL: '',
        role: 'user',
        managedByResellerId: 'reseller-dhaka-01',
        plan: 'Gaming Turbo Monthly',
        vipMasterKey: 'SOVERIX-VIP-GMR-8832-B',
        status: 'active',
        lastLoginAt: '1 hour ago',
        createdAt: '2026-08-15T10:30:00Z',
        updatedAt: '2026-08-19T00:00:00Z',
      },
      {
        userId: 'usr-vip-003',
        email: 'tahsin.dev@outlook.com',
        displayName: 'Tahsin Ahmed',
        phoneNumber: '+8801622-998877',
        photoURL: '',
        role: 'user',
        plan: 'Cyber Pro 1-Year',
        vipMasterKey: 'SOVERIX-VIP-DEV-4412-C',
        status: 'active',
        lastLoginAt: 'Yesterday',
        createdAt: '2026-08-14T08:15:00Z',
        updatedAt: '2026-08-18T14:00:00Z',
      },
      {
        userId: 'usr-vip-004',
        email: 'nadim.freelancer@gmail.com',
        displayName: 'Nadim Hossain',
        phoneNumber: '+8801733-445566',
        photoURL: '',
        role: 'user',
        plan: 'Sovereign VIP Lifetime',
        vipMasterKey: 'SOVERIX-VIP-LFT-1102-D',
        status: 'active',
        lastLoginAt: '2 hours ago',
        createdAt: '2026-08-12T16:45:00Z',
        updatedAt: '2026-08-19T02:00:00Z',
      },
    ];
  };

  // If user is not authorized, show security lockout screen
  if (!canAccessAdminPanel) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/40 bg-gradient-to-b from-red-950/20 via-slate-900 to-[#030712] text-center max-w-2xl mx-auto my-12 animate-fade-in shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4 shadow-lg shadow-red-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {lang === 'bn' ? 'সংরক্ষিত নিরাপত্তা এলাকা (Access Restricted)' : 'Restricted Security Area'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          {lang === 'bn' 
            ? 'এই অ্যাডমিন ও রিসেলার প্যানেলটি শুধুমাত্র সোভারিক্সনেট ওনার (soverixnet@gmail.com) এবং অনুমোদিত রিসেলারদের জন্য উন্মুক্ত। আপনার একাউন্টে এডমিন বা রিসেলার অনুমোদন নেই।'
            : 'This management console is restricted to the Primary Sovereign Owner (soverixnet@gmail.com) and verified Reseller sub-agents.'}
        </p>
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-400 max-w-xs mx-auto font-mono">
          <span>Your ID: {user?.email || 'Guest User'}</span>
          <span className="block text-red-400 font-bold mt-1">Role: {userProfile?.role || 'Regular User'}</span>
        </div>
      </div>
    );
  }

  // Filter users based on search, role, and plan
  const filteredUsers = usersList.filter((u) => {
    // If reseller, only show users managed by this reseller (unless super_admin)
    if (isReseller && !isSuperAdmin && !isAdmin) {
      if (u.managedByResellerId !== userProfile?.userId && u.email !== user?.email) {
        return false;
      }
    }

    const matchesSearch = 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phoneNumber && u.phoneNumber.includes(searchTerm)) ||
      u.vipMasterKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesPlan = filterPlan === 'all' || u.plan === filterPlan;

    return matchesSearch && matchesRole && matchesPlan;
  });

  // Export to CSV format
  const handleExportCSV = () => {
    const headers = ['UID', 'Name', 'Email', 'Phone Number', 'Role', 'Plan', 'Master Key', 'Status', 'Last Login', 'Created At'];
    const rows = filteredUsers.map((u) => [
      `"${u.userId}"`,
      `"${u.displayName}"`,
      `"${u.email}"`,
      `"${u.phoneNumber || ''}"`,
      `"${u.role || 'user'}"`,
      `"${u.plan}"`,
      `"${u.vipMasterKey}"`,
      `"${u.status || 'active'}"`,
      `"${u.lastLoginAt || ''}"`,
      `"${u.createdAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `soverixnet_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy as TSV for direct Google Sheet pasting
  const handleCopyForGoogleSheet = () => {
    const headers = ['Name\tEmail\tPhone Number\tRole\tPlan\tMaster Key\tStatus\tLast Login'];
    const rows = filteredUsers.map((u) => 
      `${u.displayName}\t${u.email}\t${u.phoneNumber || 'N/A'}\t${u.role || 'user'}\t${u.plan}\t${u.vipMasterKey}\t${u.status || 'active'}\t${u.lastLoginAt || 'N/A'}`
    );
    const clipboardText = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(clipboardText);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2500);
  };

  // Save Webhook URL
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(GOOGLE_SHEET_WEBHOOK_KEY, webhookUrl.trim());
    setSavedWebhook(true);
    setTimeout(() => setSavedWebhook(false), 2500);
  };

  // Reseller: Create Customer VIP Account
  const handleResellerCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) return;

    const newCustomerId = `cust-${Date.now()}`;
    const generatedKey = `SOVERIX-VIP-${Date.now().toString(36).toUpperCase()}-47CC-B1C1`;

    const newCustomer: UserProfileData = {
      userId: newCustomerId,
      email: customerEmail.trim(),
      displayName: customerName.trim() || customerEmail.split('@')[0],
      phoneNumber: customerPhone.trim(),
      photoURL: '',
      role: 'user',
      managedByResellerId: userProfile?.userId || user?.uid || 'reseller-agent',
      plan: customerPlan,
      vipMasterKey: generatedKey,
      status: 'active',
      lastLoginAt: 'Not logged in yet',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const userRef = doc(db, 'users', newCustomerId);
      await setDoc(userRef, newCustomer);
    } catch {}

    setUsersList((prev) => [newCustomer, ...prev]);
    setCreatedCustomerKey(generatedKey);
  };

  // Super Admin: Save Role & Credit Updates
  const handleSaveUserRole = async () => {
    if (!editingUser) return;
    await updateUserRoleAndCredits(editingUser.userId, selectedRole, allocatedCredits);
    
    setUsersList((prev) => 
      prev.map((u) => 
        u.userId === editingUser.userId 
          ? { ...u, role: selectedRole, resellerCredits: allocatedCredits } 
          : u
      )
    );
    setEditingUser(null);
  };

  // Toggle user active / suspended status
  const handleToggleUserStatus = async (targetUser: UserProfileData) => {
    const newStatus = targetUser.status === 'suspended' ? 'active' : 'suspended';
    try {
      const userRef = doc(db, 'users', targetUser.userId);
      await updateDoc(userRef, { status: newStatus });
    } catch {}
    setUsersList((prev) => 
      prev.map((u) => u.userId === targetUser.userId ? { ...u, status: newStatus } : u)
    );
  };

  const currentResellerCredits = userProfile?.resellerCredits ?? (isSuperAdmin ? 100000 : 25000);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl border ${isSuperAdmin ? 'border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900 to-[#030712]' : 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#030712]'} shadow-2xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-80 h-80 ${isSuperAdmin ? 'bg-red-500/10' : 'bg-amber-500/10'} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isSuperAdmin 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isSuperAdmin ? <Crown className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                <span>
                  {isSuperAdmin 
                    ? (lang === 'bn' ? 'মাস্টার ওনার এডমিন কন্ট্রোল সেন্টার' : 'Master Owner Admin Center') 
                    : isReseller 
                    ? (lang === 'bn' ? 'সোভারিক্সনেট রিসেলার পোর্টাল' : 'SoverixNet Reseller Portal') 
                    : (lang === 'bn' ? 'এডমিন মনিটরিং কনসোল' : 'Admin Operations Console')}
                </span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-bold">
                {user?.email || 'soverixnet@gmail.com'}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide">
              {lang === 'bn' ? 'ইউজার, রিসেলার ও গুগল শিট ম্যানেজমেন্ট' : 'User, Reseller & Google Sheets Operations'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'bn' 
                ? 'যাঁরা যাঁরা সাইন ইন করেছেন তাদের সকল তথ্য লাইভ দেখুন, রিসেলার অ্যাকাউন্ট পরিচালনা করুন এবং এক-ক্লিকে গুগল শিটে এক্সপোর্ট করুন।' 
                : 'Manage sovereign users, provision reseller sub-agents, allocate wallet credits, and synchronize live login records with Google Sheets.'}
            </p>
          </div>

          {/* Quick Reseller Action & Wallet Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-950/90 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  {lang === 'bn' ? 'রিসেলার ক্রেডিট ব্যালেন্স' : 'Reseller Balance'}
                </span>
                <span className="text-base font-black text-amber-400 font-mono">
                  ৳{currentResellerCredits.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCreatedCustomerKey(null);
                setShowCreateCustomerModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? '+ নতুন কাস্টমার একাউন্ট তৈরি' : '+ Create Customer Account'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block">{lang === 'bn' ? 'মোট ব্যবহারকারী' : 'Total Users'}</span>
            <span className="text-lg font-black text-white font-mono">{usersList.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block">{lang === 'bn' ? 'সক্রিয় VIP গ্রাহক' : 'Active VIPs'}</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {usersList.filter(u => u.status !== 'suspended').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block">{lang === 'bn' ? 'অনুমোদিত রিসেলার' : 'Resellers'}</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {usersList.filter(u => u.role === 'reseller').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block">{lang === 'bn' ? 'গুগল শিট সিঙ্ক' : 'Sheet Status'}</span>
            <span className="text-lg font-black text-cyan-400 font-mono flex items-center gap-1">
              <Check className="w-4 h-4" /> Ready
            </span>
          </div>
        </div>

      </div>

      {/* Google Sheets Webhook Live Integration Box (Super Admin only) */}
      {isSuperAdmin && (
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === 'bn' ? 'গুগল শিট অটো-সিঙ্ক ওয়েবহুক (Google Sheets Real-Time Sync)' : 'Google Sheets Webhook Real-Time Sync'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' 
                    ? 'যেকোনো ইউজার সাইন ইন করার সাথে সাথে তার ইমেইল ও মোবাইল নম্বর রিয়েল-টাইমে গুগল শিটে জমা হবে।' 
                    : 'Automatically pushes every user email and phone number to your Google Sheet upon login.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWebhookSetupGuide(!showWebhookSetupGuide)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'কিভাবে সেটআপ করবেন?' : 'How to setup?'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveWebhook} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
            >
              {savedWebhook ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedWebhook ? (lang === 'bn' ? 'সংরক্ষিত হয়েছে!' : 'Saved!') : (lang === 'bn' ? 'ওয়েবহুক সেভ করুন' : 'Save Webhook')}</span>
            </button>
          </form>

          {showWebhookSetupGuide && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
              <p className="text-emerald-400 font-bold">📋 গুগল শিট অটো-সিঙ্ক সেটআপের সহজ ধাপ:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                <li>আপনার Google Sheet খুলে <strong>Extensions ➔ Apps Script</strong> এ যান।</li>
                <li>নিচের কোডটি পেস্ট করুন:</li>
              </ol>
              <pre className="p-3 bg-black/80 rounded-xl border border-slate-800 text-[10px] text-cyan-300 overflow-x-auto select-all">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp || new Date(),
    data.displayName,
    data.email,
    data.phoneNumber || 'N/A',
    data.role || 'user',
    data.plan,
    data.vipMasterKey,
    data.status
  ]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`}
              </pre>
              <p className="text-slate-400 text-[11px]">
                ৩. <strong>Deploy ➔ New deployment ➔ Web App</strong> নির্বাচন করে <em>Who has access</em> এ <strong>"Anyone"</strong> দিয়ে ডিপ্লয় করে URL টি উপরের ঘরে বসিয়ে দিন।
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Bar: Search, Filters & Export Buttons */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'bn' ? 'ইমেইল, নাম বা ফোন নম্বর খুঁজুন...' : 'Search by email, name or phone...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Role & Plan Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{lang === 'bn' ? 'সকল রোল (All Roles)' : 'All Roles'}</option>
            <option value="user">User (গ্রাহক)</option>
            <option value="reseller">Reseller (রিসেলার)</option>
            <option value="admin">Admin (এডমিন)</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{lang === 'bn' ? 'সকল প্ল্যান (All Plans)' : 'All Plans'}</option>
            <option value="Sovereign VIP Lifetime">Sovereign VIP Lifetime</option>
            <option value="Cyber Pro 1-Year">Cyber Pro 1-Year</option>
            <option value="Gaming Turbo Monthly">Gaming Turbo Monthly</option>
            <option value="Quantum Elite Pass">Quantum Elite Pass</option>
            <option value="Free Tier">Free Tier</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'CSV ডাউনলোড' : 'Export CSV'}</span>
          </button>

          {/* Copy for Google Sheet */}
          <button
            onClick={handleCopyForGoogleSheet}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedData ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedData ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'শিটে পেস্টের জন্য কপি' : 'Copy for Sheets')}</span>
          </button>
        </div>

      </div>

      {/* Users & Resellers Table */}
      <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">User / Subscriber</th>
                <th className="px-5 py-4">Phone / Contact</th>
                <th className="px-5 py-4">Role & Level</th>
                <th className="px-5 py-4">VIP Plan Tier</th>
                <th className="px-5 py-4">Master Key Token</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last Activity</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isOwnerRecord = u.email.toLowerCase() === 'soverixnet@gmail.com';
                  return (
                    <tr key={u.userId} className="hover:bg-slate-900/40 transition-colors">
                      
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isOwnerRecord 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                              : u.role === 'reseller'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          }`}>
                            {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="text-white font-bold block">{u.displayName}</span>
                            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {u.phoneNumber ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                            {u.phoneNumber}
                          </span>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 w-fit ${
                            isOwnerRecord || u.role === 'super_admin'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : u.role === 'reseller'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {isOwnerRecord ? '👑 OWNER' : u.role === 'reseller' ? '💼 RESELLER' : u.role === 'admin' ? '🛡️ ADMIN' : 'USER'}
                          </span>
                          {u.role === 'reseller' && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ৳{(u.resellerCredits || 0).toLocaleString()} Credit
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 inline-block">
                          {u.plan}
                        </span>
                      </td>

                      {/* Master Key */}
                      <td className="px-5 py-4 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 w-fit">
                          <Key className="w-3 h-3 text-amber-400" />
                          <span className="text-[11px] text-amber-300 select-all truncate max-w-[120px]">
                            {u.vipMasterKey}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'suspended'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {u.lastLoginAt || 'Recently'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Super Admin can edit role and assign reseller credits */}
                          {isSuperAdmin && (
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setSelectedRole(u.role || 'user');
                                setAllocatedCredits(u.resellerCredits || 0);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                              title={lang === 'bn' ? 'রোল ও ক্রেডিট পরিবর্তন' : 'Change Role & Credits'}
                            >
                              Edit Role
                            </button>
                          )}

                          {/* Toggle active / suspended */}
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              u.status === 'suspended'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={u.status === 'suspended' ? 'Activate User' : 'Suspend Access'}
                          >
                            {u.status === 'suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    {lang === 'bn' ? 'কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'No users found matching query.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin: Edit Role & Credits Modal Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#050b18] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'ব্যবহারকারীর রোল ও রিসেলার ক্রেডিট সেট করুন' : 'Assign Role & Reseller Credits'}</span>
              </h4>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TARGET ACCOUNT</span>
                <span className="text-white font-bold">{editingUser.displayName}</span>
                <span className="text-cyan-400 block font-mono text-[11px]">{editingUser.email}</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">
                  {lang === 'bn' ? 'রোল নির্বাচন করুন (Assign Role)' : 'Select Role'}
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="user">User (সাধারণ গ্রাহক)</option>
                  <option value="reseller">Reseller (রিসেলার - নিজস্ব প্যানেল ও ব্যালেন্স পাবে)</option>
                  <option value="admin">Admin (এডমিন - ইউজার ম্যানেজমেন্ট এক্সেস)</option>
                  <option value="super_admin">Super Admin (মাস্টার ওনার)</option>
                </select>
              </div>

              {selectedRole === 'reseller' && (
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    {lang === 'bn' ? 'রিসেলার ওয়ালেট ক্রেডিট (BDT)' : 'Reseller Wallet Credits (BDT)'}
                  </label>
                  <input
                    type="number"
                    value={allocatedCredits}
                    onChange={(e) => setAllocatedCredits(Number(e.target.value))}
                    placeholder="25000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-amber-400 mt-1">
                    💡 এই ক্রেডিট দিয়ে রিসেলার তার আন্ডারে নতুন কাস্টমারদের VIP অ্যাকাউন্ট সক্রিয় করতে পারবে।
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserRole}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reseller Create Customer Modal */}
      {showCreateCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#050b18] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'নতুন কাস্টমার একাউন্ট তৈরি ও ভাউচার প্রদান' : 'Provision Customer VIP Account'}</span>
              </h4>
              <button
                onClick={() => setShowCreateCustomerModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createdCustomerKey ? (
              <div className="space-y-4 text-center py-2 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-black text-white">
                  {lang === 'bn' ? 'কাস্টমার একাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Customer Account Created!'}
                </h5>
                <p className="text-xs text-slate-300">
                  {lang === 'bn' 
                    ? 'কাস্টমারকে নিচের মাস্টার কি (Master Key) অথবা ইমেইল ও পাসওয়ার্ড প্রদান করুন:' 
                    : 'Provide the following VIP Master Key token to the customer:'}
                </p>

                <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40 text-xs font-mono text-amber-300 select-all">
                  {createdCustomerKey}
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdCustomerKey);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs cursor-pointer"
                  >
                    Copy Key
                  </button>
                  <button
                    onClick={() => setShowCreateCustomerModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResellerCreateCustomer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    {lang === 'bn' ? 'কাস্টমারের নাম' : 'Customer Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Hasan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    {lang === 'bn' ? 'কাস্টমারের ইমেইল' : 'Customer Email'}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    {lang === 'bn' ? 'মোবাইল নম্বর (বিকাশ/নগদ রেফারেন্স)' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    {lang === 'bn' ? 'VIP সাবস্ক্রিপশন প্ল্যান' : 'Select VIP Plan'}
                  </label>
                  <select
                    value={customerPlan}
                    onChange={(e) => setCustomerPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Cyber Pro 1-Year">Cyber Pro 1-Year (৳১,৮৫০ BDT)</option>
                    <option value="Gaming Turbo Monthly">Gaming Turbo Monthly (৳৩৫০ BDT)</option>
                    <option value="Sovereign VIP Lifetime">Sovereign VIP Lifetime (৳৪,৯৫০ BDT)</option>
                    <option value="Quantum Elite Pass">Quantum Elite Pass (৳৩,২০০ BDT)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateCustomerModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-extrabold cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    {lang === 'bn' ? 'একাউন্ট তৈরি ও কি জেনারেট করুন ➔' : 'Generate VIP Account ➔'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
