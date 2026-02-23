import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

// ── Provider config ──
const providerColors: Record<string, { dot: string; text: string }> = {
  GOOGLE: { dot: "bg-green-400", text: "text-green-400" },
  OPENAI: { dot: "bg-white", text: "text-white" },
  BYTEDANCE: { dot: "bg-blue-400", text: "text-blue-400" },
  "BLACK FOREST LABS": { dot: "bg-purple-400", text: "text-purple-400" },
  KLING: { dot: "bg-orange-400", text: "text-orange-400" },
  RUNWAY: { dot: "bg-pink-400", text: "text-pink-400" },
  HAILUO: { dot: "bg-cyan-400", text: "text-cyan-400" },
  WAN: { dot: "bg-yellow-400", text: "text-yellow-400" },
  SORA: { dot: "bg-red-400", text: "text-red-400" },
  XAI: { dot: "bg-gray-300", text: "text-gray-300" },
  TOPAZ: { dot: "bg-amber-400", text: "text-amber-400" },
  RECRAFT: { dot: "bg-teal-400", text: "text-teal-400" },
  IDEOGRAM: { dot: "bg-indigo-400", text: "text-indigo-400" },
  QWEN: { dot: "bg-sky-400", text: "text-sky-400" },
  SUNO: { dot: "bg-fuchsia-400", text: "text-fuchsia-400" },
  ELEVENLABS: { dot: "bg-violet-400", text: "text-violet-400" },
  ANTHROPIC: { dot: "bg-orange-300", text: "text-orange-300" },
  INFINITALK: { dot: "bg-emerald-400", text: "text-emerald-400" },
};

const typeBadge: Record<string, string> = {
  IMAGE: "bg-blue-500/20 text-blue-400",
  VIDEO: "bg-red-500/20 text-red-400",
  PROMPT: "bg-purple-500/20 text-purple-400",
  MUSIC: "bg-fuchsia-500/20 text-fuchsia-400",
};

type ModelRow = {
  name: string;
  provider: string;
  type: string;
  credits: string;
  price: string;
  discount?: string;
  note?: string;
  free?: boolean;
};

