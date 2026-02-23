import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PRESET_CHARACTERS } from "@/data/presetCharacters";
import CharacterCard from "@/components/characters/CharacterCard";
import CharacterDetailModal from "@/components/characters/CharacterDetailModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Tab = "preset" | "custom";

const Characters = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("preset");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data: customCharacters = [], isLoading } = useQuery({
    queryKey: ["characters", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_preset", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUse = (characterId: string) => {
    navigate(`/generate?character=${characterId}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("characters").delete().eq("id", deleteId);
    queryClient.invalidateQueries({ queryKey: ["characters"] });
    setDeleteId(null);
  };

  // Resolve detail character from preset or custom
  const detailCharacter = detailId
    ? (() => {
        const preset = PRESET_CHARACTERS.find((c) => c.id === detailId);
        if (preset) {
          return {
            id: preset.id,
            name: preset.name,
            tags: preset.tags,
            description: preset.description,
            gradient: preset.gradient,
            isPreset: true,
            gender: preset.gender,
            age_range: preset.age_range,
            config: preset.config,
          };
        }
        const custom = customCharacters.find((c) => c.id === detailId);
        if (custom) {
          return {
            id: custom.id,
            name: custom.name,
            tags: custom.tags || [],
            description: custom.description || "",
            heroImageUrl: custom.hero_image_url,
            isPreset: false,
            gender: custom.gender || undefined,
            age_range: custom.age_range || undefined,
            config: (custom.config as Record<string, string>) || undefined,
          };
        }
        return null;
      })()
    : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "preset", label: "PRESET" },
    { key: "custom", label: "KARAKTER SAYA" },
  ];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider font-satoshi">
            KARAKTER
          </h1>
          <p className="text-sm text-[#888] mt-1">
            Pilih atau buat karakter untuk konten UGC kamu
          </p>
        </div>
        <Link
          to="/characters/create"
          className="mt-3 sm:mt-0 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          BUAT KARAKTER BARU
        </Link>
      </div>

      {/* Tabs */}
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
        {activeTab === "preset" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRESET_CHARACTERS.map((char, i) => (
              <CharacterCard
                key={char.id}
                id={char.id}
                name={char.name}
                tags={char.tags}
                description={char.description}
                gradient={char.gradient}
                isPreset
                index={i}
                onUse={handleUse}
                onDetail={setDetailId}
              />
            ))}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-[#1A1A1A]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#2A2A2A] rounded w-2/3" />
                  <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : customCharacters.length === 0 ? (
          <div className="bg-[#141414] border-dashed border-2 border-[#2A2A2A] rounded-xl p-12 text-center">
            <UserCircle className="w-14 h-14 mx-auto text-white/20" />
            <p className="text-lg text-[#666] mt-4 font-medium">Belum ada karakter custom</p>
            <p className="text-sm text-[#555] mt-1">
              Buat karakter unik kamu untuk konten yang konsisten
            </p>
            <Link
              to="/characters/create"
              className="inline-flex items-center gap-1.5 mt-4 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" />
              BUAT KARAKTER PERTAMA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customCharacters.map((char, i) => (
              <CharacterCard
                key={char.id}
                id={char.id}
                name={char.name}
                tags={char.tags || []}
                description={char.description || ""}
                heroImageUrl={char.hero_image_url}
                isPreset={false}
                index={i}
                onUse={handleUse}
                onDetail={setDetailId}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Character Detail Modal */}
      {detailCharacter && (
        <CharacterDetailModal
          character={detailCharacter}
          onClose={() => setDetailId(null)}
          onUse={handleUse}
          onDelete={(id) => {
            setDetailId(null);
            setDeleteId(id);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#141414] border-[#2A2A2A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Hapus Karakter?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              Karakter ini akan dihapus permanen dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2A2A2A] text-[#888] hover:text-white">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Characters;
