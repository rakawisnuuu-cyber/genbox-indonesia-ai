import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, UserCircle, Camera, RotateCcw, Mic, PersonStanding, Search, Hand, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SKIN_TONES } from "@/data/characterFormOptions";
import type { CharacterConfig } from "@/data/presetCharacters";

interface CharacterData {
  id: string;
  name: string;
  tags: string[];
  description: string;
  gradient?: string;
  heroImageUrl?: string | null;
  isPreset: boolean;
  gender?: string;
  age_range?: string;
  config?: CharacterConfig | Record<string, string>;
}

interface Props {
  character: CharacterData | null;
  onClose: () => void;
  onUse: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SHOT_PLACEHOLDERS = [
  { icon: Camera, label: "Hero Portrait" },
  { icon: RotateCcw, label: "3/4 Profile" },
  { icon: Mic, label: "Talking" },
  { icon: PersonStanding, label: "Full Body" },
  { icon: Search, label: "Skin Detail" },
  { icon: Hand, label: "Product" },
];

const CharacterDetailModal = ({ character, onClose, onUse, onDelete }: Props) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [handleEsc]);

  if (!character) return null;

  const config = character.config as Record<string, string> | undefined;
  const skinToneInfo = config?.skin_tone
    ? SKIN_TONES.find((s) => s.value === config.skin_tone)
    : null;

  const expressionMap: Record<string, string> = {
    hangat_ramah: "Hangat & Ramah",
    percaya_diri: "Percaya Diri",
    kalem_pro: "Kalem Profesional",
    energik_ceria: "Energik Ceria",
    lembut_natural: "Lembut Natural",
  };

  const infoRows = [
    { label: "Gender", value: config?.gender === "female" ? "Wanita" : config?.gender === "male" ? "Pria" : character.gender },
    { label: "Usia", value: config?.age_range || character.age_range },
    {
      label: "Warna Kulit",
      value: skinToneInfo ? skinToneInfo.label : config?.skin_tone?.replace(/_/g, " "),
      swatch: skinToneInfo?.color,
    },
    { label: "Bentuk Wajah", value: config?.face_shape },
    { label: "Warna Mata", value: config?.eye_color },
    { label: "Gaya Rambut", value: config?.hair_style },
    { label: "Warna Rambut", value: config?.hair_color },
    { label: "Ekspresi", value: config?.expression ? expressionMap[config.expression] || config.expression.replace(/_/g, " ") : undefined },
    { label: "Outfit", value: config?.outfit },
    { label: "Kondisi Kulit", value: config?.skin_condition },
  ].filter((r) => r.value);

  const customNotes = config?.custom_notes;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 bg-[#141414] border border-[#2A2A2A] w-full overflow-y-auto ${
          isMobile
            ? "rounded-t-2xl max-h-[90vh] animate-slide-up"
            : "rounded-xl max-w-2xl max-h-[85vh] animate-scale-in"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#141414] border-b border-[#2A2A2A] px-5 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white font-satoshi">{character.name}</h2>
            <span
              className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase ${
                character.isPreset
                  ? "bg-[#2A2A2A]/80 text-[#888]"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {character.isPreset ? "PRESET" : "CUSTOM"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          {/* 6-Shot Grid */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#666] mb-3 font-satoshi">
              6-SHOT PACK
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SHOT_PLACEHOLDERS.map((shot) => {
                const Icon = shot.icon;
                return (
                  <div
                    key={shot.label}
                    className="bg-[#1A1A1A] rounded-lg aspect-square flex flex-col items-center justify-center gap-1"
                  >
                    <Icon className="w-5 h-5 text-[#444]" />
                    <span className="text-[#555] text-[10px] text-center px-1">{shot.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Character Info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#666] mb-3 font-satoshi">
              DETAIL KARAKTER
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <p className="text-[10px] text-[#666] uppercase tracking-wider">{row.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {row.swatch && (
                      <div
                        className="w-4 h-4 rounded-full border border-[#2A2A2A] shrink-0"
                        style={{ backgroundColor: row.swatch }}
                      />
                    )}
                    <p className="text-sm text-white capitalize">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {customNotes && (
              <div className="mt-4">
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Catatan Khusus</p>
                <p className="text-sm text-[#888] italic mt-0.5">{customNotes}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {character.description && (
            <div>
              <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Deskripsi</p>
              <p className="text-sm text-[#888]">{character.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#141414] border-t border-[#2A2A2A] px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => {
              onUse(character.id);
              onClose();
            }}
            className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition"
          >
            GUNAKAN KARAKTER
          </button>

          {!character.isPreset && (
            <>
              <button
                onClick={() => {
                  navigate(`/characters/create?edit=${character.id}`);
                  onClose();
                }}
                className="border border-[#2A2A2A] text-[#888] px-4 py-2.5 rounded-lg text-sm hover:border-[#555] hover:text-white transition"
              >
                EDIT
              </button>
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(character.id);
                    onClose();
                  }}
                  className="text-red-500/70 hover:text-red-500 text-sm px-4 py-2.5 flex items-center gap-1 transition ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  HAPUS
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailModal;
