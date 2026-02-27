import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { usePayment } from "@/hooks/usePayment";
import {
  Zap,
  Film,
  ImagePlus,
  Images,
  UserCircle,
  Rocket,
  ArrowRight,
  Loader2,
} from "lucide-react";

const sectionDelay = (i: number) => ({ animationDelay: `${i * 100}ms` });

const DashboardHome = () => {
  const { user } = useAuth();
  const { profile, credits, generations, generationCount } = useDashboardData();
  const { buyLifetime, isProcessing } = usePayment();

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";
  const tier = profile?.tier || "free";
  const imageCredits = credits?.image_credits ?? 3;
  const videoCredits = credits?.video_credits ?? 0;

  return (
    <div className="space-y-8">
      {/* SECTION 1 — Welcome */}
      <section className="animate-fade-up" style={sectionDelay(0)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-white">
              Selamat datang, {firstName}!
              <span className="ml-2 inline-block animate-float">
                <Sparkle />
              </span>
            </h1>
            <div className="mt-2">
              {tier === "free" ? (
                <span className="inline-block bg-[#2A2A2A] text-[#888] text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                  FREE TRIAL
                </span>
              ) : (
                <span className="inline-block bg-primary/15 text-primary text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                  BYOK LIFETIME ✦
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Stats */}
      <section className="animate-fade-up" style={sectionDelay(1)}>
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar-none pb-1">
          <StatCard icon={<Zap className="w-5 h-5" />} value={imageCredits} label="Kredit Gambar" lime />
          <StatCard icon={<Film className="w-5 h-5" />} value={videoCredits} label="Kredit Video" />
          <StatCard icon={<Images className="w-5 h-5" />} value={generationCount} label="Total Generasi" />
        </div>
      </section>

      {/* SECTION 3 — Quick Actions */}
      <section className="animate-fade-up" style={sectionDelay(2)}>
        <h2 className="text-xs uppercase tracking-widest text-[#666] font-medium mb-4 font-satoshi">
          MULAI BUAT KONTEN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Generate Image */}
          <ActionCard
            icon={<ImagePlus className="w-5 h-5 text-primary" />}
            title="Buat Gambar UGC"
            desc="Generate gambar realistis dari foto produk kamu"
            button={
              <Link
                to="/generate"
                className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-lime-hover transition"
              >
                GENERATE <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          {/* Video — disabled */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <Film className="w-5 h-5 text-[#555]" />
            </div>
            <h3 className="text-lg font-semibold text-white mt-3 font-satoshi">Buat Video UGC</h3>
            <p className="text-sm text-[#888] mt-1">Ubah gambar jadi video 5-15 detik</p>
            <span className="inline-block mt-4 border border-[#2A2A2A] text-[#666] text-sm font-medium px-4 py-2 rounded-lg">
              SEGERA HADIR
            </span>
          </div>

          {/* Character */}
          <ActionCard
            icon={<UserCircle className="w-5 h-5 text-primary" />}
            title="Buat Karakter"
            desc="Buat avatar realistis untuk konten jangka panjang"
            button={
              <Link
                to="/characters"
                className="inline-flex items-center gap-1 border border-primary text-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/10 transition"
              >
                BUAT KARAKTER <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
        </div>
      </section>

      {/* SECTION 4 — Recent Generations */}
      <section className="animate-fade-up" style={sectionDelay(3)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-widest text-[#666] font-medium font-satoshi">
            GENERASI TERAKHIR
          </h2>
          {generations.length > 0 && (
            <Link to="/gallery" className="text-sm text-[#666] hover:text-white transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {generations.length === 0 ? (
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-12 text-center">
            <Images className="w-14 h-14 mx-auto text-[#333]" />
            <p className="text-lg text-[#666] mt-4 font-medium">Belum ada generasi</p>
            <p className="text-sm text-[#555] mt-1">Buat gambar UGC pertamamu sekarang!</p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-1 mt-4 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-lime-hover transition"
            >
              BUAT GAMBAR PERTAMA <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="rounded-xl aspect-square bg-[#1A1A1A] overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform"
              >
                {gen.image_url ? (
                  <img src={gen.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images className="w-8 h-8 text-[#333]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5 — Upgrade Banner */}
      {tier === "free" && (
        <section className="animate-fade-up" style={sectionDelay(4)}>
          <div className="bg-gradient-to-r from-[#141414] to-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Rocket className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white font-satoshi">Upgrade ke BYOK Lifetime</p>
                  <p className="text-sm text-[#888] mt-0.5">
                    Unlimited generation, semua karakter, n8n blueprint
                  </p>
                </div>
              </div>
              <button
                onClick={buyLifetime}
                disabled={isProcessing}
                className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-lime-hover transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isProcessing ? "MEMPROSES..." : "UPGRADE — Rp 249.000"}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ── Sub-components ──

const Sparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="inline">
    <path
      d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
      fill="hsl(73,100%,50%)"
    />
  </svg>
);

const StatCard = ({
  icon,
  value,
  label,
  lime,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  lime?: boolean;
}) => (
  <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 min-w-[160px] snap-start relative">
    <div className="absolute top-4 right-4 text-[#333]">{icon}</div>
    <p className={`text-3xl font-bold font-satoshi ${lime ? "text-primary" : "text-white"}`}>{value}</p>
    <p className="text-sm text-[#666] mt-1">{label}</p>
  </div>
);

const ActionCard = ({
  icon,
  title,
  desc,
  button,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  button: React.ReactNode;
}) => (
  <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 hover:border-primary/30 hover:scale-[1.01] transition-all duration-300">
    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">{icon}</div>
    <h3 className="text-lg font-semibold text-white mt-3 font-satoshi">{title}</h3>
    <p className="text-sm text-[#888] mt-1">{desc}</p>
    <div className="mt-4">{button}</div>
  </div>
);

export default DashboardHome;
