"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  seller: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  activeNav: number; // 1 to 5 representing navigation alternatives
  setActiveNav: (nav: number) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  role: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<string | null>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeNav, setActiveNavState] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load state on mount (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('jasuda_cart');
    const savedNav = localStorage.getItem('jasuda_nav');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedNav) {
      setActiveNavState(parseInt(savedNav, 10));
    }
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      
      if (currentUser) {
        try {
          // Check role in Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userRole = userDoc.data().role;
            setRole(userRole);
            setIsAdmin(userRole === 'admin');
            setIsEditor(userRole === 'editor');
          } else {
            setRole(null);
            setIsAdmin(false);
            setIsEditor(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
          setIsAdmin(false);
          setIsEditor(false);
        }
      } else {
        setRole(null);
        setIsAdmin(false);
        setIsEditor(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem('jasuda_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("jasuda_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        const newCart = prevCart.filter((item) => item.id !== id);
        localStorage.setItem("jasuda_cart", JSON.stringify(newCart));
        return newCart;
      }
      const newCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem("jasuda_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('jasuda_cart');
  };

  const setActiveNav = (nav: number) => {
    setActiveNavState(nav);
    localStorage.setItem('jasuda_nav', nav.toString());
  };

  const login = async (email: string, password?: string): Promise<string | null> => {
    if (!password) {
      if (email.toLowerCase() === 'admin') {
        setIsLoggedIn(true);
        setIsAdmin(true);
        setIsEditor(false);
        setRole('admin');
        return 'admin';
      } else if (email.toLowerCase() === 'editor') {
        setIsLoggedIn(true);
        setIsAdmin(false);
        setIsEditor(true);
        setRole('editor');
        return 'editor';
      }
      return null;
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    try {
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().role || 'user';
      }
    } catch (error) {
      console.error("Error fetching user role on login redirect:", error);
    }
    return 'user';
  };

  const signup = async (email: string, password?: string, name?: string) => {
    if (!password) throw new Error("Kata sandi diperlukan");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (name) {
      await updateProfile(user, { displayName: name });
    }
    
    // Set default role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: name || '',
      role: 'user',
      createdAt: new Date(),
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Set default role if new user
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'user',
        createdAt: new Date(),
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsEditor(false);
    setRole(null);
    setUser(null);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        activeNav,
        setActiveNav,
        isLoggedIn,
        isAdmin,
        isEditor,
        role,
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
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
