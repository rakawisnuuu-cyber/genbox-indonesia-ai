import { useEffect, useRef, useState } from "react";
import { Upload, ImagePlus, Users, Download, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Upload Foto Produk",
    desc: "Drag & drop foto produk kamu. AI otomatis deteksi jenis produk.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-background">
          <Upload size={24} className="text-primary" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center">
              <ImagePlus size={12} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Pilih Karakter & Scene",
    desc: "Pilih karakter Indonesia dan pose yang sesuai target market kamu.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            "from-pink-500 to-rose-400",
            "from-violet-500 to-purple-400",
            "from-amber-500 to-orange-400",
            "from-cyan-500 to-teal-400",
            "from-emerald-500 to-green-400",
            "from-sky-500 to-blue-400",
          ].map((g, i) => (
            <div
              key={i}
              className={`h-7 w-7 rounded-full bg-gradient-to-br ${g} ${i === 1 ? "ring-2 ring-primary" : "ring-1 ring-border"}`}
            />
          ))}
        </div>
        <Users size={16} className="text-muted-foreground" />
      </div>
    ),
  },
  {
    num: "03",
    title: "Generate & Download",
    desc: "Klik generate, tunggu 20 detik, download hasilnya. Selesai!",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-16 w-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <Download size={12} />
          Download
        </div>
      </div>
    ),
  },
];

const CaraKerjaSection = () => {
  const [visible, setVisible] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setTimeout(() => setLineVisible(true), 400);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full px-4 py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 5%) 100%)" }}
    >
      <div className="container mx-auto max-w-[1200px]">
        {/* Header */}
        <div className={`mb-16 flex flex-col items-center text-center sm:mb-20 ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            ✦ CARA KERJA
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px]">
            3 LANGKAH MUDAH
          </h2>
          <p className="mt-4 max-w-[500px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            Dari foto produk ke konten UGC dalam hitungan detik
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-6">
          {/* Desktop connecting lines */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute top-[72px] hidden md:block"
              style={{
                left: `calc(${(i + 1) * 33.33}% - 12px)`,
                width: "calc(33.33% - 40px)",
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="h-0 border-t-2 border-dashed border-border transition-all duration-700 ease-out"
                style={{
                  width: lineVisible ? "100%" : "0%",
                  transitionDelay: `${0.6 + i * 0.3}s`,
                }}
              />
            </div>
          ))}

          {/* Mobile connecting line */}
          <div className="absolute left-8 top-0 h-full md:hidden">
            <div
              className="w-0 border-l-2 border-dashed border-border transition-all duration-1000 ease-out"
              style={{ height: lineVisible ? "100%" : "0%" }}
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`relative flex flex-col items-center text-center ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              {/* Number */}
              <span className="mb-4 font-mono text-[48px] font-bold leading-none text-primary">
                {step.num}
              </span>

              {/* Visual card */}
              <div className="mb-5 flex w-full max-w-[240px] items-center justify-center rounded-xl border border-border bg-card p-6">
                {step.visual}
              </div>

              {/* Text */}
              <h3 className="font-satoshi text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-[260px] font-body text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaraKerjaSection;
