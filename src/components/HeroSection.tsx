import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const placeholderGradients = [
  "from-purple-600 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-yellow-400",
  "from-green-500 to-emerald-400",
  "from-rose-500 to-red-400",
];

/* Floating particles config */
const particles = [
  { top: "18%", left: "8%", size: 6, delay: "0s", duration: "4s" },
  { top: "32%", right: "12%", size: 5, delay: "1.2s", duration: "5s" },
  { top: "65%", left: "15%", size: 4, delay: "0.6s", duration: "3.5s" },
  { top: "50%", right: "8%", size: 7, delay: "2s", duration: "4.5s" },
];

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(0 0% 4%) 0%, hsl(0 0% 2%) 100%)",
        }}
      />
      <div
        className="grid-pattern absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="hero-particle absolute rounded-full bg-primary/60 will-change-transform"
          style={{
            top: p.top,
            left: p.left,
            right: (p as any).right,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          aria-hidden="true"
        />
      ))}


      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="animate-fade-up mb-6 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles size={12} className="mr-1.5 inline" /> AI-POWERED UGC GENERATOR
        </div>

        {/* Headline with gradient text */}
        <h1
          className="animate-fade-up font-satoshi max-w-[800px] text-[32px] font-bold uppercase leading-[1.1] tracking-[0.05em] sm:text-[44px] lg:text-[56px]"
          style={{
            animationDelay: "0.2s",
            background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 63%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BIKIN KONTEN UGC REALISTIS DALAM 30 DETIK
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up mt-6 max-w-[600px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Upload foto produk. Pilih karakter Indonesia. Generate gambar UGC berkualitas tinggi untuk TikTok & Instagram — tanpa model, tanpa studio.
        </p>

        {/* Buttons */}
        <div
          className="animate-fade-up mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          style={{ animationDelay: "0.4s" }}
        >
          <a
            href="#harga"
            aria-label="Mulai gratis - lihat harga"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-200 hover:-translate-y-px hover:bg-lime-hover sm:w-auto"
          >
            MULAI GRATIS →
          </a>
          <a
            href="#cara-kerja"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-foreground/20 bg-transparent px-8 text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:bg-foreground/5 sm:w-auto"
          >
            LIHAT DEMO ▶
          </a>
        </div>

        {/* Trust text */}
        <p
          className="animate-fade-up mt-6 text-xs text-[hsl(var(--text-muted))]"
          style={{ animationDelay: "0.5s" }}
        >
          Gratis 3 kredit • Tanpa kartu kredit • Setup 30 detik
        </p>
      </div>

      {/* Marquee */}
      <div
        className="animate-fade-slide-right relative z-10 mt-12 w-full overflow-hidden sm:mt-16"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="animate-marquee flex w-max gap-4">
          {[...placeholderGradients, ...placeholderGradients].map((gradient, i) => (
            <div
              key={i}
              className={`h-[280px] w-[200px] flex-shrink-0 rounded-xl bg-gradient-to-br ${gradient} border border-border opacity-80`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
