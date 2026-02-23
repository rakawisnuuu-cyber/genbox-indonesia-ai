const placeholderGradients = [
  "from-purple-600 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-yellow-400",
  "from-green-500 to-emerald-400",
  "from-rose-500 to-red-400",
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(0 0% 4%) 0%, hsl(0 0% 2%) 100%)",
        }}
      />
      <div className="grid-pattern absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="animate-fade-up mb-6 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground"
          style={{ animationDelay: "0.1s" }}
        >
          ✦ AI-POWERED UGC GENERATOR
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up font-satoshi max-w-[800px] text-[32px] font-bold uppercase leading-[1.1] tracking-[0.05em] text-foreground sm:text-[44px] lg:text-[56px]"
          style={{ animationDelay: "0.2s" }}
        >
          BIKIN KONTEN UGC REALISTIS DALAM 30 DETIK
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up mt-6 max-w-[600px] font-body text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Upload foto produk. Pilih karakter Indonesia. Generate gambar UGC berkualitas tinggi untuk
          TikTok &amp; Instagram — tanpa model, tanpa studio.
        </p>

        {/* Buttons */}
        <div
          className="animate-fade-up mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          style={{ animationDelay: "0.4s" }}
        >
          <a
            href="#"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-200 hover:-translate-y-px hover:bg-lime-hover sm:w-auto"
          >
            MULAI GRATIS →
          </a>
          <a
            href="#"
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
