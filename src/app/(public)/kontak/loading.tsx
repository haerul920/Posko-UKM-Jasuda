import React from "react";
import ActiveNavigation from "@/components/shared/ActiveNavigation";

export default function KontakLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation storeName="Posko UKM Jasuda" />
      <main className="grow pt-16 pb-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header Section Skeleton */}
        <div className="text-center mb-16 max-w-2xl mx-auto pt-8 flex flex-col items-center">
          <div className="w-64 h-12 bg-slate-200/60 rounded-xl animate-pulse mb-6"></div>
          <div className="w-full h-5 bg-slate-200/60 rounded-full animate-pulse mb-2"></div>
          <div className="w-3/4 h-5 bg-slate-200/60 rounded-full animate-pulse"></div>
        </div>

        {/* Contact Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column: Form Skeleton */}
          <div className="bg-white/70 border border-slate-100 rounded-2xl p-8 md:p-10 shadow-sm animate-pulse">
            <div className="w-48 h-8 bg-slate-200/60 rounded-lg mb-8"></div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="w-24 h-4 bg-slate-200/60 rounded mb-2"></div>
                  <div className="w-full h-12 bg-slate-200/60 rounded-xl"></div>
                </div>
                <div>
                  <div className="w-16 h-4 bg-slate-200/60 rounded mb-2"></div>
                  <div className="w-full h-12 bg-slate-200/60 rounded-xl"></div>
                </div>
              </div>
              
              <div>
                <div className="w-16 h-4 bg-slate-200/60 rounded mb-2"></div>
                <div className="w-full h-12 bg-slate-200/60 rounded-xl"></div>
              </div>

              <div>
                <div className="w-16 h-4 bg-slate-200/60 rounded mb-2"></div>
                <div className="w-full h-36 bg-slate-200/60 rounded-xl"></div>
              </div>

              <div className="w-full h-14 bg-slate-200/60 rounded-xl mt-4"></div>
            </div>
          </div>

          {/* Right Column: Socials & Address Skeleton */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/70 border border-slate-100 rounded-2xl p-8 shadow-sm animate-pulse grow">
              <div className="w-64 h-8 bg-slate-200/60 rounded-lg mb-8"></div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* 2 small squares */}
                <div className="h-32 bg-slate-200/60 rounded-2xl"></div>
                <div className="h-32 bg-slate-200/60 rounded-2xl"></div>
                
                {/* 1 wide rectangle */}
                <div className="col-span-2 h-24 bg-slate-200/60 rounded-2xl"></div>
                
                {/* 2 small squares */}
                <div className="h-32 bg-slate-200/60 rounded-2xl"></div>
                <div className="h-32 bg-slate-200/60 rounded-2xl"></div>
                
                {/* 1 wide rectangle */}
                <div className="col-span-2 h-24 bg-slate-200/60 rounded-2xl"></div>
              </div>
            </div>

            {/* Address Banner */}
            <div className="bg-slate-200/60 rounded-2xl h-32 animate-pulse"></div>
          </div>

        </div>
      </main>
    </div>
  );
}
