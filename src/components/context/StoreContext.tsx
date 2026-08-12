"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/toast';
import { loginUser, registerUser, getAuthSession, logoutUser } from '@/lib/actions/auth';
import { getUserProfile, getAdminAccount } from '@/lib/actions/user';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductModalData {
  id?: string;
  name: string;
  price: string | number;
  description: string;
  image: string;
  vendor: string;
  unit?: string;
  shopeeLink?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  photoURL?: string;
}

interface StoreContextType {
  activeNav: number;
  setActiveNav: (nav: number) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  role: string | null;
  user: User | null;
  updateUser: (fields: Partial<User>) => void;
  loading: boolean;
  login: (email: string, password?: string) => Promise<string | null>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isProductModalOpen: boolean;
  selectedProductForModal: ProductModalData | null;
  openProductModal: (product: ProductModalData) => void;
  closeProductModal: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: apakah role ini termasuk user biasa (bukan admin/editor)?
// ─────────────────────────────────────────────────────────────────────────────
function isRegularUser(role: string | null) {
  return role === 'user';
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [activeNav, setActiveNavState] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductModalData | null>(null);

  // Refs: tidak menyebabkan re-render, aman dipakai dalam debounce closure
  const userIdRef = useRef<string | null>(null);

  // Selalu sinkronkan userIdRef saat user state berubah
  useEffect(() => {
    userIdRef.current = user?.uid ?? null;
  }, [user]);

  const updateUser = (fields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...fields };
      try {
        localStorage.setItem('jasuda_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // ── Init: verifikasi sesi server, load cart dari DB ──────────────────────
  useEffect(() => {
    async function initSession() {
      const savedNav = localStorage.getItem('jasuda_nav');
      if (savedNav) setActiveNavState(parseInt(savedNav, 10));

      const serverUser = await getAuthSession();
      if (serverUser) {
        const userRole = (serverUser.role || 'user').toLowerCase();
        let photoURL: string | undefined = undefined;
        let displayName: string = serverUser.displayName;

        if (isRegularUser(userRole)) {
          // ── Load profile dari database ──
          const profileRes = await getUserProfile(serverUser.uid);
          if (profileRes.success && profileRes.profile) {
            if (profileRes.profile.photo) photoURL = profileRes.profile.photo;
            if (profileRes.profile.name) displayName = profileRes.profile.name;
          }
        } else {
          const adminRes = await getAdminAccount(serverUser.uid, serverUser.email);
          if (adminRes.success && adminRes.profile) {
            if (adminRes.profile.photo) photoURL = adminRes.profile.photo;
            if (adminRes.profile.name) displayName = adminRes.profile.name;
          }
        }

        const userObj: User = {
          uid: serverUser.uid,
          email: serverUser.email,
          displayName,
          role: userRole,
          photoURL,
        };

        userIdRef.current = serverUser.uid;
        setUser(userObj);
        setIsLoggedIn(true);
        setRole(userRole);
        setIsAdmin(userRole === 'admin' || userRole === 'operator' || userRole === 'pengurus');
        setIsEditor(userRole === 'editor');
        localStorage.setItem('jasuda_user', JSON.stringify(userObj));
      } else {
        // Tidak ada sesi aktif
        userIdRef.current = null;
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsEditor(false);
        setRole(null);
        setUser(null);
        localStorage.removeItem('jasuda_user');
      }
      setLoading(false);
    }
    initSession();
  }, []);

  // ── Product Modal ────────────────────────────────────────────────────────
  const openProductModal = (product: ProductModalData) => {
    setSelectedProductForModal(product);
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setSelectedProductForModal(null), 300);
  };


  // ── setActiveNav ─────────────────────────────────────────────────────────
  const setActiveNav = (nav: number) => {
    setActiveNavState(nav);
    localStorage.setItem('jasuda_nav', nav.toString());
  };

  // ── login ────────────────────────────────────────────────────────────────
  const login = async (email: string, password?: string): Promise<string | null> => {
    const result = await loginUser(email, password);
    if (result.success) {
      const u = result.user;
      const userRole = (u.role || 'user').toLowerCase();
      const userObj: User = { uid: u.uid, email: u.email, displayName: u.displayName, role: userRole };

      userIdRef.current = u.uid;
      setUser(userObj);
      setIsLoggedIn(true);
      setRole(userRole);
      setIsAdmin(userRole === 'admin' || userRole === 'operator' || userRole === 'pengurus');
      setIsEditor(userRole === 'editor');
      // Simpan sesi di localStorage (nama saja, bukan credentials sensitif)
      localStorage.setItem('jasuda_user', JSON.stringify(userObj));

      return userRole;
    } else {
      throw new Error(result.error);
    }
  };

  // ── signup ───────────────────────────────────────────────────────────────
  const signup = async (email: string, password?: string, name?: string) => {
    const result = await registerUser(name || email.split('@')[0], email, password);
    if (result.success) {
      const u = result.user;
      const userObj: User = { uid: u.uid, email: u.email, displayName: u.displayName, role: 'user' };
      userIdRef.current = u.uid;
      setUser(userObj);
      setIsLoggedIn(true);
      setRole('user');
      setIsAdmin(false);
      setIsEditor(false);
      localStorage.setItem('jasuda_user', JSON.stringify(userObj));
    } else {
      throw new Error(result.error);
    }
  };

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await logoutUser();
    userIdRef.current = null;
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsEditor(false);
    setRole(null);
    setUser(null);
    localStorage.removeItem('jasuda_user');
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const isUser = isRegularUser(role) && !isAdmin && !isEditor;

  return (
    <StoreContext.Provider
      value={{
        activeNav,
        setActiveNav,
        isLoggedIn,
        isAdmin,
        isEditor,
        role,
        user,
        updateUser,
        loading,
        login,
        signup,
        logout,
        isProductModalOpen,
        selectedProductForModal,
        openProductModal,
        closeProductModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
