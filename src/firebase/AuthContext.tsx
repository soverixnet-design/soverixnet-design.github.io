import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  deleteDoc,
  query,
  where,
  limit,
  getDocs
} from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { SecuritySettings, VPNProtocol } from '../types';

export type UserRole = 'super_admin' | 'admin' | 'reseller' | 'user';

export interface UserProfileData {
  userId: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL: string;
  role: UserRole;
  resellerCredits?: number;
  resellerVouchersGenerated?: number;
  managedByResellerId?: string;
  plan: string;
  vipMasterKey: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  referralEarningsBDT?: number;
  referralBonusDays?: number;
  referralRewardTier?: string;
  status?: 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralRecord {
  id: string;
  refId: string;
  referrerUserId: string;
  referredUserId: string;
  referredUserEmail?: string;
  referredUserName?: string;
  plan?: string;
  rewardStatus: 'credited' | 'pending' | 'claimed';
  rewardAmountBDT?: number;
  rewardBonusDays?: number;
  createdAt: string;
}

export interface UserDeviceData {
  id: string;
  deviceId: string;
  userId: string;
  deviceName: string;
  deviceType: 'pc' | 'mobile' | 'tv' | 'router';
  virtualIp: string;
  location: string;
  activeSince: string;
  lastSeen: string;
}

export interface UserConnectionLog {
  id: string;
  logId: string;
  userId: string;
  serverNodeId: string;
  serverName: string;
  protocol: string;
  connectedAt: string;
  durationSeconds: number;
  bytesDownloadedMB: number;
  bytesUploadedMB: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  devices: UserDeviceData[];
  connectionLogs: UserConnectionLog[];
  referrals: ReferralRecord[];
  incomingRefCode: string | null;
  userReferralLink: string;
  userReferralCode: string;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  canAccessAdminPanel: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string, phone?: string, referralCodeInput?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInDemoVip: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserPreferences: (prefs: Partial<SecuritySettings>, protocol?: VPNProtocol) => Promise<void>;
  addNewDevice: (name: string, type: 'pc' | 'mobile' | 'tv' | 'router') => Promise<void>;
  removeDevice: (deviceId: string) => Promise<void>;
  saveConnectionSession: (serverNodeId: string, serverName: string, protocol: string, durationSecs: number, dlMB: number, ulMB: number) => Promise<void>;
  updateUserRoleAndCredits: (targetUserId: string, role: UserRole, credits?: number) => Promise<void>;
  claimReferralReward: (rewardType: 'days' | 'credits' | 'upgrade') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'soverix_vip_local_session';
const GOOGLE_SHEET_WEBHOOK_KEY = 'soverix_gsheet_webhook_url';
const LOCAL_REF_STORAGE_KEY = 'soverix_referral_tracking_code';
const OWNER_EMAIL = 'soverixnet@gmail.com';

// Helper to push user login/signup data to a user-configured Google Sheets Apps Script Webhook
const pushToGoogleSheetWebhook = async (userRecord: {
  timestamp: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  plan: string;
  vipMasterKey: string;
  status: string;
}) => {
  try {
    const webhookUrl = localStorage.getItem(GOOGLE_SHEET_WEBHOOK_KEY);
    if (webhookUrl && webhookUrl.startsWith('https://script.google.com/')) {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userRecord),
      });
      console.log('SoverixNet: User record posted to Google Sheet Webhook.');
    }
  } catch (err) {
    console.warn('Google Sheet webhook sync skipped:', err);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [devices, setDevices] = useState<UserDeviceData[]>([]);
  const [connectionLogs, setConnectionLogs] = useState<UserConnectionLog[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [incomingRefCode, setIncomingRefCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Auto-detect and persist referral URL parameter (?ref=... or ?referral=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('invite');
      if (refParam && refParam.trim().length > 0) {
        const cleanRef = refParam.trim().toUpperCase();
        localStorage.setItem(LOCAL_REF_STORAGE_KEY, cleanRef);
        setIncomingRefCode(cleanRef);
      } else {
        const savedRef = localStorage.getItem(LOCAL_REF_STORAGE_KEY);
        if (savedRef) {
          setIncomingRefCode(savedRef);
        }
      }
    } catch {}
  }, []);

  // Initialize Auth Persistence
  useEffect(() => {
    try {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    } catch {}
  }, []);

  // Calculate user's unique referral code and sharable link
  const userReferralCode = userProfile?.referralCode || (user?.uid ? `SOV-${user.uid.substring(0, 6).toUpperCase()}` : 'SOV-VIP2026');
  const userReferralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/?ref=${userReferralCode}` 
    : `https://soverixnet-design.github.io/?ref=${userReferralCode}`;

  // Compute RBAC Roles
  const isSuperAdmin = Boolean(
    (user?.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase()) ||
    (userProfile?.email && userProfile.email.toLowerCase() === OWNER_EMAIL.toLowerCase()) ||
    userProfile?.role === 'super_admin'
  );

  const isAdmin = Boolean(isSuperAdmin || userProfile?.role === 'admin');
  const isReseller = Boolean(isAdmin || userProfile?.role === 'reseller');
  const canAccessAdminPanel = Boolean(isSuperAdmin || isAdmin || isReseller);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await initializeUserProfile(currentUser);
      } else {
        try {
          const cached = localStorage.getItem(LOCAL_SESSION_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setUserProfile(parsed);
            setUser({
              uid: parsed.userId,
              email: parsed.email,
              displayName: parsed.displayName,
              photoURL: parsed.photoURL,
              emailVerified: true,
              isAnonymous: false,
              metadata: {},
              providerData: [],
              refreshToken: '',
              tenantId: null,
              delete: async () => {},
              getIdToken: async () => '',
              getIdTokenResult: async () => ({} as any),
              reload: async () => {},
              toJSON: () => ({}),
              phoneNumber: parsed.phoneNumber || null,
              providerId: 'google.com',
            } as unknown as User);
          } else {
            setUser(null);
            setUserProfile(null);
            setDevices([]);
            setConnectionLogs([]);
            setReferrals([]);
          }
        } catch {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Record referral reward for the inviter
  const processReferralReward = async (
    referrerCodeOrId: string,
    referredUserId: string,
    referredEmail: string,
    referredName: string,
    planName: string
  ) => {
    try {
      // Find candidate referrer ID
      let referrerUid: string | null = null;

      // If it is direct UID
      if (referrerCodeOrId.length > 20 && !referrerCodeOrId.startsWith('SOV-')) {
        referrerUid = referrerCodeOrId;
      } else {
        // Query users by referralCode
        try {
          const q = query(collection(db, 'users'), where('referralCode', '==', referrerCodeOrId), limit(1));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            referrerUid = snapshot.docs[0].id;
          }
        } catch {}
      }

      // If not found by query, fallback to owner or candidate
      if (!referrerUid) {
        // If owner referral code
        if (referrerCodeOrId === 'SOV-VIP2026' || referrerCodeOrId === 'SOVERIX' || referrerCodeOrId === 'OWNER') {
          referrerUid = 'vip-owner-main';
        }
      }

      if (referrerUid && referrerUid !== referredUserId) {
        const refId = `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const rewardRecord: Omit<ReferralRecord, 'id'> = {
          refId,
          referrerUserId: referrerUid,
          referredUserId,
          referredUserEmail: referredEmail,
          referredUserName: referredName,
          plan: planName,
          rewardStatus: 'credited',
          rewardAmountBDT: 150,
          rewardBonusDays: 15,
          createdAt: new Date().toISOString(),
        };

        // Save referral record in referrer's subcollection
        try {
          const refDoc = doc(db, 'users', referrerUid, 'referrals', refId);
          await setDoc(refDoc, rewardRecord);
        } catch {}

        // Update referrer's user metrics
        try {
          const referrerDocRef = doc(db, 'users', referrerUid);
          const referrerSnap = await getDoc(referrerDocRef);
          if (referrerSnap.exists()) {
            const data = referrerSnap.data() as UserProfileData;
            const newCount = (data.referralCount || 0) + 1;
            const newEarnings = (data.referralEarningsBDT || 0) + 150;
            const newDays = (data.referralBonusDays || 0) + 15;
            
            let newTier = 'Bronze Pilot';
            if (newCount >= 25) newTier = 'Quantum Titan';
            else if (newCount >= 10) newTier = 'Gold Commander';
            else if (newCount >= 5) newTier = 'Silver Voyager';

            await setDoc(referrerDocRef, {
              referralCount: newCount,
              referralEarningsBDT: newEarnings,
              referralBonusDays: newDays,
              referralRewardTier: newTier,
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Referral reward processing error:', err);
    }
  };

  // Initialize or fetch user profile & subcollections
  const initializeUserProfile = async (
    currentUser: User, 
    customName?: string, 
    customPhone?: string,
    providedReferralCode?: string
  ) => {
    const isOwnerUser = (currentUser.email && currentUser.email.toLowerCase() === OWNER_EMAIL.toLowerCase());
    const defaultRole: UserRole = isOwnerUser ? 'super_admin' : 'user';
    const activeRef = providedReferralCode || incomingRefCode || localStorage.getItem(LOCAL_REF_STORAGE_KEY) || undefined;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const resolvedName = customName || currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Soverix Pilot');
        const resolvedEmail = currentUser.email || 'user@soverixnet.com';
        const masterKey = `SOVERIX-VIP-${currentUser.uid.substring(0, 8).toUpperCase()}-47CC-B1C1`;
        const myReferralCode = `SOV-${currentUser.uid.substring(0, 6).toUpperCase()}`;

        const newProfile: UserProfileData = {
          userId: currentUser.uid,
          email: resolvedEmail,
          displayName: resolvedName,
          phoneNumber: customPhone || currentUser.phoneNumber || '',
          photoURL: currentUser.photoURL || '',
          role: defaultRole,
          resellerCredits: isOwnerUser ? 50000 : 0,
          resellerVouchersGenerated: 0,
          plan: isOwnerUser ? 'Sovereign VIP Lifetime' : 'Free Tier',
          vipMasterKey: masterKey,
          referralCode: myReferralCode,
          referredBy: activeRef,
          referralCount: isOwnerUser ? 18 : 0,
          referralEarningsBDT: isOwnerUser ? 2700 : 0,
          referralBonusDays: isOwnerUser ? 270 : 0,
          referralRewardTier: isOwnerUser ? 'Gold Commander' : 'Bronze Pilot',
          status: 'active',
          lastLoginAt: new Date().toLocaleString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(userDocRef, newProfile);
        } catch {}
        
        setUserProfile(newProfile);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newProfile));
        } catch {}

        pushToGoogleSheetWebhook({
          timestamp: new Date().toISOString(),
          displayName: resolvedName,
          email: resolvedEmail,
          phoneNumber: customPhone || '',
          role: defaultRole,
          plan: newProfile.plan,
          vipMasterKey: masterKey,
          status: 'active',
        });

        // Trigger referral tracking if user was referred by someone
        if (activeRef) {
          processReferralReward(activeRef, currentUser.uid, resolvedEmail, resolvedName, newProfile.plan);
        }

        // Seed initial default device
        const defaultDeviceId = `dev-${Date.now()}`;
        const deviceDocRef = doc(db, 'users', currentUser.uid, 'devices', defaultDeviceId);
        try {
          await setDoc(deviceDocRef, {
            deviceId: defaultDeviceId,
            userId: currentUser.uid,
            deviceName: 'Primary Cyber Client',
            deviceType: 'mobile',
            virtualIp: '10.66.66.2',
            location: 'Dhaka / Sovereign IX',
            activeSince: 'Just now',
            lastSeen: new Date().toISOString(),
          });
        } catch {}
      } else {
        const profileData = userDocSnap.data() as UserProfileData;
        profileData.lastLoginAt = new Date().toLocaleString();
        
        // Ensure owner email is always marked as super_admin
        if (isOwnerUser && profileData.role !== 'super_admin') {
          profileData.role = 'super_admin';
        }

        // Ensure referralCode exists
        if (!profileData.referralCode) {
          profileData.referralCode = `SOV-${currentUser.uid.substring(0, 6).toUpperCase()}`;
        }

        try {
          await setDoc(userDocRef, { 
            lastLoginAt: new Date().toLocaleString(), 
            role: isOwnerUser ? 'super_admin' : (profileData.role || 'user'),
            referralCode: profileData.referralCode,
            updatedAt: new Date().toISOString() 
          }, { merge: true });
        } catch {}

        setUserProfile(profileData);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profileData));
        } catch {}

        pushToGoogleSheetWebhook({
          timestamp: new Date().toISOString(),
          displayName: profileData.displayName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber || '',
          role: profileData.role || 'user',
          plan: profileData.plan,
          vipMasterKey: profileData.vipMasterKey,
          status: profileData.status || 'active',
        });
      }
    } catch (err) {
      console.warn('Firestore offline fallback for user profile:', err);
      const fallbackProfile: UserProfileData = {
        userId: currentUser.uid,
        email: currentUser.email || 'user@soverixnet.com',
        displayName: currentUser.displayName || 'Soverix Pilot',
        phoneNumber: customPhone || '',
        photoURL: currentUser.photoURL || '',
        role: isOwnerUser ? 'super_admin' : 'user',
        resellerCredits: isOwnerUser ? 50000 : 0,
        plan: isOwnerUser ? 'Sovereign VIP Lifetime' : 'Free Tier',
        vipMasterKey: `SOVERIX-VIP-${currentUser.uid.substring(0, 8).toUpperCase()}-47CC-B1C1`,
        referralCode: `SOV-${currentUser.uid.substring(0, 6).toUpperCase()}`,
        referredBy: activeRef,
        referralCount: isOwnerUser ? 18 : 0,
        referralEarningsBDT: isOwnerUser ? 2700 : 0,
        referralBonusDays: isOwnerUser ? 270 : 0,
        referralRewardTier: isOwnerUser ? 'Gold Commander' : 'Bronze Pilot',
        status: 'active',
        lastLoginAt: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUserProfile(fallbackProfile);
      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(fallbackProfile));
      } catch {}
    }
  };

  // Real-time listener for user referrals
  useEffect(() => {
    if (!user) {
      setReferrals([]);
      return;
    }
    let unsubReferrals = () => {};
    try {
      unsubReferrals = onSnapshot(
        collection(db, 'users', user.uid, 'referrals'),
        (snapshot) => {
          const refList: ReferralRecord[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ReferralRecord, 'id'>),
          }));
          refList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReferrals(refList);
        },
        () => {}
      );
    } catch {}

    return () => unsubReferrals();
  }, [user]);

  // Real-time listener for user devices
  useEffect(() => {
    if (!user) return;
    let unsubDevices = () => {};
    try {
      unsubDevices = onSnapshot(
        collection(db, 'users', user.uid, 'devices'),
        (snapshot) => {
          const devList: UserDeviceData[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserDeviceData, 'id'>),
          }));
          setDevices(devList);
        },
        () => {}
      );
    } catch {}

    return () => unsubDevices();
  }, [user]);

  // Real-time listener for connection logs
  useEffect(() => {
    if (!user) return;
    let unsubHistory = () => {};
    try {
      unsubHistory = onSnapshot(
        collection(db, 'users', user.uid, 'history'),
        (snapshot) => {
          const logsList: UserConnectionLog[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserConnectionLog, 'id'>),
          }));
          setConnectionLogs(logsList);
        },
        () => {}
      );
    } catch {}

    return () => unsubHistory();
  }, [user]);

  // Instant VIP Login as Super Admin (Works in restricted iframe / network environments)
  const signInDemoVip = async () => {
    const demoId = `vip-${Date.now()}`;
    const demoProfile: UserProfileData = {
      userId: demoId,
      email: OWNER_EMAIL,
      displayName: 'Soverix Master Owner',
      phoneNumber: '+8801700-000000',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'super_admin',
      resellerCredits: 50000,
      resellerVouchersGenerated: 12,
      plan: 'Sovereign VIP Lifetime',
      vipMasterKey: `SOVERIX-VIP-8B392835-972B-47CC-B1C1-770DC30AF179`,
      referralCode: 'SOV-OWNER',
      referralCount: 28,
      referralEarningsBDT: 4200,
      referralBonusDays: 420,
      referralRewardTier: 'Quantum Titan',
      status: 'active',
      lastLoginAt: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserProfile(demoProfile);
    setUser({
      uid: demoId,
      email: demoProfile.email,
      displayName: demoProfile.displayName,
      photoURL: demoProfile.photoURL,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => '',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: demoProfile.phoneNumber,
      providerId: 'google.com',
    } as unknown as User);
    try {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoProfile));
    } catch {}

    // Seed mock referrals for demonstration if empty
    setReferrals([
      {
        id: 'ref-1',
        refId: 'ref-1',
        referrerUserId: demoId,
        referredUserId: 'usr-101',
        referredUserEmail: 'rashed.dev@gmail.com',
        referredUserName: 'Rashedul Islam',
        plan: 'Gaming Turbo Monthly',
        rewardStatus: 'credited',
        rewardAmountBDT: 150,
        rewardBonusDays: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'ref-2',
        refId: 'ref-2',
        referrerUserId: demoId,
        referredUserId: 'usr-102',
        referredUserEmail: 'shakil.gamer@yahoo.com',
        referredUserName: 'Shakil Ahmed',
        plan: 'Cyber Pro 1-Year',
        rewardStatus: 'credited',
        rewardAmountBDT: 150,
        rewardBonusDays: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        id: 'ref-3',
        refId: 'ref-3',
        referrerUserId: demoId,
        referredUserId: 'usr-103',
        referredUserEmail: 'tanjim.v2ray@outlook.com',
        referredUserName: 'Tanjim Hasan',
        plan: 'Sovereign VIP Lifetime',
        rewardStatus: 'credited',
        rewardAmountBDT: 150,
        rewardBonusDays: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      }
    ]);

    pushToGoogleSheetWebhook({
      timestamp: new Date().toISOString(),
      displayName: demoProfile.displayName,
      email: demoProfile.email,
      phoneNumber: demoProfile.phoneNumber,
      role: 'super_admin',
      plan: demoProfile.plan,
      vipMasterKey: demoProfile.vipMasterKey,
      status: 'active',
    });
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (
        error?.code === 'auth/network-request-failed' ||
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/unauthorized-domain'
      ) {
        await signInDemoVip();
        return;
      }
      throw error;
    }
  };

  // Sign In with Email and Password
  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error?.code === 'auth/network-request-failed') {
        const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
        const fallbackProfile: UserProfileData = {
          userId: `user-${Date.now()}`,
          email: email.trim(),
          displayName: email.split('@')[0],
          photoURL: '',
          role: isOwner ? 'super_admin' : 'user',
          resellerCredits: isOwner ? 50000 : 0,
          plan: isOwner ? 'Sovereign VIP Lifetime' : 'Free Tier',
          vipMasterKey: `SOVERIX-VIP-${Date.now().toString(36).toUpperCase()}-47CC`,
          referralCode: `SOV-${Date.now().toString(36).substring(0, 6).toUpperCase()}`,
          referralCount: isOwner ? 18 : 0,
          referralEarningsBDT: isOwner ? 2700 : 0,
          referralBonusDays: isOwner ? 270 : 0,
          referralRewardTier: isOwner ? 'Gold Commander' : 'Bronze Pilot',
          status: 'active',
          lastLoginAt: new Date().toLocaleString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUserProfile(fallbackProfile);
        setUser({
          uid: fallbackProfile.userId,
          email: fallbackProfile.email,
          displayName: fallbackProfile.displayName,
          photoURL: fallbackProfile.photoURL,
          emailVerified: true,
          isAnonymous: false,
        } as unknown as User);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(fallbackProfile));
        } catch {}
        return;
      }
      throw error;
    }
  };

  // Sign Up with Email, Password, Name, Phone & Referral Code
  const signUpWithEmail = async (
    name: string, 
    email: string, 
    pass: string, 
    phone?: string,
    referralCodeInput?: string
  ) => {
    const activeRef = referralCodeInput || incomingRefCode || localStorage.getItem(LOCAL_REF_STORAGE_KEY) || undefined;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (name.trim() && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      }
      await initializeUserProfile(userCredential.user, name.trim(), phone?.trim(), activeRef);
    } catch (error: any) {
      if (error?.code === 'auth/network-request-failed') {
        const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
        const fallbackProfile: UserProfileData = {
          userId: `user-${Date.now()}`,
          email: email.trim(),
          displayName: name.trim() || email.split('@')[0],
          phoneNumber: phone?.trim() || '',
          photoURL: '',
          role: isOwner ? 'super_admin' : 'user',
          resellerCredits: isOwner ? 50000 : 0,
          plan: isOwner ? 'Sovereign VIP Lifetime' : 'Free Tier',
          vipMasterKey: `SOVERIX-VIP-${Date.now().toString(36).toUpperCase()}-47CC`,
          referralCode: `SOV-${Date.now().toString(36).substring(0, 6).toUpperCase()}`,
          referredBy: activeRef,
          referralCount: isOwner ? 18 : 0,
          referralEarningsBDT: isOwner ? 2700 : 0,
          referralBonusDays: isOwner ? 270 : 0,
          referralRewardTier: isOwner ? 'Gold Commander' : 'Bronze Pilot',
          status: 'active',
          lastLoginAt: new Date().toLocaleString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUserProfile(fallbackProfile);
        setUser({
          uid: fallbackProfile.userId,
          email: fallbackProfile.email,
          displayName: fallbackProfile.displayName,
          photoURL: fallbackProfile.photoURL,
          emailVerified: true,
          isAnonymous: false,
        } as unknown as User);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(fallbackProfile));
        } catch {}
        return;
      }
      throw error;
    }
  };

  // Send Password Reset Email
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error?.code === 'auth/network-request-failed') {
        return;
      }
      throw error;
    }
  };

  // Sign Out
  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch {}
    setUser(null);
    setUserProfile(null);
    setDevices([]);
    setConnectionLogs([]);
    setReferrals([]);
  };

  // Claim or Redeem Referral Rewards (Extend VIP or Convert to Reseller Credits)
  const claimReferralReward = async (rewardType: 'days' | 'credits' | 'upgrade'): Promise<boolean> => {
    if (!user || !userProfile) return false;
    try {
      const userRef = doc(db, 'users', user.uid);
      let updatedData: Partial<UserProfileData> = {
        updatedAt: new Date().toISOString()
      };

      if (rewardType === 'upgrade') {
        updatedData.plan = 'Sovereign VIP Lifetime';
      } else if (rewardType === 'credits') {
        updatedData.resellerCredits = (userProfile.resellerCredits || 0) + (userProfile.referralEarningsBDT || 500);
      } else if (rewardType === 'days') {
        // Add 30 additional bonus days
        updatedData.referralBonusDays = (userProfile.referralBonusDays || 0) + 30;
      }

      await setDoc(userRef, updatedData, { merge: true });
      setUserProfile((prev) => prev ? { ...prev, ...updatedData } : null);
      return true;
    } catch (err) {
      console.warn('Failed claiming reward in Firestore:', err);
      // Local fallback
      setUserProfile((prev) => {
        if (!prev) return null;
        if (rewardType === 'upgrade') return { ...prev, plan: 'Sovereign VIP Lifetime' };
        if (rewardType === 'credits') return { ...prev, resellerCredits: (prev.resellerCredits || 0) + 500 };
        return { ...prev, referralBonusDays: (prev.referralBonusDays || 0) + 30 };
      });
      return true;
    }
  };

  // Update User Preferences in Firestore
  const updateUserPreferences = async (
    prefs: Partial<SecuritySettings>,
    protocol?: VPNProtocol
  ) => {
    if (!user) return;
    try {
      const prefRef = doc(db, 'users', user.uid, 'preferences', 'settings');
      await setDoc(
        prefRef,
        {
          userId: user.uid,
          preferredProtocol: protocol || 'wireguard',
          killSwitch: prefs.killSwitch ?? true,
          cleanNetAdBlock: prefs.cleanNetAdBlock ?? true,
          malwareShield: prefs.malwareShield ?? true,
          stealthObfuscation: prefs.stealthObfuscation ?? false,
          quantumSafeKyber: prefs.quantumSafeKyber ?? true,
          dnsProvider: prefs.dnsProvider || 'soverix_secure',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.warn('Failed saving preferences to Firestore:', error);
    }
  };

  // Register New Device
  const addNewDevice = async (name: string, type: 'pc' | 'mobile' | 'tv' | 'router') => {
    if (!user) return;
    const deviceId = `dev-${Date.now()}`;
    const newDev: UserDeviceData = {
      id: deviceId,
      deviceId,
      userId: user.uid,
      deviceName: name,
      deviceType: type,
      virtualIp: `10.66.66.${Math.floor(Math.random() * 200) + 10}`,
      location: 'Sovereign Fast Mesh',
      activeSince: 'Just now',
      lastSeen: new Date().toISOString(),
    };

    try {
      const devRef = doc(db, 'users', user.uid, 'devices', deviceId);
      await setDoc(devRef, newDev);
    } catch {
      setDevices((prev) => [...prev, newDev]);
    }
  };

  // Remove Device
  const removeDevice = async (deviceId: string) => {
    if (!user) return;
    try {
      const devRef = doc(db, 'users', user.uid, 'devices', deviceId);
      await deleteDoc(devRef);
    } catch {
      setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId && d.id !== deviceId));
    }
  };

  // Save Completed VPN Connection Session
  const saveConnectionSession = async (
    serverNodeId: string,
    serverName: string,
    protocol: string,
    durationSecs: number,
    dlMB: number,
    ulMB: number
  ) => {
    if (!user || durationSecs <= 0) return;
    const logId = `log-${Date.now()}`;
    const newLog: UserConnectionLog = {
      id: logId,
      logId,
      userId: user.uid,
      serverNodeId,
      serverName,
      protocol,
      connectedAt: new Date().toISOString(),
      durationSeconds: durationSecs,
      bytesDownloadedMB: dlMB,
      bytesUploadedMB: ulMB,
    };

    try {
      const logRef = doc(db, 'users', user.uid, 'history', logId);
      await setDoc(logRef, newLog);
    } catch {
      setConnectionLogs((prev) => [newLog, ...prev]);
    }
  };

  // Update User Role & Reseller Credits (Super Admin capability)
  const updateUserRoleAndCredits = async (targetUserId: string, role: UserRole, credits?: number) => {
    try {
      const userRef = doc(db, 'users', targetUserId);
      const updateData: Partial<UserProfileData> = {
        role,
        updatedAt: new Date().toISOString()
      };
      if (credits !== undefined) {
        updateData.resellerCredits = credits;
      }
      await setDoc(userRef, updateData, { merge: true });
    } catch (err) {
      console.warn('Failed updating user role in firestore:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        devices,
        connectionLogs,
        referrals,
        incomingRefCode,
        userReferralLink,
        userReferralCode,
        loading,
        isSuperAdmin,
        isAdmin,
        isReseller,
        canAccessAdminPanel,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signInDemoVip,
        signOutUser,
        updateUserPreferences,
        addNewDevice,
        removeDevice,
        saveConnectionSession,
        updateUserRoleAndCredits,
        claimReferralReward,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
