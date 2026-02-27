import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CharacterPreview from "@/components/characters/CharacterPreview";
import { Camera, RotateCcw, Mic, PersonStanding, Search, Hand, Loader2, Check, ArrowLeft, Save } from "lucide-react";
import {
  AGE_RANGES,
  SKIN_TONES,
  FACE_SHAPES,
  EYE_COLORS,
  HAIR_STYLES_FEMALE,
  HAIR_STYLES_MALE,
  HAIR_COLORS,
  EXPRESSIONS,
  OUTFIT_STYLES,
  SKIN_CONDITIONS,
  SHOT_TYPES,
} from "@/data/characterFormOptions";

const SHOT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera, RotateCcw, Mic, PersonStanding, Search, Hand,
};

const ShotIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = SHOT_ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className || "w-4 h-4 text-[#666]"} />;
};

const SHOT_KEYS = [
  { key: "hero_portrait", label: "Hero Portrait", icon: "Camera" },
  { key: "profile_3_4", label: "3/4 Profile", icon: "RotateCcw" },
  { key: "talking", label: "Talking", icon: "Mic" },
  { key: "full_body", label: "Full Body", icon: "PersonStanding" },
  { key: "skin_detail", label: "Skin Detail", icon: "Search" },
  { key: "product_interaction", label: "Product", icon: "Hand" },
] as const;

const inputClass =
  "w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition placeholder:text-[#555]";
const selectClass = inputClass + " appearance-none";
const sectionLabel = "text-xs uppercase tracking-widest text-[#666] mb-3 mt-6 font-satoshi";

type GenerationPhase = "form" | "generating" | "complete" | "error";

interface ShotResult {
  type: string;
  url: string;
}

