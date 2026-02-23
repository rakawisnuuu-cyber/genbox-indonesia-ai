import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  ImagePlus,
  UserCircle,
  Images,
  Sparkles,
  Package,
  Film,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Buat Gambar", path: "/generate", icon: ImagePlus },
  { label: "Karakter", path: "/characters", icon: UserCircle },
  { label: "Gallery", path: "/gallery", icon: Images },
  { label: "Prompt Generator", path: "/prompt", icon: Sparkles },
  { label: "n8n Blueprint", path: "/blueprint", icon: Package },
  { label: "Buat Video", path: "/video", icon: Film, soon: true },
];

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, credits } = useDashboardData();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const tier = profile?.tier || "free";
  const imageCredits = credits?.image_credits ?? 3;

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.soon ? "#" : item.path}
            onClick={(e) => {
              if (item.soon) e.preventDefault();
              else onNavigate?.();
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#1A1A1A] text-white border-l-2 border-primary ml-0 pl-[10px]"
                : item.soon
                ? "text-[#444] cursor-not-allowed"
                : "text-[#666] hover:bg-[#111] hover:text-[#999]"
            }`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span>{item.label}</span>
            {item.soon && (
              <span className="ml-auto bg-[#2A2A2A] text-[#666] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const BottomSection = ({ onSignOut }: { onSignOut: () => void }) => (
    <div className="mt-auto">
      <div className="border-t border-[#2A2A2A] mb-4" />

      {/* Credits */}
      <div className="flex items-center gap-2 px-3 mb-3">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-primary font-bold text-sm">{imageCredits}</span>
        <span className="text-[#666] text-xs">kredit</span>
      </div>

      {/* Upgrade button */}
      {tier === "free" && (
        <Link
          to="/#harga"
          className="block w-full bg-primary text-primary-foreground font-bold text-sm py-2 rounded-lg text-center hover:bg-lime-hover transition mb-3"
        >
          UPGRADE — Rp 249k
        </Link>
      )}

      {/* User row */}
      <div className="flex items-center gap-2 px-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-xs font-bold text-white">
            {initial}
          </div>
        )}
        <span className="text-sm text-[#999] truncate flex-1">{displayName}</span>
        <button
          onClick={onSignOut}
          className="text-[#666] text-xs hover:text-white transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );

  // ── DESKTOP SIDEBAR ──
  const Sidebar = () => (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-background border-r border-[#2A2A2A] flex-col px-4 py-5 z-40">
      {/* Logo */}
      <div className="mb-1">
        <Link to="/dashboard" className="text-lg font-bold font-satoshi text-white tracking-widest uppercase">
          GENBOX
        </Link>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[#555] text-[11px]">v1.0</span>
        </div>
      </div>

      <div className="mt-8 flex-1 flex flex-col">
        <NavList />
        <BottomSection onSignOut={handleSignOut} />
      </div>
    </aside>
  );

  // ── MOBILE TOP NAV ──
  const MobileNav = () => (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-xl border-b border-[#2A2A2A] flex items-center justify-between px-4">
        <Link to="/dashboard" className="text-lg font-bold font-satoshi text-white tracking-widest uppercase">
          GENBOX
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-[#1A1A1A] rounded-full px-2.5 py-1 text-xs">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-primary font-bold">{imageCredits}</span>
          </span>
          <button onClick={() => setMobileOpen(true)} className="text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg flex flex-col px-6 py-5">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-bold font-satoshi text-white tracking-widest uppercase">GENBOX</span>
            <button onClick={() => setMobileOpen(false)} className="text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.soon ? "#" : item.path}
                    onClick={(e) => {
                      if (item.soon) e.preventDefault();
                      else setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 py-4 text-base font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : item.soon
                        ? "text-[#444]"
                        : "text-[#888] hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                    {item.soon && (
                      <span className="ml-auto bg-[#2A2A2A] text-[#666] text-[10px] px-2 py-0.5 rounded-full uppercase">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <BottomSection onSignOut={handleSignOut} />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <main className="lg:ml-60 min-h-screen px-4 py-4 lg:px-6 lg:py-8 mt-14 lg:mt-0">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
