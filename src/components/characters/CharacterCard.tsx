import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CharacterCardProps {
  id: string;
  name: string;
  tags: string[];
  description: string;
  gradient?: string;
  heroImageUrl?: string | null;
  isPreset: boolean;
  index: number;
  onUse: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CharacterCard = ({
  id,
  name,
  tags,
  description,
  gradient,
  heroImageUrl,
  isPreset,
  index,
  onUse,
  onDelete,
}: CharacterCardProps) => (
  <div
    className="animate-fade-up bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer group"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {/* Avatar area */}
    <div className="aspect-[3/4] bg-[#1A1A1A] relative overflow-hidden">
      {heroImageUrl ? (
        <img src={heroImageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradient || "from-gray-800/40 to-neutral-800/40"} flex items-center justify-center`}>
          <UserCircle className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-sm font-bold tracking-wider uppercase">LIHAT DETAIL</span>
      </div>

      {/* Badge */}
      <span
        className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full uppercase backdrop-blur-sm ${
          isPreset
            ? "bg-[#2A2A2A]/80 text-[#888]"
            : "bg-primary/20 text-primary"
        }`}
      >
        {isPreset ? "PRESET" : "CUSTOM"}
      </span>
    </div>

    {/* Info */}
    <div className="p-4">
      <h3 className="text-base font-semibold text-white">{name}</h3>
      <div className="mt-1 flex items-center gap-1 text-[12px] text-[#888]">
        {tags.map((tag, i) => (
          <span key={tag}>
            {i > 0 && <span className="mx-0.5">•</span>}
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-[#666] line-clamp-2">{description}</p>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onUse(id); }}
          className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-110 transition"
        >
          GUNAKAN
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="border border-[#2A2A2A] text-[#888] text-xs px-3 py-1.5 rounded-lg hover:border-[#666] hover:text-white transition"
        >
          DETAIL
        </button>
        {!isPreset && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
            className="ml-auto text-red-500/60 text-xs px-2 py-1.5 rounded-lg hover:text-red-500 hover:bg-red-500/10 transition"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  </div>
);

export default CharacterCard;
