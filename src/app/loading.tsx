"use client";

export default function HomeLoading() {
  return (
    <div className="grow flex flex-col min-h-screen bg-surface">
      {/* Fake Header Skeleton */}
      <div className="w-full h-18 sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-xs px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-40 h-8 bg-surface-container-high rounded-full animate-pulse"></div>
          <div className="hidden md:flex gap-4">
            <div className="w-20 h-5 bg-surface-container-high rounded-md animate-pulse"></div>
            <div className="w-20 h-5 bg-surface-container-high rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-9 bg-surface-container-high rounded-full animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 animate-pulse">
        {/* Main Hero Section Skeleton */}
        <div className="relative rounded-3xl overflow-hidden min-h-95 flex items-center bg-surface-container p-8 md:p-12 border border-white/40">
          <div className="md:w-2/3 flex flex-col items-start gap-4">
            <div className="w-3/4 h-10 bg-surface-container-highest rounded-lg"></div>
            <div className="w-1/2 h-10 bg-surface-container-highest rounded-lg mb-2"></div>
            <div className="w-full max-w-xl h-4 bg-surface-container-high rounded-md"></div>
            <div className="w-4/5 max-w-xl h-4 bg-surface-container-high rounded-md mb-4"></div>
            <div className="w-44 h-11 rounded-full bg-surface-container-highest"></div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block bg-surface-container-high rounded-r-3xl"></div>
        </div>

        {/* Featured Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Wide Card */}
          <div className="md:col-span-2 h-64 bg-surface-container rounded-2xl border border-white/40 p-6 flex flex-col justify-end gap-3">
            <div className="w-1/3 h-6 bg-surface-container-highest rounded-md"></div>
            <div className="w-2/3 h-4 bg-surface-container-high rounded-md"></div>
          </div>

          {/* Counter 1 */}
          <div className="h-64 bg-surface-container rounded-2xl border border-white/40 p-6 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-12 bg-surface-container-highest rounded-lg"></div>
            <div className="w-24 h-5 bg-surface-container-high rounded-md"></div>
          </div>

          {/* Counter 2 */}
          <div className="h-64 bg-surface-container rounded-2xl border border-white/40 p-6 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-12 bg-surface-container-highest rounded-lg"></div>
            <div className="w-24 h-5 bg-surface-container-high rounded-md"></div>
          </div>

          {/* Bento 2: Wide Card */}
          <div className="md:col-span-2 h-64 bg-surface-container rounded-2xl border border-white/40 p-6 flex flex-col justify-end gap-3">
            <div className="w-1/3 h-6 bg-surface-container-highest rounded-md"></div>
            <div className="w-2/3 h-4 bg-surface-container-high rounded-md"></div>
          </div>
        </div>

        {/* Product Marquee / Featured Products Skeleton */}
        <div className="mt-4 flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <div className="w-44 h-8 bg-surface-container-high rounded-lg"></div>
            <div className="w-32 h-9 bg-surface-container-high rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xs flex flex-col p-4 gap-4">
                <div className="h-44 bg-surface-container rounded-xl"></div>
                <div className="w-3/4 h-5 bg-surface-container-high rounded-md"></div>
                <div className="w-1/2 h-4 bg-surface-container rounded-md"></div>
                <div className="flex justify-between items-center mt-2">
                  <div className="w-16 h-6 bg-surface-container-high rounded-md"></div>
                  <div className="w-8 h-8 bg-surface-container rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
