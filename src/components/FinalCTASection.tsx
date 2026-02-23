import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden px-4 py-24 sm:py-32"
      style={{ background: "radial-gradient(ellipse at center, hsla(73,100%,50%,0.04) 0%, transparent 70%)" }}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(73 100% 50%) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="container mx-auto max-w-[700px] text-center">
        <h2
          className={`font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-tight ${visible ? "animate-fade-up" : "opacity-0"}`}
        >
          SIAP BIKIN KONTEN UGC YANG BIKIN CUAN?
        </h2>
        <p
          className={`mx-auto mt-5 max-w-[520px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.1s" }}
        >
          Sekali bayar, akses selamanya. Gabung bareng ribuan affiliate marketer Indonesia yang udah pakai GENBOX.
        </p>

        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <button aria-label="Beli sekarang seharga Rp 249.000" className="animate-cta-glow flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 sm:w-auto">
            GENERATE SEKARANG — Rp 249.000 <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button aria-label="Coba gratis tanpa kartu kredit" className="w-full rounded-lg border border-border bg-transparent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary sm:w-auto">
            COBA GRATIS DULU
          </button>
        </div>

        <p
          className={`mt-6 text-xs text-muted-foreground ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.3s" }}
        >
          Gratis 3 kredit • Tanpa kartu kredit • Akses selamanya
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
