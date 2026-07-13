"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/components/context/StoreContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  Copy,
  Timer,
  Download,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import GlobalHeader from "@/components/shared/GlobalHeader";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, addToCart, updateQuantity } = useStore();

  // Local state
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bca" | "qris">("bca");
  const [timeLeft, setTimeLeft] = useState(86344); // 23h 59m 4s in seconds
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutPhase, setCheckoutPhase] = useState<"summary" | "payment">(
    "summary",
  );

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Development mode: Auto add item if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      addToCart({
        id: "dummy-dev",
        name: "Produk Contoh (Mode Dev)",
        price: 150000,
        image:
          "https://images.unsplash.com/photo-1550411294-850d0325d762?auto=format&fit=crop&q=80",
        unit: "1 kg",
        seller: "Toko Jasuda",
      });
    }
  }, [cart.length, addToCart]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText("807739210092112");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutPhase === "summary") {
      setCheckoutPhase("payment");
    } else {
      setOrderPlaced(true);
      clearCart();
    }
  };

  const grandTotal = cartTotal;

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <GlobalHeader storeName="Posko Jasuda" />
        <div className="flex-1 flex items-center justify-center p-6 bg-surface">
          <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-white/50 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-2">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Pesanan Dikonfirmasi!
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Terima kasih atas pesanan Anda. Kami telah menerima pesanan botani
              laut premium Anda dan akan segera memprosesnya.
            </p>
            <div className="w-full bg-surface-container-low p-4 rounded-xl text-left text-xs space-y-1 mt-2">
              <p>
                <strong>Metode Pembayaran:</strong>{" "}
                {paymentMethod === "bca"
                  ? "BCA Virtual Account"
                  : "Dompet Digital QRIS"}
              </p>
            </div>
            <Link
              href="/"
              className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-container transition-colors w-full"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      {/* Unified Global Header */}
      <GlobalHeader storeName="Posko Jasuda" />

      {/* Checkout Content */}
      <main className="grow max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Pembayaran
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant font-medium">
            Selesaikan pesanan untuk rangkaian komoditas laut premium dan produk
            lokal pilihan Anda.
          </p>
        </div>

        <form onSubmit={handleCompletePayment} className="flex flex-col gap-8">
          {/* Order Summary */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-primary border-b border-outline-variant/10 pb-3">
              Ringkasan Pesanan
            </h3>

            {cart.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1 premium-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grow">
                      <h4 className="font-bold text-on-surface text-xs md:text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                        {item.seller}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-bold text-primary text-xs md:text-sm">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </div>
                      <div className="flex items-center gap-1.5 border border-outline-variant/30 rounded-lg p-0.5 bg-surface-container-low text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-5 h-5 flex items-center justify-center hover:bg-surface-container rounded transition-colors text-on-surface-variant cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-5 h-5 flex items-center justify-center hover:bg-surface-container rounded transition-colors text-on-surface-variant cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant py-4 text-center">
                Keranjang belanja Anda kosong.
              </p>
            )}

            <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between font-bold text-sm text-primary pt-3 mt-1">
                <span>Total Tagihan</span>
                <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <AnimatePresence>
            {checkoutPhase === "payment" && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-primary-container" />
                    Metode Pembayaran
                  </h2>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 inline-block text-center">
                    Status: Menunggu Pembayaran
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* BCA Virtual Account */}
                  <div
                    className={`border rounded-2xl p-4 transition-all duration-300 ${
                      paymentMethod === "bca"
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant/20 hover:bg-surface-container-low/50 cursor-pointer"
                    }`}
                    onClick={() => setPaymentMethod("bca")}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "bca"}
                          onChange={() => setPaymentMethod("bca")}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="font-bold text-sm text-on-surface">
                          BCA Virtual Account
                        </span>
                      </div>
                      <span className="font-extrabold text-blue-600 text-base italic tracking-tight">
                        BCA
                      </span>
                    </div>

                    <AnimatePresence>
                      {paymentMethod === "bca" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs font-semibold border-b border-outline-variant/10 pb-2">
                              <span className="text-on-surface-variant">
                                Nomor VA
                              </span>
                              <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2.5 py-0.5 rounded font-bold">
                                <Timer className="w-3.5 h-3.5" />
                                <span>{formatTimer(timeLeft)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-on-surface tracking-wider">
                                8077 3921 0092 112
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyVA}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary hover:bg-primary/10 transition-colors font-bold text-xs cursor-pointer"
                              >
                                {copied ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                <span>{copied ? "Tersalin" : "Salin"}</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* QRIS Option */}
                  <div
                    className={`border rounded-2xl p-4 transition-all duration-300 ${
                      paymentMethod === "qris"
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant/20 hover:bg-surface-container-low/50 cursor-pointer"
                    }`}
                    onClick={() => setPaymentMethod("qris")}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "qris"}
                          onChange={() => setPaymentMethod("qris")}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="font-bold text-sm text-on-surface">
                          QRIS
                        </span>
                      </div>
                      <span className="font-extrabold text-rose-600 text-sm italic tracking-tight">
                        QRIS
                      </span>
                    </div>

                    <AnimatePresence>
                      {paymentMethod === "qris" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col items-center gap-4 text-center">
                            <p className="text-xs text-on-surface-variant font-medium">
                              Pindai kode QR menggunakan mobile banking atau
                              aplikasi dompet digital yang didukung.
                            </p>

                            <div className="w-40 h-40 bg-surface-container flex items-center justify-center rounded-xl border border-outline-variant/40 shadow-inner relative overflow-hidden">
                              <QrCode className="w-32 h-32 text-on-background opacity-80" />
                              <div className="absolute inset-0 border-[6px] border-white rounded-xl"></div>
                            </div>

                            <button
                              type="button"
                              className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Unduh Kode QR
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] text-outline font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            Pembayaran Terenkripsi
          </p>

          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full bg-linear-to-r from-primary to-primary-container text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 cursor-pointer"
          >
            {checkoutPhase === "summary"
              ? "Selesaikan Pembayaran"
              : "Konfirmasi Pembayaran Saya"}
          </button>
        </form>
      </main>
    </div>
  );
}
