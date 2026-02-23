import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Smartphone, Store } from "lucide-react";

const personas = [
  {
    icon: ShoppingCart,
    title: "Seller TikTok Shop & Shopee",
    description: "Generate foto produk UGC berkualitas tanpa ribet hire model atau fotografer",
  },
  {
    icon: Smartphone,
    title: "Affiliate Marketer",
    description: "Bikin konten review produk yang kelihatan real dalam hitungan detik",
  },
  {
    icon: Store,
    title: "UMKM & Brand Lokal",
    description: "Konten berkualitas studio tapi dengan budget UMKM — hemat dan cuan",
  },
];

const DibuatUntukSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative w-full bg-background px-4 py-20 sm:py-28">
      <div className="container mx-auto max-w-[1200px]">
        {/* Heading */}
        <h2
          className={`font-satoshi text-center text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px] ${
            visible ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          DIBUAT UNTUK AFFILIATE MARKETER INDONESIA
        </h2>
        <p
          className={`mx-auto mt-4 max-w-[600px] text-center font-body text-base leading-relaxed text-muted-foreground sm:text-lg ${
            visible ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          Dari seller TikTok Shop sampai dropshipper — GENBOX bantu kamu bikin konten yang convert.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {personas.map((persona, i) => (
            <div
              key={persona.title}
              className={`rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 ${
                visible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <persona.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-satoshi text-lg font-semibold text-foreground">
                {persona.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DibuatUntukSection;
