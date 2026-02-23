import { useEffect, useRef, useState } from "react";
import { Check, X, ArrowRight, Lock, Zap, Infinity } from "lucide-react";

const freeFeatures = [
  { text: "3 kredit gambar", included: true },
  { text: "Karakter preset dasar", included: true },
  { text: "Prompt generator", included: true },
  { text: "Output dengan watermark", included: false },
  { text: "Tanpa video generation", included: false },
  { text: "Tanpa n8n blueprint", included: false },
];

const byokFeatures = [
  "Unlimited image generation",
  "Unlimited video generation",
  "10+ karakter Indonesia + kustomisasi",
  "Output tanpa watermark",
  "AI Prompt Generator",
  "Custom n8n automation blueprint",
  "Setup guide lengkap",
  "Lifetime updates",
  "WhatsApp support group",
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
    <section ref={ref} className="relative w-full px-4 py-20 sm:py-28">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className={`mb-16 flex flex-col items-center text-center sm:mb-20 ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            ✦ HARGA
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] lg:leading-tight">
            SATU KALI BAYAR. SELAMANYA MILIKMU.
          </h2>
          <p className="mt-4 max-w-[460px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tanpa langganan bulanan. Tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start md:gap-6">
          {/* Free Card */}
          <div
            className={`flex-1 rounded-xl border border-border bg-card p-8 ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="font-satoshi text-xl font-bold text-foreground">COBA GRATIS</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-satoshi text-[32px] font-bold text-foreground">Rp 0</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">untuk memulai</p>

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

            <button className="mt-8 w-full rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/80">
              Coba Gratis
            </button>
          </div>

          {/* BYOK Card */}
          <div
            className={`relative flex-1 md:flex-[1.15] ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.15s" }}
          >
            {/* Best Value ribbon */}
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
                Best Value ✦
              </span>
            </div>

            <div className="animate-float rounded-xl border-2 border-primary bg-card p-8 shadow-[0_0_40px_-5px_hsl(var(--primary)/0.12)]">
              <h3 className="font-satoshi text-xl font-bold text-foreground">BYOK LIFETIME</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-satoshi text-[32px] font-bold text-foreground sm:text-[40px]">Rp 249.000</span>
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
                <p className="text-[13px] font-semibold text-foreground">🎁 BONUS: n8n Automation Blueprint (senilai Rp 500.000)</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Template workflow AI untuk auto-generate konten UGC dari katalog produk
                </p>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5">
                Beli Sekarang <ArrowRight size={16} />
              </button>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Pembayaran via QRIS, GoPay, OVO, Dana, Transfer Bank
              </p>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">
                ⚡ Biaya API kamu sendiri: ~Rp 150-500/gambar
              </p>
            </div>
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