const CreateCharacter = () => {
  const { user, session } = useAuth();
  const { profile, credits } = useDashboardData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [form, setForm] = useState({
    name: "",
    gender: "" as "" | "female" | "male",
    ageRange: "",
    skinTone: "sawo_matang",
    faceShape: "",
    eyeColor: "",
    hairStyle: "",
    hairColor: "",
    expression: "",
    outfit: "",
    skinCondition: "",
    customNotes: "",
  });

  // Generation state
  const [phase, setPhase] = useState<GenerationPhase>("form");
  const [shots, setShots] = useState<ShotResult[]>([]);
  const [generationError, setGenerationError] = useState("");
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Fetch character data for edit mode
  useEffect(() => {
    if (!editId || !user) return;
    const fetchCharacter = async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", editId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast({ title: "Karakter tidak ditemukan", variant: "destructive" });
        navigate("/characters");
        return;
      }

      const config = (data.config as Record<string, string>) || {};
      setForm({
        name: data.name || "",
        gender: (config.gender || data.gender || "") as "" | "female" | "male",
        ageRange: config.age_range || data.age_range || "",
        skinTone: config.skin_tone || "sawo_matang",
        faceShape: config.face_shape || "",
        eyeColor: config.eye_color || "",
        hairStyle: config.hair_style || "",
        hairColor: config.hair_color || "",
        expression: config.expression || "",
        outfit: config.outfit || "",
        skinCondition: config.skin_condition || "",
        customNotes: config.custom_notes || "",
      });
      setLoading(false);
    };
    fetchCharacter();
  }, [editId, user]);

  const isHijab = form.hairStyle.toLowerCase().includes("hijab");
  const hairOptions = form.gender === "male" ? HAIR_STYLES_MALE : HAIR_STYLES_FEMALE;
  const tier = profile?.tier || "free";
  const imageCredits = credits?.image_credits ?? 3;
  const canSubmit = form.name.trim() && form.gender;

  // Edit mode: save text only
  const handleEditSave = async () => {
    if (!canSubmit || !user || !editId) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      age_range: form.ageRange,
      style: form.outfit.toLowerCase().replace(/\s/g, "_"),
      tags: [
        form.gender === "female" ? "Wanita" : "Pria",
        form.ageRange,
        form.outfit,
      ].filter(Boolean),
      description: `${form.name} — ${form.gender === "female" ? "Wanita" : "Pria"}, ${form.ageRange || ""}`.trim(),
      config: {
        gender: form.gender,
        age_range: form.ageRange,
        skin_tone: form.skinTone,
        face_shape: form.faceShape,
        eye_color: form.eyeColor,
        hair_style: form.hairStyle,
        hair_color: form.hairColor,
        expression: form.expression,
        outfit: form.outfit,
        skin_condition: form.skinCondition,
        custom_notes: form.customNotes,
      },
    };

    const { error } = await supabase
      .from("characters")
      .update(payload)
      .eq("id", editId)
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Karakter berhasil diperbarui!" });
    navigate("/characters");
  };

  // Create mode: call generation API
  const handleGenerate = async () => {
    if (!canSubmit || !user || !session?.access_token) return;

    setPhase("generating");
    setShots([]);
    setGenerationError("");
    setElapsedSeconds(0);

    // Start elapsed timer
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const characterConfig = {
        gender: form.gender,
        age_range: form.ageRange,
        skin_tone: form.skinTone,
        face_shape: form.faceShape,
        eye_color: form.eyeColor,
        hair_style: form.hairStyle,
        hair_color: form.hairColor,
        expression: form.expression,
        outfit: form.outfit,
        skin_condition: form.skinCondition,
        custom_notes: form.customNotes,
      };

      const res = await fetch("/api/generate/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          characterConfig,
          name: form.name.trim(),
        }),
      });

      clearInterval(timer);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal membuat karakter.");
      }

      const data = await res.json();
      setCharacterId(data.characterId);
      setShots(data.shots || []);
      setPhase("complete");
    } catch (err: unknown) {
      clearInterval(timer);
      setGenerationError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setPhase("error");
    }
  };

  const handleSubmit = () => {
    if (editId) {
      handleEditSave();
    } else {
      handleGenerate();
    }
  };

  const getShotUrl = (key: string): string | null => {
    const shot = shots.find((s) => s.type === key);
    return shot?.url || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-[#666] text-sm">Memuat karakter...</div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // GENERATION PROGRESS / COMPLETE VIEW
  // ═══════════════════════════════════════
  if (phase === "generating" || phase === "complete" || phase === "error") {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider font-satoshi">
            {phase === "generating" ? "Membuat Karakter..." : phase === "complete" ? "Karakter Selesai!" : "Generasi Gagal"}
          </h1>
          <p className="text-sm text-[#888] mt-1">
            {phase === "generating" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                Generating 6-shot pack • {elapsedSeconds}s
              </span>
            ) : phase === "complete" ? (
              `${form.name} — ${shots.length}/6 shots berhasil`
            ) : (
              generationError
            )}
          </p>
        </div>

        {/* Cost info */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
          <p className="text-xs text-[#888]">
            {tier === "free" ? (
              <>Menggunakan 1 kredit dari <span className="text-primary font-bold">{imageCredits}</span> kredit</>
            ) : (
              <>Estimasi biaya: ~Rp 2.520 dari API key kamu</>
            )}
          </p>
        </div>

        {/* 6-Shot Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {SHOT_KEYS.map((shot, i) => {
            const url = getShotUrl(shot.key);
            const isHero = shot.key === "hero_portrait";

            return (
              <div
                key={shot.key}
                className={`relative rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] ${
                  isHero ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`${isHero ? "aspect-[3/4]" : "aspect-square"} relative`}>
                  {url ? (
                    <img
                      src={url}
                      alt={shot.label}
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
                      phase === "generating" ? "animate-pulse" : ""
                    }`}>
                      <ShotIcon name={shot.icon} className="w-6 h-6 text-[#444]" />
                      <span className="text-[11px] text-[#555] font-medium">{shot.label}</span>
                      {phase === "generating" && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary/50 mt-1" />
                      )}
                    </div>
                  )}

                  {/* Completed check overlay */}
                  {url && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Label bar */}
                <div className="px-3 py-2 border-t border-[#2A2A2A] flex items-center gap-2">
                  <ShotIcon name={shot.icon} className="w-3.5 h-3.5 text-[#555]" />
                  <span className="text-[11px] text-[#666] font-medium uppercase tracking-wider">{shot.label}</span>
                  {url && <Check className="w-3 h-3 text-primary ml-auto" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        {phase === "complete" && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8 animate-fade-in">
            <button
              onClick={() => {
                toast({ title: "Karakter berhasil disimpan!" });
                navigate("/characters");
              }}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-base px-6 py-3 rounded-lg w-full sm:w-auto hover:brightness-110 transition"
            >
              <Save className="w-4 h-4" />
              SIMPAN KARAKTER
            </button>
            <button
              onClick={() => navigate("/characters")}
              className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#888] px-6 py-3 rounded-lg hover:border-[#555] hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              KEMBALI
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8 animate-fade-in">
            <button
              onClick={() => {
                setPhase("form");
                setGenerationError("");
              }}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-base px-6 py-3 rounded-lg w-full sm:w-auto hover:brightness-110 transition"
            >
              COBA LAGI
            </button>
            <button
              onClick={() => navigate("/characters")}
              className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#888] px-6 py-3 rounded-lg hover:border-[#555] hover:text-white transition"
            >
              BATAL
            </button>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════
  // FORM VIEW
  // ═══════════════════════════════════════
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT — Form */}
      <div className="flex-[3] min-w-0">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider font-satoshi">
          {editId ? "EDIT KARAKTER" : "BUAT KARAKTER BARU"}
        </h1>
        <p className="text-sm text-[#888] mt-1">
          {editId ? "Perbarui identitas karakter kamu" : "Desain identitas karakter untuk konten UGC kamu"}
        </p>

        {/* DASAR */}
        <p className={sectionLabel}>DASAR</p>
        <div className="space-y-4">
          <input
            type="text"
            className={inputClass}
            placeholder="Contoh: Sari, Budi, Rina..."
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={50}
          />

          <div className="flex gap-2">
            {(["female", "male"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  set("gender", g);
                  set("hairStyle", "");
                }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold text-center transition-all border ${
                  form.gender === g
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-[#1A1A1A] text-[#888] border-[#2A2A2A] hover:border-[#555]"
                }`}
              >
                {g === "female" ? "Wanita" : "Pria"}
              </button>
            ))}
          </div>

          <select
            className={selectClass}
            value={form.ageRange}
            onChange={(e) => set("ageRange", e.target.value)}
          >
            <option value="">Pilih rentang usia</option>
            {AGE_RANGES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* WAJAH */}
        <p className={sectionLabel}>WAJAH</p>
        <div className="space-y-4">
          <div>
            <div className="flex gap-3">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => set("skinTone", tone.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      form.skinTone === tone.value
                        ? "border-primary ring-2 ring-primary/30 scale-110"
                        : "border-[#2A2A2A] hover:border-[#555]"
                    }`}
                    style={{ backgroundColor: tone.color }}
                  />
                  <span className="text-[10px] text-[#666]">{tone.label}</span>
                </button>
              ))}
            </div>
          </div>

          <select className={selectClass} value={form.faceShape} onChange={(e) => set("faceShape", e.target.value)}>
            <option value="">Bentuk wajah</option>
            {FACE_SHAPES.map((f) => (<option key={f} value={f}>{f}</option>))}
          </select>

          <select className={selectClass} value={form.eyeColor} onChange={(e) => set("eyeColor", e.target.value)}>
            <option value="">Warna mata</option>
            {EYE_COLORS.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>

        {/* RAMBUT */}
        <p className={sectionLabel}>RAMBUT</p>
        <div className="space-y-4">
          <select className={selectClass} value={form.hairStyle} onChange={(e) => set("hairStyle", e.target.value)}>
            <option value="">Gaya rambut</option>
            {hairOptions.map((h) => (<option key={h} value={h}>{h}</option>))}
          </select>

          <div>
            <select className={selectClass} value={form.hairColor} onChange={(e) => set("hairColor", e.target.value)}>
              <option value="">Warna rambut</option>
              {HAIR_COLORS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            {isHijab && <p className="text-[#555] text-xs mt-1">(terlihat di bagian depan hijab)</p>}
          </div>
        </div>

        {/* LOOKS & VIBES */}
        <p className={sectionLabel}>LOOKS & VIBES</p>
        <div className="space-y-4">
          <select className={selectClass} value={form.expression} onChange={(e) => set("expression", e.target.value)}>
            <option value="">Ekspresi</option>
            {EXPRESSIONS.map((e) => (<option key={e.value} value={e.value}>{e.label}</option>))}
          </select>

          <select className={selectClass} value={form.outfit} onChange={(e) => set("outfit", e.target.value)}>
            <option value="">Gaya outfit</option>
            {OUTFIT_STYLES.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>

          <select className={selectClass} value={form.skinCondition} onChange={(e) => set("skinCondition", e.target.value)}>
            <option value="">Kondisi kulit</option>
            {SKIN_CONDITIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        {/* CATATAN TAMBAHAN */}
        <p className={sectionLabel}>CATATAN TAMBAHAN</p>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder={`Deskripsikan detail khusus... (opsional)\nContoh: punya tahi lalat kecil di pipi kiri, senyum khas, dll.`}
          value={form.customNotes}
          onChange={(e) => set("customNotes", e.target.value)}
          maxLength={500}
        />

        {/* COST INFO */}
        {!editId && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 mt-6">
            <p className="text-sm font-semibold text-white">6-Shot Character Pack</p>
            <p className="text-xs text-[#888] mt-1">
              Sistem akan generate 6 foto referensi: Hero Portrait, 3/4 Profile,
              Talking to Camera, Full Body, Skin Detail, dan Product Interaction.
            </p>
            <p className="text-sm mt-3">
              {tier === "free" ? (
                <>
                  Biaya: 1 kredit dari{" "}
                  <span className="text-primary font-bold">{imageCredits}</span> kredit kamu
                </>
              ) : (
                <span className="text-[#888]">
                  Estimasi biaya: ~Rp 2.520 (dari API key kamu)
                </span>
              )}
            </p>
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {SHOT_TYPES.map((shot) => (
                <div key={shot.label} className="flex flex-col items-center gap-0.5 min-w-[48px]">
                  <ShotIcon name={shot.icon} />
                  <span className="text-[10px] text-[#666] whitespace-nowrap">{shot.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile preview */}
        <div className="lg:hidden mt-6">
          <CharacterPreview formData={form} />
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className={`flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-base px-6 py-3 rounded-lg w-full sm:w-auto transition ${
              !canSubmit || saving ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
            }`}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Menyimpan..." : editId ? "SIMPAN PERUBAHAN" : "GENERATE KARAKTER"}
          </button>
          <Link
            to="/characters"
            className="flex items-center justify-center border border-[#2A2A2A] text-[#888] px-6 py-3 rounded-lg hover:border-[#555] hover:text-white transition"
          >
            BATAL
          </Link>
        </div>
      </div>

      {/* RIGHT — Preview (desktop only) */}
      <div className="hidden lg:block flex-[2] min-w-0">
        <div className="sticky top-24">
          <CharacterPreview formData={form} />
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;
