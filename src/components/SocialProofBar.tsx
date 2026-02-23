import { useEffect, useRef, useState } from "react";

const platforms = ["TikTok Shop", "Instagram", "Shopee", "Tokopedia", "Lazada"];

const SocialProofBar = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative w-full border-y border-border/30 bg-background py-8">
      <p
        className={`mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--text-muted))] ${visible ? "animate-fade-up" : "opacity-0"}`}
      >
        DIPERCAYA OLEH SELLER DI
      </p>
      {/* Desktop */}
      <div
        className={`hidden items-center justify-center gap-12 md:flex ${visible ? "animate-fade-up" : "opacity-0"}`}
        style={{ animationDelay: "0.1s" }}
      >
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
      <div className={`overflow-hidden md:hidden ${visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
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
