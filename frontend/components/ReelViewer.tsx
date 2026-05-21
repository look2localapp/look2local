"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Store, Lock, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import OfferLockModal from "./OfferLockModal";

interface ReelProps {
  id: string;
  videoUrl: string;
  shopName: string;
  shopAvatar: string;
  productName: string;
  price: number;
  likes: number;
  comments: number;
}

export default function ReelViewer({ reels }: { reels: ReelProps[] }) {
  const [activeReel, setActiveReel] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll snapping detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const index = Math.round(scrollPosition / container.clientHeight);
      if (index !== activeReel && index >= 0 && index < reels.length) {
        setActiveReel(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeReel, reels.length]);

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-64px)] w-full max-w-md mx-auto bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {reels.map((reel, index) => (
        <div key={reel.id} className="h-full w-full snap-start relative bg-gray-900 flex items-center justify-center">
          {/* Video element - using a placeholder container for MVP if no real video */}
          <div className="absolute inset-0 w-full h-full object-cover bg-gray-800 flex flex-col items-center justify-center">
            {/* MVP Placeholder for Video */}
            <div className="animate-pulse text-gray-500 flex flex-col items-center">
               <span className="text-4xl mb-4">🎬</span>
               <span>Playing Reel {index + 1}</span>
            </div>
            {/* If you had a real video, it would go here:
            <video 
               src={reel.videoUrl} 
               autoPlay={index === activeReel}
               loop
               muted={isMuted}
               className="w-full h-full object-cover" 
            /> */}
          </div>

          {/* Sound Toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 flex items-end justify-between">
            
            {/* Left side: Info & CTA */}
            <div className="flex-1 pr-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden relative border-2 border-primary">
                  <Image src={reel.shopAvatar} alt={reel.shopName} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1">
                    {reel.shopName}
                    <span className="bg-blue-500 text-white text-[10px] px-1 rounded">✓</span>
                  </h3>
                  <p className="text-gray-300 text-xs">Sponsored</p>
                </div>
                <button className="ml-2 px-3 py-1 bg-transparent border border-white text-white text-xs font-bold rounded-full hover:bg-white/20 transition">
                  Follow
                </button>
              </div>

              <p className="text-white text-sm mb-3 line-clamp-2">
                {reel.productName} - Special Drop! 🔥 Get it before it's gone.
              </p>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 mb-2 border border-white/20">
                <div>
                  <p className="text-white font-bold text-lg">₹{reel.price.toLocaleString("en-IN")}</p>
                  <p className="text-gray-300 text-xs line-through">₹{(reel.price * 1.2).toLocaleString("en-IN")}</p>
                </div>
                <button 
                  onClick={() => setIsLockModalOpen(true)}
                  className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  <Lock className="w-4 h-4" /> Lock Offer
                </button>
              </div>
            </div>

            {/* Right side: Action Buttons */}
            <div className="flex flex-col items-center gap-6 pb-4">
              <button className="flex flex-col items-center text-white group">
                <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition">
                  <Heart className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium mt-1">{reel.likes}</span>
              </button>
              
              <button className="flex flex-col items-center text-white group">
                <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium mt-1">{reel.comments}</span>
              </button>

              <button className="flex flex-col items-center text-white group">
                <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/40 transition">
                  <Share2 className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium mt-1">Share</span>
              </button>

              <Link href={`/shops/${reel.id}`} className="w-10 h-10 rounded-md bg-white overflow-hidden relative border-2 border-white mt-2">
                <Image src={reel.shopAvatar} alt="Shop" fill className="object-cover" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Re-use the existing Offer Lock Modal */}
      {reels[activeReel] && (
        <OfferLockModal 
          isOpen={isLockModalOpen} 
          onClose={() => setIsLockModalOpen(false)}
          product={{
            title: reels[activeReel].productName,
            shopName: reels[activeReel].shopName,
            offerPrice: reels[activeReel].price,
            imageUrl: reels[activeReel].shopAvatar // In real app, this would be product image
          }}
        />
      )}
      
      {/* Global style to hide scrollbar for reel viewer */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
}
