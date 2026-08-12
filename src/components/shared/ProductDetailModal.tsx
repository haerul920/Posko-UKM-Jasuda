"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Store, ShoppingBag, X } from 'lucide-react';
import { useStore } from '@/components/context/StoreContext';

export default function ProductDetailModal() {
  const { isProductModalOpen, selectedProductForModal, closeProductModal } = useStore();

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;

  return (
    <AnimatePresence>
      {isProductModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:min-h-[420px]"
            >
              {/* Close Button */}
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 text-black rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="md:w-1/2 relative h-64 md:h-auto md:min-h-[420px] bg-surface-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-bold w-max">
                  <Store className="w-3.5 h-3.5" />
                  {product.vendor}
                </div>
                
                <h2 className="text-2xl font-extrabold text-on-surface mb-2 leading-tight">
                  {product.name}
                </h2>
                
                <p className="text-xl font-bold text-primary mb-4">
                  {typeof product.price === 'string' && product.price.includes('k') ? product.price : (typeof product.price === 'string' ? product.price : `Rp ${product.price.toLocaleString('id-ID')}`)}
                </p>
                
                <div className="w-12 h-1 bg-primary/20 rounded-full mb-4" />
                
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-1">
                  {product.description}
                </p>

                <div className="flex flex-row gap-3 mt-auto pt-4 border-t border-outline-variant/20">
                  
                  <a
                    href={product.shopeeLink || "https://s.shopee.co.id/9KguRGtDKj"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#EE4D2D] text-white border border-[#EE4D2D]/30 py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-[#EE4D2D]/90 transition-colors shadow-md active:scale-[0.98]"
                  >
                    <img src="/image/ikon%20shopee.webp" alt="Shopee" className="w-4 h-4 object-contain" />
                    Beli di Shopee
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
