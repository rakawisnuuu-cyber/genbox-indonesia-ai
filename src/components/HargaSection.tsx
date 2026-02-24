import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Lock, Zap, Infinity, Gift, Sparkles } from "lucide-react";

const freeFeatures = [
  { text: "3 kredit gambar gratis", included: true },
  { text: "Karakter preset dasar", included: true },
  { text: "Prompt generator", included: true },
  { text: "Output masih ada watermark", included: false },
  { text: "Belum bisa generate video", included: false },
  { text: "Belum termasuk n8n blueprint", included: false },
];

const byokFeatures = [
  "Generate gambar unlimited sepuasnya",
  "Generate video unlimited sepuasnya",
  "10+ karakter + bisa kustomisasi",
  "Output bersih tanpa watermark",
  "AI Prompt Generator otomatis",
  "n8n automation blueprint siap pakai",
  "Setup guide lengkap step-by-step",
  "Update fitur selamanya",
  "Gabung WhatsApp support group",
];

const HargaSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="harga" className="relative w-full px-4 py-12 sm:py-16">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className={`mb-16 flex flex-col items-center text-center sm:mb-20 ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <Sparkles size={12} className="mr-1.5 inline" /> HARGA
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-tight">
            SATU KALI BAYAR. SELAMANYA MILIKMU.
          </h2>
          <p className="mt-4 max-w-[460px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tanpa langganan bulanan. Tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
          {/* BYOK Card (first on mobile) */}
          <div
            className={`relative flex-1 md:flex-[1.15] md:order-2 ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.15s" }}
          >
            {/* Best Value ribbon */}
            <div className="mb-3 flex justify-center">
              <span className="animate-shimmer inline-flex items-center rounded-full bg-primary px-5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_0_20px_-3px_hsl(var(--primary)/0.4)]">
                PALING WORTH IT <Sparkles size={12} className="ml-1.5 inline" />
              </span>
            </div>

            <div className="rounded-xl border-2 border-primary bg-card p-8 shadow-[0_0_30px_rgba(191,255,0,0.15)] transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(191,255,0,0.25)] scale-[1.02]">
              <h3 className="font-satoshi text-xl font-bold text-foreground">BYOK LIFETIME</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-satoshi text-[44px] font-bold text-foreground sm:text-[56px]">Rp 249.000</span>
              </div>
              <p className="mt-1 text-sm font-bold text-primary">sekali bayar • akses selamanya</p>

              <ul className="mt-6 space-y-3">
                {byokFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check size={15} className="shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Bonus box */}
              <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground"><Gift size={14} className="shrink-0 text-primary" /> BONUS: n8n Automation Blueprint (worth Rp 500.000)</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Template workflow AI buat auto-generate konten UGC dari katalog produk kamu
                </p>
              </div>

              <Link to="/register" className="animate-cta-glow mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5">
                GENERATE SEKARANG <ArrowRight size={16} />
              </Link>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Pembayaran via QRIS, GoPay, OVO, Dana, Transfer Bank
              </p>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">
                <Zap size={11} className="mr-0.5 inline text-primary" /> Biaya API kamu sendiri: cuma ~Rp 150-500/gambar
              </p>
            </div>
          </div>

          {/* Free Card */}
          <div
            className={`flex-1 rounded-xl border border-border bg-card p-8 opacity-90 md:order-1 ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="font-satoshi text-xl font-bold text-foreground">COBA DULU GRATIS</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-satoshi text-[32px] font-bold text-foreground">Rp 0</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">buat nyoba langsung</p>

            <ul className="mt-6 space-y-3">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <Check size={15} className="shrink-0 text-primary" />
                  ) : (
                    <X size={15} className="shrink-0 text-muted-foreground/50" />
                  )}
                  <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/50"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/register" className="mt-8 block w-full rounded-lg border border-border bg-secondary px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/80">
              MULAI GRATIS
            </Link>
          </div>

        </div>

        {/* Trust row */}
        <div
          className={`mt-12 flex flex-wrap items-center justify-center gap-6 text-[12px] text-muted-foreground ${visible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "0.4s" }}
        >
          <span className="flex items-center gap-1.5"><Lock size={13} /> Pembayaran Aman</span>
          <span className="flex items-center gap-1.5"><Zap size={13} /> Akses Instant</span>
          <span className="flex items-center gap-1.5"><Infinity size={13} /> Lifetime Updates</span>
        </div>
      </div>
    </section>
  );
};

export default HargaSection;