const models: ModelRow[] = [
  // IMAGE
  { name: "Nano Banana (Gemini 2.5 Flash Image)", provider: "GOOGLE", type: "IMAGE", credits: "4", price: "$0.02 / image (~Rp 320)" },
  { name: "Nano Banana Pro (Gemini 3.0 Pro Image)", provider: "GOOGLE", type: "IMAGE", credits: "8", price: "$0.04 / image (~Rp 640)", note: "Native 4K output" },
  { name: "Seedream 4.0", provider: "BYTEDANCE", type: "IMAGE", credits: "3.5", price: "$0.0175 / image (~Rp 280)", discount: "-50%" },
  { name: "Seedream 5.0 Preview", provider: "BYTEDANCE", type: "IMAGE", credits: "5", price: "$0.025 / image (~Rp 400)", note: "Web search + reasoning" },
  { name: "Z-Image", provider: "BYTEDANCE", type: "IMAGE", credits: "~4", price: "~$0.02 / image (~Rp 320)" },
  { name: "4o Image API (GPT-Image-1)", provider: "OPENAI", type: "IMAGE", credits: "10", price: "$0.05 / image (~Rp 800)" },
  { name: "GPT-Image-1.5", provider: "OPENAI", type: "IMAGE", credits: "12", price: "$0.06 / image (~Rp 960)" },
  { name: "Flux.1 Kontext", provider: "BLACK FOREST LABS", type: "IMAGE", credits: "6", price: "$0.03 / image (~Rp 480)" },
  { name: "Flux-2", provider: "BLACK FOREST LABS", type: "IMAGE", credits: "5", price: "$0.025 / image (~Rp 400)" },
  { name: "Grok Imagine", provider: "XAI", type: "IMAGE", credits: "~5", price: "~$0.025 / image (~Rp 400)" },
  { name: "Topaz Image", provider: "TOPAZ", type: "IMAGE", credits: "~5", price: "~$0.025 / image (~Rp 400)" },
  { name: "Recraft", provider: "RECRAFT", type: "IMAGE", credits: "~5", price: "~$0.025 / image (~Rp 400)" },
  { name: "Ideogram", provider: "IDEOGRAM", type: "IMAGE", credits: "~5", price: "~$0.025 / image (~Rp 400)" },
  { name: "Qwen Image", provider: "QWEN", type: "IMAGE", credits: "~4", price: "~$0.02 / image (~Rp 320)", note: "Best for text rendering" },
  // VIDEO
  { name: "Veo 3.1 / Veo 3.1 Fast (8s, with audio)", provider: "GOOGLE", type: "VIDEO", credits: "60", price: "$0.30 / video (~Rp 4.800)", discount: "-70%", note: "Latest — synced audio, 1080p" },
  { name: "Veo 3 Quality (8s, with audio)", provider: "GOOGLE", type: "VIDEO", credits: "250", price: "$1.25 / video (~Rp 20.000)" },
  { name: "Veo 3 Fallback (8s)", provider: "GOOGLE", type: "VIDEO", credits: "100", price: "$0.50 / video (~Rp 8.000)" },
  { name: "Kling 2.1 Standard (5s)", provider: "KLING", type: "VIDEO", credits: "~28", price: "~$0.14 / video (~Rp 2.240)" },
  { name: "Kling 2.1 Pro (5s)", provider: "KLING", type: "VIDEO", credits: "~56", price: "~$0.28 / video (~Rp 4.480)" },
  { name: "Kling 2.1 Master (5s)", provider: "KLING", type: "VIDEO", credits: "~100", price: "~$0.50 / video (~Rp 8.000)" },
  { name: "Seedance 1.5 Pro (12s, 720p, with audio)", provider: "BYTEDANCE", type: "VIDEO", credits: "84", price: "$0.42 / video (~Rp 6.720)", discount: "-32%" },
  { name: "Seedance 1.5 Pro (12s, 720p, no audio)", provider: "BYTEDANCE", type: "VIDEO", credits: "42", price: "$0.21 / video (~Rp 3.360)", discount: "-32%" },
  { name: "Seedance 1.5 Pro (8s, 720p, with audio)", provider: "BYTEDANCE", type: "VIDEO", credits: "56", price: "$0.28 / video (~Rp 4.480)", discount: "-32%" },
  { name: "Seedance 1.5 Pro (4s, 720p, with audio)", provider: "BYTEDANCE", type: "VIDEO", credits: "28", price: "$0.14 / video (~Rp 2.240)", discount: "-33%" },
  { name: "Hailuo (MiniMax)", provider: "HAILUO", type: "VIDEO", credits: "~50", price: "~$0.25 / video (~Rp 4.000)" },
  { name: "Wan 2.1 (5s)", provider: "WAN", type: "VIDEO", credits: "~30", price: "~$0.15 / video (~Rp 2.400)" },
  { name: "Sora 2", provider: "OPENAI", type: "VIDEO", credits: "~200", price: "~$1.00 / video (~Rp 16.000)", discount: "-60%" },
  { name: "Runway Gen-4 Turbo", provider: "RUNWAY", type: "VIDEO", credits: "~100", price: "~$0.50 / video (~Rp 8.000)" },
  { name: "Runway Aleph", provider: "RUNWAY", type: "VIDEO", credits: "~200", price: "~$1.00 / video (~Rp 16.000)", note: "Multi-task: relighting, removal, style" },
  { name: "Topaz Video", provider: "TOPAZ", type: "VIDEO", credits: "~40", price: "~$0.20 / video (~Rp 3.200)" },
  { name: "Infinitalk", provider: "INFINITALK", type: "VIDEO", credits: "~30", price: "~$0.15 / video (~Rp 2.400)", note: "Talking head video" },
  // MUSIC
  { name: "Suno V4.5 Plus", provider: "SUNO", type: "MUSIC", credits: "~20", price: "~$0.10 / track (~Rp 1.600)", note: "Up to 8 min, vocals + instrumentals" },
  { name: "ElevenLabs TTS", provider: "ELEVENLABS", type: "MUSIC", credits: "~5", price: "~$0.025 / clip (~Rp 400)", note: "Text-to-speech, voice cloning" },
  // PROMPT
  { name: "Gemini 2.0 Flash", provider: "GOOGLE", type: "PROMPT", credits: "0", price: "FREE", free: true, note: "Recommended for GENBOX prompts" },
  { name: "Gemini 1.5 Pro", provider: "GOOGLE", type: "PROMPT", credits: "~0.2", price: "~$0.001 / prompt (~Rp 16)" },
  { name: "GPT-4o", provider: "OPENAI", type: "PROMPT", credits: "~1", price: "~$0.005 / prompt (~Rp 80)" },
  { name: "Claude Sonnet", provider: "ANTHROPIC", type: "PROMPT", credits: "~2", price: "~$0.01 / prompt (~Rp 160)" },
];

const tabs = ["ALL", "IMAGE", "VIDEO", "MUSIC", "PROMPT"] as const;

// ── Cost simulator ──
const scenarios = [
  {
    title: "Pemula",
    desc: "50 gambar + 5 video / bulan",
    usage: "Pakai: Seedream 4.0 + Kling Standard",
    calc: "(50 × Rp 280) + (5 × Rp 2.240)",
    total: 25200,
    compare: "vs. hire fotografer: ",
    compareOld: "Rp 500.000+",
  },
  {
    title: "Aktif",
    desc: "200 gambar + 20 video / bulan",
    usage: "Pakai: Nano Banana + Seedance 4s",
    calc: "(200 × Rp 320) + (20 × Rp 2.240)",
    total: 108800,
    compare: "vs. content agency: ",
    compareOld: "Rp 3.000.000+",
  },
  {
    title: "Power User",
    desc: "500 gambar + 50 video / bulan",
    usage: "Pakai: Seedream 4.0 + Veo 3.1 Fast",
    calc: "(500 × Rp 280) + (50 × Rp 4.800)",
    total: 380000,
    compare: "vs. full production: ",
    compareOld: "Rp 10.000.000+",
  },
];

