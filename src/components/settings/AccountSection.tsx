import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle } from "lucide-react";

const AccountSection = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
      <p className="text-xs uppercase tracking-widest text-[#666] mb-4 font-satoshi">
        AKUN
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-2 border border-[#2A2A2A] text-[#888] px-4 py-2 rounded-lg hover:border-[#555] hover:text-white transition"
      >
        <LogOut className="w-4 h-4" />
        KELUAR
      </button>

      <p className="text-xs text-[#555] mt-4 flex items-center gap-1">
        Butuh bantuan?{" "}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-0.5"
        >
          <MessageCircle className="w-3 h-3" />
          Hubungi kami di WhatsApp
        </a>
      </p>
    </div>
  );
};

export default AccountSection;
