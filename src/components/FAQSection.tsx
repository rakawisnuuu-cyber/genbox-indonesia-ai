import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Apa itu GENBOX?",
    a: "GENBOX adalah platform AI yang generate gambar dan video UGC realistis untuk affiliate marketer Indonesia. Upload foto produk, pilih karakter, dan dapatkan konten berkualitas studio dalam 30 detik.",
  },
  {
    q: "Apakah hasilnya terlihat realistis?",
    a: "Ya! AI kami generate gambar hyper-realistic yang terlihat seperti difoto oleh orang sungguhan dengan iPhone. Cocok untuk TikTok dan Instagram.",
  },
  {
    q: "Karakter apa saja yang tersedia?",
    a: "Kami punya 10+ karakter Indonesia: hijab casual, urban trendy, ibu muda, mahasiswa, beauty enthusiast, dan lainnya. Kamu juga bisa kustomisasi.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Satu kali bayar Rp 249.000 untuk akses lifetime. Pembayaran melalui QRIS, GoPay, OVO, Dana, ShopeePay, dan transfer bank.",
  },
  {
    q: "Apa itu BYOK?",
    a: "BYOK (Bring Your Own Key) artinya kamu pakai API key sendiri untuk generate tanpa batas. Kamu bayar biaya API langsung ke provider (~Rp 150-500/gambar). Akses platform GENBOX lifetime.",
  },
  {
    q: "Apakah ada free trial?",
    a: "Ya! Setiap akun baru mendapat 3 kredit gambar gratis. Tanpa kartu kredit, tanpa komitmen.",
  },
];

const FAQSection = () => {
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
    <section ref={ref} id="faq" className="relative w-full px-4 py-20 sm:py-28">
      <div className="container mx-auto max-w-[700px]">
        <div className={`mb-14 flex flex-col items-center text-center ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            ✦ FAQ
          </span>
          <h2 className="font-satoshi text-2xl font-bold uppercase tracking-[0.03em] text-foreground sm:text-3xl lg:text-[40px]">
            PERTANYAAN YANG SERING DITANYA
          </h2>
        </div>

        <Accordion type="single" collapsible className={`${visible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="min-h-[44px] py-5 text-left font-satoshi text-base font-semibold text-foreground hover:no-underline [&[data-state=open]>svg]:text-primary [&>svg]:text-primary [&>svg]:transition-transform">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 font-body text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
