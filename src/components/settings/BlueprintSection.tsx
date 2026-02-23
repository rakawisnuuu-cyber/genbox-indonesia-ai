import { useDashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Lock, Download, Workflow, ArrowRightLeft, Send } from "lucide-react";

const blueprints = [
  {
    icon: Workflow,
    name: "Product-to-UGC Pipeline",
    desc: "Webhook → analyze → generate → save",
  },
  {
    icon: ArrowRightLeft,
    name: "Batch UGC Generator",
    desc: "Google Sheet → loop → generate all",
  },
  {
    icon: Send,
    name: "Auto-Post to Social",
    desc: "Resize + caption + queue posting",
  },
];

const BlueprintSection = () => {
  const { profile } = useDashboardData();
  const { toast } = useToast();
  const tier = profile?.tier || "free";
  const isLocked = tier === "free";

  const handleDownload = () => {
    toast({ title: "Akan tersedia setelah launch! 🚀" });
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 relative overflow-hidden">
      <p className="text-xs uppercase tracking-widest text-[#666] mb-1 font-satoshi">
        N8N BLUEPRINT
      </p>
      <p className="text-sm text-[#888] mb-4">
        Download template automasi n8n untuk workflow UGC
      </p>

      {isLocked && (
        <div className="absolute inset-0 z-10 bg-[#141414]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-xl">
          <Lock className="w-8 h-8 text-[#555]" />
          <p className="text-sm text-[#888] text-center px-6">
            Upgrade ke BYOK Lifetime untuk akses
          </p>
          <Link
            to="/#harga"
            className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition"
          >
            UPGRADE
          </Link>
        </div>
      )}

      <div className={isLocked ? "blur-sm pointer-events-none select-none" : ""}>
        <div className="space-y-2">
          {blueprints.map((bp) => {
            const Icon = bp.icon;
            return (
              <div
                key={bp.name}
                className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#2A2A2A] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {bp.name}
                    </p>
                    <p className="text-xs text-[#666] truncate">{bp.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs text-[#888] hover:text-white border border-[#2A2A2A] hover:border-[#555] px-3 py-1.5 rounded-lg transition shrink-0 ml-3"
                >
                  <Download className="w-3 h-3" />
                  DOWNLOAD
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlueprintSection;
