import { Link } from "react-router-dom";
import { ArrowLeft, Wand2 } from "lucide-react";

const PromptGenerator = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-5 max-w-md mx-auto">
        {/* Pulsing icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse-subtle" />
          <div className="relative w-full h-full rounded-2xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white font-satoshi">
            Prompt Generator segera hadir...
          </h1>
          <p className="text-[#666] text-sm mt-2">
            AI akan membantu optimize prompt kamu untuk hasil terbaik
          </p>
        </div>

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

export default PromptGenerator;
