"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

interface InteractiveProductCardProps {
  href: string;
  imageSrc: string;
  title: string;
  description: string;
  badges?: React.ReactNode;
  icon?: React.ReactNode;
  isWide?: boolean;
  className?: string;
  priceDisplay?: string;
}

export default function InteractiveProductCard({
  href,
  imageSrc,
  title,
  description,
  badges,
  icon,
  isWide = false,
  className = "",
  priceDisplay,
}: InteractiveProductCardProps) {
  const { addToCart } = useStore();
  const ref = useRef<HTMLAnchorElement>(null);
  
  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["100%", "0%"]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    // Normalize values between -0.5 and 0.5
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price: 25.00,
      image: imageSrc,
      unit: "1 Pack",
      seller: "Jasuda Premium"
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative glass-panel rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-300 flex flex-col ${
        isHovered ? "shadow-2xl shadow-primary/20 border-primary/30" : "shadow-sm border-white/40"
      } ${className}`}
    >
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
        }}
      />
      
      {isWide ? (
        <div className="flex flex-col md:flex-row h-full grow min-h-[240px]">
          <div className="w-full md:w-1/2 min-h-[200px] md:min-h-full relative overflow-hidden shrink-0">
            <motion.img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            {/* Add to cart overlay */}
            <motion.div 
              className="absolute inset-0 bg-surface/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <motion.button
                onClick={handleAddToCart}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors pointer-events-auto"
              >
                <ShoppingBag className="w-4 h-4" /> Tambahkan ke Keranjang
              </motion.button>
            </motion.div>
          </div>
          <div className="grow p-5 md:p-6 flex flex-col justify-center text-left relative z-10 bg-white/50 backdrop-blur-sm">
            {badges && <div className="mb-2">{badges}</div>}
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="font-bold text-lg text-on-background group-hover:text-primary transition-colors leading-tight">
                {title}
              </h3>
              {priceDisplay && (
                <span className="font-bold text-lg text-primary whitespace-nowrap bg-primary/10 px-3 py-1 rounded-full">{priceDisplay}</span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              {description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full grow p-6 justify-between relative z-10 bg-white/50 backdrop-blur-sm min-h-[240px]">
          <div className="flex flex-col gap-4 text-left">
            {icon ? (
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            ) : (
              <div className="w-full h-32 rounded-xl overflow-hidden relative mb-2">
                <motion.img 
                  src={imageSrc} 
                  alt={title} 
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-on-background group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-primary font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
              Jelajahi <span>→</span>
            </span>
            <motion.button
              onClick={handleAddToCart}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-white flex items-center justify-center text-primary transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.a>
  );
}
