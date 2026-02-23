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
    a: "GENBOX adalah platform AI yang bantu kamu generate gambar dan video UGC realistis buat jualan online. Tinggal upload foto produk, pilih karakter, dan dalam 30 detik konten kamu udah siap posting.",
  },
  {
    q: "Hasilnya beneran kelihatan real?",
    a: "Beneran! AI kami generate gambar hyper-realistic yang kelihatan kayak difoto pakai iPhone sama orang sungguhan. Udah banyak seller yang pakai buat TikTok dan Instagram.",
  },
  {
    q: "Karakter apa aja yang tersedia?",
    a: "Ada 10+ karakter Indonesia: hijab casual, urban trendy, ibu muda, mahasiswa, beauty enthusiast, dan lainnya. Kamu juga bisa kustomisasi sesuai kebutuhan.",
  },
  {
    q: "Bayarnya gimana?",
    a: "Satu kali bayar Rp 249.000, akses selamanya. Bisa bayar pakai QRIS, GoPay, OVO, Dana, ShopeePay, atau transfer bank.",
  },
  {
    q: "BYOK itu apa sih?",
    a: "BYOK (Bring Your Own Key) artinya kamu pakai API key sendiri buat generate tanpa batas. Biaya API langsung ke provider, cuma ~Rp 150-500 per gambar. Platform GENBOX-nya gratis selamanya.",
  },
  {
    q: "Ada free trial gak?",
    a: "Ada dong! Setiap akun baru dapet 3 kredit gambar gratis. Tanpa kartu kredit, tanpa komitmen. Langsung bisa coba.",
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
