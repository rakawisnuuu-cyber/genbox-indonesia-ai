import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Sparkles } from "lucide-react";

const Generate = () => {
  const [searchParams] = useSearchParams();
  const characterId = searchParams.get("character");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-5 max-w-md mx-auto">
        {/* Pulsing icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse-subtle" />
          <div className="relative w-full h-full rounded-2xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
            <ImagePlus className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white font-satoshi">
            Generator sedang dibangun...
          </h1>
          <p className="text-[#666] text-sm mt-2">
            Kamu akan bisa generate gambar UGC realistis di sini
          </p>
        </div>

        {/* Selected character indicator */}
        {characterId && (
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-[#666] uppercase tracking-wider">Karakter Terpilih</p>
                <p className="text-sm text-white font-medium mt-0.5">ID: {characterId}</p>
              </div>
            </div>
            <p className="text-xs text-[#555] mt-3">
              Generator akan menggunakan karakter ini saat tersedia
            </p>
          </div>
        )}

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 border border-[#2A2A2A] text-[#888] text-sm px-4 py-2.5 rounded-lg hover:text-white hover:border-[#555] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          KEMBALI KE DASHBOARD
        </Link>
      </div>
    </div>
  );
};

export default Generate;
