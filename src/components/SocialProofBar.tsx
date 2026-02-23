const platforms = ["TikTok Shop", "Instagram", "Shopee", "Tokopedia", "Lazada"];

const SocialProofBar = () => {
  return (
    <section className="relative w-full border-y border-border/30 bg-background py-8">
      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--text-muted))]">
        DIPERCAYA OLEH SELLER DI
      </p>
      {/* Desktop */}
      <div className="hidden items-center justify-center gap-12 md:flex">
        {platforms.map((name) => (
          <span
            key={name}
            className="text-sm uppercase tracking-wider text-muted-foreground/60 select-none"
          >
            {name}
          </span>
        ))}
      </div>
      {/* Mobile marquee */}
      <div className="overflow-hidden md:hidden">
        <div className="animate-marquee flex w-max gap-10">
          {[...platforms, ...platforms].map((name, i) => (
            <span
              key={i}
              className="text-sm uppercase tracking-wider text-muted-foreground/60 select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