// ── Counter hook ──
function useCountUp(target: number, duration = 1000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

// ── Provider badge ──
const ProviderBadge = ({ name }: { name: string }) => {
  const c = providerColors[name] ?? { dot: "bg-gray-400", text: "text-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.text}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
      {name}
    </span>
  );
};

const ApiCostSection = () => {
  const [visible, setVisible] = useState(false);
  const [simVisible, setSimVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const ref = useRef<HTMLDivElement>(null);
  const simRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSimVisible(true); }, { threshold: 0.15 });
    if (simRef.current) obs.observe(simRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = activeTab === "ALL" ? models : models.filter((m) => m.type === activeTab);

  return (
    <section ref={ref} id="api-cost" className="relative w-full overflow-hidden px-4 py-16 sm:py-20">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(73 100% 50%) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="container mx-auto max-w-6xl">
        {/* ── Header ── */}
        <div className={`mb-10 flex flex-col items-center text-center ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles size={12} className="mr-1.5 inline" /> BIAYA API TRANSPARAN
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px]">
            KAMU YANG KONTROL BIAYA
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sebagai pengguna BYOK, kamu bayar langsung ke provider via Kie.ai.
            1 credit = $0.005. Ini semua model yang tersedia.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className={`scrollbar-none mb-6 flex gap-2 overflow-x-auto ${visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === t
                  ? "bg-primary text-primary-foreground scale-105"
                  : "border border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className={`rounded-xl border border-border overflow-hidden ${visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.15s", background: "hsl(0 0% 8%)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr style={{ background: "hsl(0 0% 10%)" }}>
                  {["MODEL NAME", "PROVIDER", "TYPE", "CREDITS", "WHOLESALE PRICE"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "hsl(0 0% 40%)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr
                    key={m.name}
                    className="border-b border-border transition-colors hover:bg-secondary/60"
                    style={{
                      background: i % 2 === 0 ? "hsl(0 0% 8%)" : "hsl(0 0% 6.7%)",
                      animationDelay: visible ? `${0.2 + i * 0.03}s` : undefined,
                    }}
                  >
                    {/* Model name */}
                    <td className="px-4 py-3 font-medium text-foreground text-[13px] sm:text-sm min-w-[200px] sticky left-0 z-10" style={{ background: "inherit" }}>
                      <span>{m.name}</span>
                      {m.discount && (
                        <span className="ml-2 inline-block rounded-full bg-red-500/20 px-2 text-[10px] font-bold text-red-400">
                          {m.discount}
                        </span>
                      )}
                      {m.note && <span className="block text-[11px] text-muted-foreground mt-0.5">{m.note}</span>}
                    </td>
                    {/* Provider */}
                    <td className="px-4 py-3">
                      <ProviderBadge name={m.provider} />
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeBadge[m.type] ?? ""}`}>
                        {m.type}
                      </span>
                    </td>
                    {/* Credits */}
                    <td className="px-4 py-3 text-muted-foreground">{m.credits}</td>
                    {/* Price */}
                    <td className={`px-4 py-3 ${m.free ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      {m.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3" style={{ background: "hsl(0 0% 10%)" }}>
            <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "hsl(0 0% 40%)" }}>
              {filtered.length}+ MODELS LOADED
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-green-400">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse-subtle" />
              LIVE API FEED
            </span>
          </div>
        </div>

        {/* ── Cost Simulator ── */}
        <div ref={simRef} className="mx-auto mt-10 max-w-4xl rounded-xl border border-border p-6" style={{ background: "hsl(0 0% 8%)" }}>
          <h3 className="mb-6 text-center font-satoshi text-base font-bold text-foreground sm:text-lg">
            💡 SIMULASI BIAYA BULANAN
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {scenarios.map((s, i) => (
              <SimCard key={s.title} scenario={s} index={i} visible={simVisible} />
            ))}
          </div>
          <p className="mt-5 text-center text-[11px] leading-relaxed" style={{ color: "hsl(0 0% 40%)" }}>
            * Harga berdasarkan Kie.ai credit rate $0.005/credit. Kurs Rp 16.000/$. Harga dapat berubah sesuai provider. Gemini Flash untuk prompt gratis.
          </p>
        </div>
      </div>
    </section>
  );
};

// ── Sim card ──
const SimCard = ({ scenario, index, visible }: { scenario: typeof scenarios[0]; index: number; visible: boolean }) => {
  const count = useCountUp(scenario.total, 1000, visible);
  const formatted = "Rp " + count.toLocaleString("id-ID");

  return (
    <div
      className={`rounded-lg border border-border p-5 transition-all ${visible ? "animate-fade-up" : "opacity-0"}`}
      style={{ background: "hsl(0 0% 10%)", animationDelay: `${0.1 + index * 0.15}s` }}
    >
      <p className="font-satoshi text-sm font-bold text-foreground">{scenario.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{scenario.desc}</p>
      <p className="text-[11px] text-muted-foreground">{scenario.usage}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{scenario.calc}</p>
      <p className="mt-1 text-lg font-bold text-primary sm:text-xl">= {formatted}/bulan</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {scenario.compare}
        <span className="line-through">{scenario.compareOld}</span>
      </p>
    </div>
  );
};

export default ApiCostSection;
