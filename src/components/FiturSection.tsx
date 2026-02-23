import { useEffect, useRef, useState } from "react";
import { Play, Send, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock UI visuals for each feature                                   */
/* ------------------------------------------------------------------ */

const CharacterBuilderMock = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-primary" />
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Character Selection
      </span>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        { color: "from-pink-500 to-rose-400", label: "Hijab Casual" },
        { color: "from-violet-500 to-purple-400", label: "Urban Trendy" },
        { color: "from-amber-500 to-orange-400", label: "Ibu Muda" },
        { color: "from-cyan-500 to-teal-400", label: "Mahasiswa" },
        { color: "from-emerald-500 to-green-400", label: "Profesional" },
        { color: "from-sky-500 to-blue-400", label: "Gen-Z Style" },
      ].map((c) => (
        <div key={c.label} className="flex flex-col items-center gap-1.5">
          <div
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${c.color} ring-2 ring-transparent transition-all hover:ring-primary/60`}
          />
          <span className="text-[10px] leading-tight text-muted-foreground">
            {c.label}
          </span>
        </div>
      ))}
    </div>
    <div className="mt-4 flex justify-end">
      <div className="rounded-lg bg-primary/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        Pilih Karakter →
      </div>
    </div>
  </div>
);

const GeneratorMock = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-primary" />
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        UGC Generator
      </span>
    </div>
    <div className="flex gap-3">
      {/* Before */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border border-dashed border-border bg-background">
          <span className="text-xs text-muted-foreground">Produk</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Input</span>
      </div>
      {/* Arrow */}
      <div className="flex items-center text-primary">
        <Sparkles size={18} />
      </div>
      {/* After */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <span className="text-xs text-primary">UGC</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Output</span>
      </div>
    </div>
    <button className="mt-4 w-full rounded-lg bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
      Generate →
    </button>
  </div>
);

const VideoMock = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-primary" />
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Video Creator
      </span>
    </div>
    <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br from-card to-background border border-border">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform hover:scale-110">
        <Play size={20} fill="currentColor" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div className="h-1 w-full rounded-full bg-border">
          <div className="h-1 w-2/5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
      <span>00:05 / 00:15</span>
      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-primary">
        Reels Ready
      </span>
    </div>
  </div>
);

const PromptMock = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-primary" />
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Prompt AI
      </span>
    </div>
    {/* User message */}
    <div className="mb-3 ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-primary/10 border border-primary/20 px-3 py-2">
      <p className="text-xs text-foreground">
        "Serum wajah, botol kaca, di meja kayu"
      </p>
    </div>
    {/* AI response */}
    <div className="mb-4 mr-auto max-w-[85%] rounded-xl rounded-bl-sm bg-background border border-border px-3 py-2">
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Professional UGC photo of Indonesian woman holding glass serum bottle, wooden table, warm natural light, iPhone quality...
      </p>
    </div>
    {/* Input */}
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <span className="flex-1 text-xs text-muted-foreground/50">
        Deskripsikan produk kamu...
      </span>
      <Send size={14} className="text-primary" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */

const features = [
  {
    num: "01",
    title: "BUAT KARAKTER UNIK",
    desc: "Pilih dari 10+ karakter Indonesia — hijab casual, urban trendy, ibu muda, dan lainnya. Kustomisasi sesuai target market kamu.",
    visual: <CharacterBuilderMock />,
    reversed: false,
  },
  {
    num: "02",
    title: "GENERATE GAMBAR UGC REALISTIS",
    desc: "Upload foto produk, pilih karakter dan pose. AI generate gambar seolah difoto oleh orang sungguhan. Hyper-realistic, shot-on-iPhone quality.",
    visual: <GeneratorMock />,
    reversed: true,
  },
  {
    num: "03",
    title: "UBAH GAMBAR JADI VIDEO",
    desc: "Animasikan gambar UGC jadi video 5-15 detik. Siap posting ke TikTok dan Instagram Reels.",
    visual: <VideoMock />,
    reversed: false,
  },
  {
    num: "04",
    title: "AI PROMPT GENERATOR",
    desc: "Deskripsikan produk dalam Bahasa Indonesia, AI optimasi prompt untuk hasil terbaik. Tanpa perlu belajar prompt engineering.",
    visual: <PromptMock />,
    reversed: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Single feature row with scroll animation                           */
/* ------------------------------------------------------------------ */

const FeatureRow = ({
  num,
  title,
  desc,
  visual,
  reversed,
}: (typeof features)[0]) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-center ${
        reversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Text */}
      <div
        className={`flex-1 ${visible ? "animate-fade-up" : "opacity-0"}`}
        style={{ animationDelay: "0.1s" }}
      >
        <span className="font-mono text-[48px] font-bold leading-none text-primary">
          {num}
        </span>
        <h3 className="mt-4 font-satoshi text-xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md font-body text-base leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>

      {/* Visual */}
      <div
        className={`flex-1 ${visible ? "animate-fade-up" : "opacity-0"}`}
        style={{ animationDelay: "0.25s" }}
      >
        {visual}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

const FiturSection = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-background px-4 py-20 sm:py-28">
      <div className="container mx-auto max-w-[1200px]">
        {/* Section header */}
        <div
          ref={headerRef}
          className={`mb-16 flex flex-col items-center text-center sm:mb-24 ${
            headerVisible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            ✦ FITUR UTAMA
          </span>
          <h2 className="max-w-[700px] font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-[1.15]">
            SEMUA YANG KAMU BUTUHKAN UNTUK KONTEN UGC
          </h2>
        </div>

        {/* Feature rows */}
        <div className="flex flex-col gap-20 sm:gap-28">
          {features.map((f) => (
            <FeatureRow key={f.num} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiturSection;
