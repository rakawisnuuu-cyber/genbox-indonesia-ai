import { useEffect, useRef, useState } from "react";
import { Package, User, Zap, ShoppingBag, Shirt, UtensilsCrossed, Sparkles } from "lucide-react";

const pairs = [
  {
    category: "Skincare",
    icon: Package,
    gradientTo: "to-purple-900/30",
  },
  {
    category: "Fashion",
    icon: ShoppingBag,
    gradientTo: "to-indigo-900/30",
  },
  {
    category: "Makanan",
    icon: UtensilsCrossed,
    gradientTo: "to-rose-900/30",
  },
];

const HasilNyataSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIdx(idx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden px-4 py-12 sm:py-16"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(73 100% 50%) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="container mx-auto max-w-[1200px]">
        {/* Header */}
        <div className={`mb-16 flex flex-col items-center text-center sm:mb-20 ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles size={12} className="mr-1.5 inline" /> HASIL NYATA
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-tight max-w-3xl">
            DARI FOTO PRODUK BIASA KE KONTEN UGC PREMIUM
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6">
          {pairs.map((pair, i) => (
            <PairCard key={i} pair={pair} index={i} visible={visible} />
          ))}
        </div>

        {/* Mobile snap scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {pairs.map((pair, i) => (
              <div key={i} className="w-full flex-shrink-0 snap-center" style={{ minWidth: "85%" }}>
                <PairCard pair={pair} index={i} visible={visible} />
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {pairs.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIdx ? "w-6 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PairCard = ({
  pair,
  index,
  visible,
}: {
  pair: (typeof pairs)[number];
  index: number;
  visible: boolean;
}) => {
  const Icon = pair.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)] ${
        visible ? "animate-fade-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${0.15 + index * 0.12}s` }}
    >
      {/* Before / After panels */}
      <div className="relative flex h-[200px]">
        {/* Before */}
        <div className="flex flex-1 flex-col items-center justify-center bg-secondary/50">
          <span className="absolute left-3 top-3 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-400">
            Sebelum
          </span>
          <Icon size={40} className="text-muted-foreground/40" strokeWidth={1.2} />
        </div>

        {/* Divider with icon */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-background animate-pulse-subtle">
            <Zap size={16} className="text-primary" />
          </div>
        </div>
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />

        {/* After */}
        <div className={`flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-secondary/50 ${pair.gradientTo}`}>
          <span className="absolute right-3 top-3 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Sesudah
          </span>
          <div className="relative">
            <User size={36} className="text-foreground/30" strokeWidth={1.2} />
            <div className="absolute -bottom-1 -right-2">
              <Icon size={16} className="text-primary/60" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Category label */}
      <div className="border-t border-border px-4 py-3 text-center">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {pair.category}
        </span>
      </div>
    </div>
  );
};

export default HasilNyataSection;
