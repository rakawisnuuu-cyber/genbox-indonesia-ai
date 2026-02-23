import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Images, ImagePlus, Download, Eye, Film, Camera, UserCircle } from "lucide-react";
import { format } from "date-fns";

type FilterTab = "semua" | "gambar" | "video" | "karakter";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "semua", label: "SEMUA" },
  { key: "gambar", label: "GAMBAR" },
  { key: "video", label: "VIDEO" },
  { key: "karakter", label: "KARAKTER" },
];

const Gallery = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>("semua");

  const { data: generations = [], isLoading } = useQuery({
    queryKey: ["gallery", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // For now all generations are images; filter logic ready for future types
  const filtered = generations.filter(() => {
    if (activeTab === "semua") return true;
    if (activeTab === "gambar") return true; // all current gens are images
    return false; // video/karakter not yet
  });

  return (
    <div className="space-y-0">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white uppercase tracking-wider font-satoshi">
        GALLERY
      </h1>

      {/* Filter Tabs */}
      <div className="mt-6 flex border-b border-[#2A2A2A]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-1 mr-6 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab.key
                ? "text-white border-primary"
                : "text-[#666] border-transparent hover:text-[#999] cursor-pointer"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-[#1A1A1A]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#2A2A2A] rounded w-1/3" />
                  <div className="h-3 bg-[#2A2A2A] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#141414] border-dashed border-2 border-[#2A2A2A] rounded-xl p-12 text-center">
            <Images className="w-14 h-14 mx-auto text-white/20" />
            <p className="text-lg text-[#666] mt-4 font-medium">Gallery masih kosong</p>
            <p className="text-sm text-[#555] mt-1">
              Mulai generate untuk mengisi gallery kamu!
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-1.5 mt-4 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition"
            >
              <ImagePlus className="w-4 h-4" />
              BUAT GAMBAR PERTAMA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((gen) => (
              <GalleryCard key={gen.id} generation={gen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryCard = ({
  generation,
}: {
  generation: {
    id: string;
    image_url: string | null;
    prompt: string | null;
    model: string | null;
    created_at: string;
    status: string;
  };
}) => {
  const typeBadge = { label: "IMAGE", color: "bg-blue-500/20 text-blue-400" };

  return (
    <div className="group bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        {generation.image_url ? (
          <img
            src={generation.image_url}
            alt={generation.prompt || "Generated image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
            <Camera className="w-8 h-8 text-[#333]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white/20 transition">
            <Eye className="w-4 h-4 text-white" />
            <span className="text-xs text-white font-medium">Lihat Detail</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeBadge.color}`}
        >
          {typeBadge.label}
        </span>
        <p className="text-xs text-[#666] mt-1.5">
          {format(new Date(generation.created_at), "dd MMM yyyy")}
        </p>
        <p className="text-xs text-[#555] mt-0.5 truncate">
          {generation.model || "Nano Banana Pro"}
        </p>
      </div>
    </div>
  );
};

export default Gallery;
