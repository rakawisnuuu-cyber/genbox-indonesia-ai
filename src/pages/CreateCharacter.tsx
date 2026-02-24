import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CharacterPreview from "@/components/characters/CharacterPreview";
import { Camera, RotateCcw, Mic, PersonStanding, Search, Hand } from "lucide-react";
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
  Camera,
  RotateCcw,
  Mic,
  PersonStanding,
  Search,
  Hand,
};

const ShotIcon = ({ name }: { name: string }) => {
  const Icon = SHOT_ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className="w-4 h-4 text-[#666]" />;
};

const inputClass =
  "w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition placeholder:text-[#555]";
const selectClass = inputClass + " appearance-none";
const sectionLabel = "text-xs uppercase tracking-widest text-[#666] mb-3 mt-6 font-satoshi";

const CreateCharacter = () => {
  const { user } = useAuth();
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

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
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

    let error;
    if (editId) {
      ({ error } = await supabase
        .from("characters")
        .update(payload)
        .eq("id", editId)
        .eq("user_id", user.id));
    } else {
      ({ error } = await supabase.from("characters").insert({
        ...payload,
        user_id: user.id,
        is_preset: false,
      }));
    }

    setSaving(false);

    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editId ? "Karakter berhasil diperbarui!" : "Karakter berhasil disimpan!" });
    navigate("/characters");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-[#666] text-sm">Memuat karakter...</div>
      </div>
    );
  }

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
          {/* Skin tone swatches */}
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

          <select
            className={selectClass}
            value={form.faceShape}
            onChange={(e) => set("faceShape", e.target.value)}
          >
            <option value="">Bentuk wajah</option>
            {FACE_SHAPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            className={selectClass}
            value={form.eyeColor}
            onChange={(e) => set("eyeColor", e.target.value)}
          >
            <option value="">Warna mata</option>
            {EYE_COLORS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* RAMBUT */}
        <p className={sectionLabel}>RAMBUT</p>
        <div className="space-y-4">
          <select
            className={selectClass}
            value={form.hairStyle}
            onChange={(e) => set("hairStyle", e.target.value)}
          >
            <option value="">Gaya rambut</option>
            {hairOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <div>
            <select
              className={selectClass}
              value={form.hairColor}
              onChange={(e) => set("hairColor", e.target.value)}
            >
              <option value="">Warna rambut</option>
              {HAIR_COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {isHijab && (
              <p className="text-[#555] text-xs mt-1">(terlihat di bagian depan hijab)</p>
            )}
          </div>
        </div>

        {/* LOOKS & VIBES */}
        <p className={sectionLabel}>LOOKS & VIBES</p>
        <div className="space-y-4">
          <select
            className={selectClass}
            value={form.expression}
            onChange={(e) => set("expression", e.target.value)}
          >
            <option value="">Ekspresi</option>
            {EXPRESSIONS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>

          <select
            className={selectClass}
            value={form.outfit}
            onChange={(e) => set("outfit", e.target.value)}
          >
            <option value="">Gaya outfit</option>
            {OUTFIT_STYLES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <select
            className={selectClass}
            value={form.skinCondition}
            onChange={(e) => set("skinCondition", e.target.value)}
          >
            <option value="">Kondisi kulit</option>
            {SKIN_CONDITIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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
              <div
                key={shot.label}
                className="flex flex-col items-center gap-0.5 min-w-[48px]"
              >
                <ShotIcon name={shot.icon} />
                <span className="text-[10px] text-[#666] whitespace-nowrap">{shot.label}</span>
              </div>
            ))}
          </div>
        </div>

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
