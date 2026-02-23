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
      className="relative w-full px-4 py-24"
      style={{ background: "radial-gradient(ellipse at center, hsla(73,100%,50%,0.03) 0%, transparent 70%)" }}
    >
      <div className="container mx-auto max-w-[700px] text-center">
        <h2
          className={`font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-tight ${visible ? "animate-fade-up" : "opacity-0"}`}
        >
          SIAP BIKIN KONTEN UGC PERTAMAMU?
        </h2>
        <p
          className={`mx-auto mt-5 max-w-[520px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.1s" }}
        >
          Sekali bayar, akses selamanya. Join affiliate marketer Indonesia yang sudah pakai GENBOX.
        </p>

        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <button className="animate-cta-glow flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5">
            Beli Sekarang — Rp 249.000 <ArrowRight size={16} />
          </button>
          <button className="rounded-lg border border-border bg-transparent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary">
            Coba Gratis Dulu
          </button>
        </div>

        <p
          className={`mt-6 text-xs text-muted-foreground ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.3s" }}
        >
          Gratis 3 kredit • Tanpa kartu kredit • Lifetime access
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
