"use client";

import React, { use } from 'react';
import { useStore } from '@/components/context/StoreContext';
import ActiveNavigation from '@/components/shared/ActiveNavigation';
import { ShoppingBag, Sparkles, Tag, Layers, Waves } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TenantStorePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { activeNav, addToCart } = useStore();

  const tenantName = resolvedParams.slug === "kelp-forest-co" ? "Kelp Forest Co." : "Oceanic Tenant Store";

  const products = [
    {
      id: "dried-sugar-kelp",
      name: "Dried Sugar Kelp",
      price: 14.99,
      desc: "Rich in umami, perfect for broths and B2B stocks.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEgnImVVyWzRlAzz1WBhPpFJH2t8ZcB8bwtdUfP0HFZZQ4MCDd2GP2UWHWC_h3T-6CDyqsDp0qYMa-3-1FRfK1ODGxLi5FtVQHv-IkvXPk0ZzNT4OfNkuaGXOHz2cKwwfwFsksBxnoAJa8LiSngR8IJIxBPR0JpApNtcIKaRAZo_ZipLrOcDZiZiGx7ImduAPEeOhwfspvLm4EDBJ8sEty3_zrn20H6SLBYKkR_XltA_kOgjy0ydpanA",
      unit: "250g Pack",
      badge: "Organic"
    },
    {
      id: "kelp-seasoning",
      name: "Kelp Seasoning Blend",
      price: 9.50,
      desc: "Everyday healthy sodium seasoning replacement.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgVlUW8AdLHnoDBI6oMKINlGenDq6AkUn7FWXmeUs8y8iZHTiX9lJKEt0Sg2dCPu6fdKjGLNkU3H1gI3xV50NpsX3MqqEDFEkOfK98Q-6RHPNWvjgfO142E6fk4mgg17JkMA9PUWZo0Tlp-1hA7GHU3fwFQ1UNn81ijsRzy01D6Theiq5bjMytEzDEoBeq0TUuIyhpWhgF_0LDVqOMZcv-Yh5zQD_F21tvXcj5lGXG2ow0Vtz3dOh_zQ",
      unit: "150g Shaker",
      badge: null
    },
    {
      id: "premium-kombu",
      name: "Premium Kombu Strips",
      price: 22.00,
      desc: "Thick sun-dried seaweed kelp, essential for traditional dashi.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj-ZK2G1-WGwbzG30dpgfk0XqHefFeVzV0KZZoA90atcxAj-ykqq_sh0YPLm9QZX2LW8CjOp9YqwSKgJVMwj9oRZjFQwwXorgZuqIG5qynKNFHVTYrOURMJeuee7z8h1EEka88nHYh3xMlVtxbESbXEXCD-_earzcFGgn34wJN9r-M1p0b70rlzlUU3BV7M_hoSxI-2xpxTSV2XjLpa7QTMNswlUpFvSk-JByzxGF4HZQ1FH6Yo1eiMA",
      unit: "400g Pack",
      badge: "Grade A"
    },
    {
      id: "liquid-kelp",
      name: "Liquid Kelp Extract",
      price: 34.99,
      desc: "Highly concentrated nutrients for healthcare & wellness formulations.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnRq9G03Xsc67-dYa1QNuhbnBu45r91bag1xIf22VcUtN17R8t0HhEEqs8edIpxknd2nRAhRF0ODN6UdA86g7Ymn4lDPgG45wXlcG-yBVLw1XxMwYJkcs9s2CFyFRorD8qf0siAhVqreDIatBX5oFdycShd5sko6ff2Zfb3yJ6pC1zuX2NybMdbOapnaKLs-7uIZNLEFHjWU5Q1fkS0VLZtZY8dlbdl8mML_kPo8GY5xQxxUL9xScXMA",
      unit: "100ml Dropper",
      badge: "Concentrated"
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      seller: tenantName
    });
  };

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={false} storeName={tenantName} />

      {isHeaderOnlyNav ? (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12">
          {/* Store Header Banner */}
          <header className="mb-12 text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{tenantName}</h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Premium, sustainably harvested marine seaweed straight from pristine coastal currents. 
              Refined with zero chemical additives, perfect for culinary and wellness applications.
            </p>
          </header>

          {/* Symmetrical 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article 
                key={product.id} 
                className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 w-full bg-surface-container-low select-none">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                  {product.badge && (
                    <span className="absolute top-3 right-3 bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col grow">
                  <h3 className="font-bold text-sm text-on-surface mb-1 truncate">{product.name}</h3>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 block">{product.unit}</span>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4 grow">
                    {product.desc}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/10">
                    <span className="font-bold text-sm text-primary">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </main>
      ) : null}
    </div>
  );
}
