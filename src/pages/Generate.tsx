import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useGeneration } from "@/hooks/useGeneration";
import { usePayment } from "@/hooks/usePayment";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { toast } from "sonner";
import {
  Upload,
  X,
  ChevronDown,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Download,
  RefreshCw,
  AlertTriangle,
  Paintbrush,
  Clock,
  Cpu,
  Crown,
  ArrowRight,
  Camera,
  RotateCcw,
  Mic,
  User,
  Search,
  Hand,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── Scene options ───
const backgroundOptions = [
  "Studio Putih",
  "Outdoor Cafe",
  "Kamar Tidur",
  "Dapur Modern",
  "Taman",
  "Custom...",
];
const poseOptions = [
  "Memegang Produk",
  "Selfie dengan Produk",
  "Flat Lay",
  "Unboxing",
  "Menggunakan Produk",
  "Review",
];
const moodOptions = [
  "Happy Review",
  "Excited Unboxing",
  "Casual Lifestyle",
  "Professional",
];

interface CharacterOption {
  id: string;
  name: string;
  hero_image_url: string | null;
  tags: string[] | null;
  is_preset: boolean;
}

const Generate = () => {
  const { user, session } = useAuth();
  const { profile, credits } = useDashboardData();
  const generation = useGeneration();
  const { buyLifetime, isProcessing: paymentProcessing } = usePayment();

  // ─── Form state ───
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId);

  const [background, setBackground] = useState("Studio Putih");
  const [customBg, setCustomBg] = useState("");
  const [pose, setPose] = useState("Memegang Produk");
  const [mood, setMood] = useState("Happy Review");

  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);

  const tier = profile?.tier || "free";
  const imageCredits = credits?.image_credits ?? 0;

  // ─── Fetch characters ───
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("characters")
        .select("id, name, hero_image_url, tags, is_preset")
        .or(`user_id.eq.${user.id},is_preset.eq.true`)
        .order("is_preset", { ascending: false });
      if (data) setCharacters(data);
    })();
  }, [user]);

  // ─── Upload product image ───
  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
        toast.error("Format tidak didukung. Gunakan JPEG, PNG, atau WebP.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Ukuran file maksimal 10MB.");
        return;
      }
      if (!user) return;

      setUploading(true);
      const preview = URL.createObjectURL(file);
      setProductPreview(preview);

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: true });

      if (error) {
        toast.error("Gagal mengupload gambar.");
        setProductPreview(null);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      setProductImageUrl(urlData.publicUrl);
      setUploading(false);
    },
    [user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const removeProduct = () => {
    setProductImageUrl(null);
    setProductPreview(null);
  };

  // ─── Generate prompt ───
  const handleGeneratePrompt = async () => {
    if (!productImageUrl || !selectedCharacterId || !session?.access_token) {
      toast.error("Upload produk dan pilih karakter terlebih dahulu.");
      return;
    }

    setPromptLoading(true);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productImageUrl,
          characterId: selectedCharacterId,
          scene: {
            background: background === "Custom..." ? customBg : background,
            pose,
            mood,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal membuat prompt.");
      }

      const data = await res.json();
      setPrompt(data.prompt);
      toast.success("Prompt berhasil dibuat!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat prompt.");
    } finally {
      setPromptLoading(false);
    }
  };

  // ─── Generate image ───
  const handleGenerate = () => {
    if (!productImageUrl || !selectedCharacterId || !prompt) return;
    generation.startGeneration({
      productImageUrl,
      characterId: selectedCharacterId,
      prompt,
      scene: {
        background: background === "Custom..." ? customBg : background,
        pose,
        mood,
      },
    });
  };

  const handleRegenerate = () => {
    generation.reset();
    handleGenerate();
  };

  const handleDownload = async () => {
    if (!generation.resultUrl) return;
    try {
      const res = await fetch(generation.resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `genbox-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal mendownload gambar.");
    }
  };

  const canGenerate =
    !!productImageUrl && !!selectedCharacterId && !!prompt && !generation.isLoading;

  const presets = characters.filter((c) => c.is_preset);
  const custom = characters.filter((c) => !c.is_preset);

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 -mx-4 lg:-mx-6 -my-4 lg:-my-8 min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
      {/* ══════ LEFT PANEL ══════ */}
      <div className="w-full lg:w-[55%] lg:h-screen lg:overflow-y-auto px-4 lg:px-6 py-6 lg:py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white font-satoshi tracking-wider uppercase">
            Generate Gambar
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Buat konten UGC realistis dengan AI
          </p>
        </div>

        {/* ── Section 1: Upload ── */}
        <div>
          <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 block font-medium">
            Upload Produk
          </label>

          {!productPreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[hsl(var(--border))] rounded-xl p-8 bg-[hsl(var(--background))] hover:border-primary/30 transition cursor-pointer flex flex-col items-center justify-center gap-3"
            >
              {uploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
              )}
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Drag & drop foto produk
              </p>
              <p className="text-xs text-[#555]">atau klik untuk pilih file</p>
              <p className="text-[10px] text-[#444]">JPEG, PNG, WebP — Maks 10MB</p>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={productPreview}
                alt="Product"
                className="w-32 h-32 rounded-lg object-cover border border-[hsl(var(--border))]"
              />
              <button
                onClick={removeProduct}
                className="absolute -top-2 -right-2 w-6 h-6 bg-[hsl(var(--destructive))] rounded-full flex items-center justify-center text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {uploading && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
        </div>

        {/* ── Section 2: Character ── */}
        <div>
          <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 block font-medium">
            Pilih Karakter
          </label>

          <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
            <SelectTrigger className="bg-[#1A1A1A] border-[hsl(var(--border))] text-white">
              <SelectValue placeholder="Pilih karakter..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[hsl(var(--border))]">
              {presets.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-[10px] uppercase tracking-widest text-[#555]">
                    Preset
                  </SelectLabel>
                  {presets.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-white">
                      <span className="flex items-center gap-2">
                        {c.hero_image_url ? (
                          <img
                            src={c.hero_image_url}
                            className="w-5 h-5 rounded-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#2A2A2A]" />
                        )}
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {custom.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-[10px] uppercase tracking-widest text-[#555]">
                    Karakter Saya
                  </SelectLabel>
                  {custom.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-white">
                      <span className="flex items-center gap-2">
                        {c.hero_image_url ? (
                          <img
                            src={c.hero_image_url}
                            className="w-5 h-5 rounded-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#2A2A2A]" />
                        )}
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>

          {/* Selected card */}
          {selectedCharacter && (
            <div className="mt-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 flex items-center gap-3">
              {selectedCharacter.hero_image_url ? (
                <img
                  src={selectedCharacter.hero_image_url}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#555]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {selectedCharacter.name}
                </p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {selectedCharacter.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-[#2A2A2A] text-[#888] px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      tier === "free"
                        ? "bg-[#2A2A2A] text-[#888]"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {tier === "free" ? "FREE" : "BYOK"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/characters/create"
            className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
          >
            Buat karakter baru <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── Section 3: Scene ── */}
        <div>
          <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 block font-medium">
            Pengaturan Scene
          </label>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#666] mb-1.5">Background</p>
              <Select value={background} onValueChange={setBackground}>
                <SelectTrigger className="bg-[#1A1A1A] border-[hsl(var(--border))] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[hsl(var(--border))]">
                  {backgroundOptions.map((o) => (
                    <SelectItem key={o} value={o} className="text-white">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {background === "Custom..." && (
                <input
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  placeholder="Deskripsikan background..."
                  className="mt-2 w-full bg-[#1A1A1A] border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-[#666] mb-1.5">Pose</p>
              <Select value={pose} onValueChange={setPose}>
                <SelectTrigger className="bg-[#1A1A1A] border-[hsl(var(--border))] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[hsl(var(--border))]">
                  {poseOptions.map((o) => (
                    <SelectItem key={o} value={o} className="text-white">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-xs text-[#666] mb-1.5">Mood</p>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="bg-[#1A1A1A] border-[hsl(var(--border))] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[hsl(var(--border))]">
                  {moodOptions.map((o) => (
                    <SelectItem key={o} value={o} className="text-white">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Section 4: Prompt ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">
              Prompt
            </label>
            <button
              onClick={handleGeneratePrompt}
              disabled={promptLoading || !productImageUrl || !selectedCharacterId}
              className="inline-flex items-center gap-1.5 bg-[#1A1A1A] border border-primary text-primary text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {promptLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              GENERATE PROMPT
            </button>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="Prompt akan muncul di sini setelah klik Generate..."
            className="bg-[#1A1A1A] border-[hsl(var(--border))] text-white text-sm resize-y placeholder:text-[#555]"
          />
          <p className="text-xs text-[#555] mt-1.5">
            Edit prompt untuk hasil yang lebih baik
          </p>
        </div>

        {/* ── Section 5: Generate ── */}
        <div className="lg:pb-4">
          {/* Info card */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 mb-3">
            {tier === "free" ? (
              <div className="flex items-start gap-2">
                <Crown className="w-4 h-4 text-[#888] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Akan menggunakan 1 dari{" "}
                    <span className="text-primary font-bold">{imageCredits}</span> kredit
                  </p>
                  <p className="text-xs text-[#555] mt-0.5">Output dengan watermark</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Estimasi biaya: ~Rp 150-500 dari API key kamu
                  </p>
                  <p className="text-xs text-primary mt-0.5">Output tanpa watermark</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full bg-primary text-primary-foreground font-bold text-base py-3.5 rounded-lg uppercase tracking-wider hover:bg-[hsl(var(--lime-hover))] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Paintbrush className="w-5 h-5" />
            Generate Gambar
          </button>
        </div>
      </div>

      {/* ══════ RIGHT PANEL ══════ */}
      <div className="w-full lg:w-[45%] lg:h-screen lg:overflow-y-auto bg-[#0D0D0D] border-t lg:border-t-0 lg:border-l border-[hsl(var(--border))] flex items-center justify-center px-4 lg:px-8 py-8 lg:py-0">
        {/* State 1: Idle */}
        {generation.status === "idle" && (
          <div className="text-center space-y-4 max-w-xs">
            <ImageIcon className="w-16 h-16 text-[hsl(var(--muted-foreground))] opacity-20 mx-auto" />
            <div>
              <p className="text-lg text-[hsl(var(--muted-foreground))]">
                Hasil generasi akan muncul di sini
              </p>
              <p className="text-sm text-[#555] mt-1">
                Upload produk dan pilih karakter untuk mulai
              </p>
            </div>
          </div>
        )}

        {/* State 2: Loading */}
        {(generation.status === "pending" || generation.status === "processing") && (
          <div className="text-center space-y-5 w-full max-w-sm">
            <div className="aspect-[3/4] w-full max-w-[280px] mx-auto bg-[#1A1A1A] rounded-xl border-2 border-primary/30 animate-pulse" />
            <div>
              <p className="text-base text-white animate-pulse">
                Sedang membuat gambar...
              </p>
              <p className="text-xs text-[#555] mt-1">
                Estimasi: 30-60 detik • {generation.elapsedSeconds}s elapsed
              </p>
            </div>
            <button
              onClick={generation.cancel}
              className="text-xs text-[hsl(var(--muted-foreground))] underline hover:text-white transition"
            >
              Batal
            </button>
          </div>
        )}

        {/* State 3: Completed */}
        {generation.status === "completed" && generation.resultUrl && (
          <div className="w-full max-w-md space-y-4 animate-in fade-in duration-500">
            <div className="relative">
              <img
                src={generation.resultUrl}
                alt="Generated UGC"
                className="w-full rounded-xl border-2 border-primary/20 shadow-lg"
              />
              {tier === "free" && (
                <span className="absolute top-3 right-3 bg-[#2A2A2A]/80 text-[#888] text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                  FREE TRIAL
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleRegenerate}
                className="border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] px-4 py-2.5 rounded-lg flex items-center gap-2 hover:text-white hover:border-[#555] transition"
              >
                <RefreshCw className="w-4 h-4" />
                Ulang
              </button>
            </div>

            <div className="flex gap-4 text-xs text-[#555]">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Nano Banana Pro
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {generation.elapsedSeconds}s
              </span>
            </div>

            {tier === "free" && (
              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Upgrade untuk hasil tanpa watermark
                </p>
                <button
                  onClick={buyLifetime}
                  disabled={paymentProcessing}
                  className="inline-block mt-2 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentProcessing ? "MEMPROSES..." : "UPGRADE — Rp 249.000"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 4: Failed */}
        {generation.status === "failed" && (
          <div className="w-full max-w-sm">
            <div className="bg-[hsl(var(--destructive))]/5 border border-[hsl(var(--destructive))]/20 rounded-xl p-6 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-lg text-red-400">Generasi gagal</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {generation.error}
              </p>
              <button
                onClick={handleRegenerate}
                className="bg-primary text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
