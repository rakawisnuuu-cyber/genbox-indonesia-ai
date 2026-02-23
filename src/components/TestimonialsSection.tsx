import { useEffect, useRef, useState } from "react";
import { Star, Sparkles, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Gila sih, foto produk skincare aku jadi kelihatan kayak difoto sama fotografer profesional. Padahal cuma upload foto biasa!",
    name: "Rina S.",
    role: "Affiliate Marketer TikTok Shop",
  },
  {
    quote:
      "Sebelumnya hire model Rp 500rb per sesi. Sekarang pakai GENBOX, satu bulan cuma Rp 49rb dan hasilnya gak kalah.",
    name: "Budi P.",
    role: "Seller Shopee",
  },
  {
    quote:
      "BYOK fiturnya game changer. Aku pakai API sendiri, generate unlimited, untungnya makin gede.",
    name: "Dimas K.",
    role: "Dropshipper",
  },
];

const TestimonialsSection = () => {
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
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
    <section ref={ref} id="testimonial" className="relative w-full overflow-hidden px-4 py-12 sm:py-16">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-40 bottom-20 h-[400px] w-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(73 100% 50%) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`mb-14 flex flex-col items-center text-center ${visible ? "animate-fade-up" : "opacity-0"}`}
        >
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles size={12} className="mr-1.5 inline" /> TESTIMONIAL
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px]">
            APA KATA PENGGUNA GENBOX
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-xl border border-border bg-card p-6 ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <Quote size={32} className="text-primary/30" aria-hidden="true" />
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                {t.quote}
              </p>
              <div className="mt-5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-satoshi text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile horizontal snap scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className={`scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.15s" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-[85vw] flex-shrink-0 snap-center rounded-xl border border-border bg-card p-6"
              >
                <Quote size={32} className="text-primary/30" aria-hidden="true" />
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </p>
                <div className="mt-5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-primary text-primary"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <p className="font-satoshi text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${i === activeIdx ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
