import ReelViewer from "@/components/ReelViewer";

// Mock Data for MVP Reels
const REELS_DATA = [
  {
    id: "r1",
    videoUrl: "", // Empty for MVP, using animated placeholder in component
    shopName: "Urban Furniture Studio",
    shopAvatar: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop",
    productName: "Minimalist Oak Dining Chair",
    price: 2999,
    likes: 1240,
    comments: 48,
  },
  {
    id: "r2",
    videoUrl: "", 
    shopName: "The Sneaker Drop",
    shopAvatar: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=200&auto=format&fit=crop",
    productName: "Nike Air Force 1 '07",
    price: 7200,
    likes: 3421,
    comments: 112,
  },
  {
    id: "r3",
    videoUrl: "", 
    shopName: "Tech Hub Electronics",
    shopAvatar: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=200&auto=format&fit=crop",
    productName: "Sony PlayStation 5 Disc Edition",
    price: 44990,
    likes: 8900,
    comments: 450,
  }
];

export const metadata = {
  title: "Look2Local Reels - Discover Local Deals",
};

export default function ReelsPage() {
  return (
    <div className="bg-black min-h-[calc(100vh-64px)] w-full">
      <ReelViewer reels={REELS_DATA} />
    </div>
  );
}
