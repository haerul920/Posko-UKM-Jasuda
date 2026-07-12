"use client";

import React from 'react';
import GlobalHeader from './GlobalHeader';

interface ActiveNavigationProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function ActiveNavigation({ storeName, isPremium }: ActiveNavigationProps) {
  return <GlobalHeader storeName={storeName} isPremium={isPremium} />;
}
