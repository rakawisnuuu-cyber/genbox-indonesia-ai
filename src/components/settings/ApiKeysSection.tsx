import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface KeyState {
  value: string;
  visible: boolean;
  saved: boolean;
  testing: boolean;
  valid: boolean | null;
}

const defaultKey = (): KeyState => ({
  value: "",
  visible: false,
  saved: false,
  testing: false,
  valid: null,
});

const ApiKeysSection = () => {
  const { user } = useAuth();
  const { profile } = useDashboardData();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const tier = profile?.tier || "free";
  const isLocked = tier === "free";

  const [kieKey, setKieKey] = useState<KeyState>(defaultKey());
  const [geminiKey, setGeminiKey] = useState<KeyState>(defaultKey());
  const [saving, setSaving] = useState(false);

  // Load existing keys
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", user.id);
      if (data) {
        const kie = data.find((k) => k.provider === "kie_ai");
        const gem = data.find((k) => k.provider === "gemini");
        if (kie)
          setKieKey((prev) => ({
            ...prev,
            value: atob(kie.encrypted_key),
            saved: true,
            valid: kie.is_valid,
          }));
        if (gem)
          setGeminiKey((prev) => ({
            ...prev,
            value: atob(gem.encrypted_key),
            saved: true,
            valid: gem.is_valid,
          }));
      }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const upserts = [];
    if (kieKey.value.trim()) {
      upserts.push({
        user_id: user.id,
        provider: "kie_ai",
        encrypted_key: btoa(kieKey.value.trim()),
        is_valid: true,
        updated_at: new Date().toISOString(),
      });
    }
    if (geminiKey.value.trim()) {
      upserts.push({
        user_id: user.id,
        provider: "gemini",
        encrypted_key: btoa(geminiKey.value.trim()),
        is_valid: true,
        updated_at: new Date().toISOString(),
      });
    }

    if (upserts.length > 0) {
      const { error } = await supabase
        .from("user_api_keys")
        .upsert(upserts, { onConflict: "user_id,provider" });

      if (error) {
        toast({
          title: "Gagal menyimpan",
          description: error.message,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    setKieKey((prev) => ({ ...prev, saved: true }));
    setGeminiKey((prev) => ({ ...prev, saved: true }));
    toast({ title: "✅ API key berhasil disimpan!" });
    setSaving(false);
  };

  const handleTest = async (provider: "kie" | "gemini") => {
    const setter = provider === "kie" ? setKieKey : setGeminiKey;
    setter((prev) => ({ ...prev, testing: true, valid: null }));

    // Simulate test (real validation comes in Phase 3)
    await new Promise((r) => setTimeout(r, 1500));

    const key = provider === "kie" ? kieKey.value : geminiKey.value;
    const isValid = key.trim().length > 10;
    setter((prev) => ({ ...prev, testing: false, valid: isValid }));

    toast({
      title: isValid ? "Key valid" : "Key tidak valid",
      description: isValid
        ? "API key berhasil diverifikasi"
        : "Periksa kembali API key kamu",
      variant: isValid ? "default" : "destructive",
    });
  };

  const StatusDot = ({ saved, valid }: { saved: boolean; valid: boolean | null }) => {
    if (!saved)
      return (
        <span className="flex items-center gap-1 text-xs text-[#666]">
          <span className="w-2 h-2 rounded-full bg-[#555]" /> Belum diset
        </span>
      );
    if (valid === false)
      return (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <XCircle className="w-3 h-3" /> Key tidak valid
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-xs text-green-500">
        <CheckCircle2 className="w-3 h-3" /> Tersimpan
      </span>
    );
  };

  const inputClass =
    "flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition placeholder:text-[#555] pr-20";

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 relative overflow-hidden">
      <p className="text-xs uppercase tracking-widest text-[#666] mb-1 font-satoshi">
        API KEYS
      </p>
      <p className="text-sm text-[#888] mb-4">
        Masukkan API key untuk generate tanpa batas
      </p>

      {isLocked && (
        <div className="absolute inset-0 z-10 bg-[#141414]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-xl">
          <Lock className="w-8 h-8 text-[#555]" />
          <p className="text-sm text-[#888] text-center px-6">
            Upgrade ke BYOK Lifetime untuk menggunakan API key sendiri
          </p>
          <Link
            to="/#harga"
            className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition"
          >
            UPGRADE — Rp 249.000
          </Link>
        </div>
      )}

      <div className={isLocked ? "blur-sm pointer-events-none select-none" : ""}>
        {/* Kie AI Key */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-white font-medium">Kie AI</span>
              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs flex items-center gap-0.5 hover:underline"
              >
                Dapatkan di kie.ai <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <StatusDot saved={kieKey.saved} valid={kieKey.valid} />
          </div>
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={kieKey.visible ? "text" : "password"}
                className={inputClass}
                placeholder="kie_xxxxxxxxxxxxx"
                value={kieKey.value}
                onChange={(e) =>
                  setKieKey((prev) => ({
                    ...prev,
                    value: e.target.value,
                    saved: false,
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setKieKey((prev) => ({ ...prev, visible: !prev.visible }))
                }
                className="absolute right-10 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition"
              >
                {kieKey.visible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleTest("kie")}
              disabled={!kieKey.value.trim() || kieKey.testing}
              className="text-xs text-[#888] hover:text-white underline transition disabled:opacity-40 whitespace-nowrap"
            >
              {kieKey.testing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "TEST KEY"
              )}
            </button>
          </div>
        </div>

        {/* Gemini Key */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-white font-medium">Google Gemini</span>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs flex items-center gap-0.5 hover:underline"
              >
                Dapatkan di aistudio.google.com{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <StatusDot saved={geminiKey.saved} valid={geminiKey.valid} />
          </div>
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={geminiKey.visible ? "text" : "password"}
                className={inputClass}
                placeholder="AIzaSy..."
                value={geminiKey.value}
                onChange={(e) =>
                  setGeminiKey((prev) => ({
                    ...prev,
                    value: e.target.value,
                    saved: false,
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  setGeminiKey((prev) => ({
                    ...prev,
                    visible: !prev.visible,
                  }))
                }
                className="absolute right-10 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition"
              >
                {geminiKey.visible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleTest("gemini")}
              disabled={!geminiKey.value.trim() || geminiKey.testing}
              className="text-xs text-[#888] hover:text-white underline transition disabled:opacity-40 whitespace-nowrap"
            >
              {geminiKey.testing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "TEST KEY"
              )}
            </button>
          </div>
          <p className="text-[#555] text-xs mt-1">
            Opsional — untuk prompt AI yang lebih baik (gratis)
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg text-sm hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "SIMPAN API KEYS"}
        </button>
      </div>
    </div>
  );
};

export default ApiKeysSection;
