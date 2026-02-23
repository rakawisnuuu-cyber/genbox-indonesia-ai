import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogOut, Settings, Zap } from "lucide-react";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Generate", path: "/generate" },
  { label: "Gallery", path: "/gallery" },
  { label: "Characters", path: "/character" },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initial = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          {/* Left: Logo */}
          <Link to="/dashboard" className="text-lg font-bold font-satoshi text-foreground tracking-tight">
            GENBOX
          </Link>

          {/* Center: Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors pb-0.5 ${
                    isActive
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Credits + Avatar (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm font-medium text-primary">
              <Zap className="w-4 h-4" /> 3
            </span>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-full"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                  {initial}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                <Zap className="w-4 h-4" /> 3 credits
              </span>
              <button onClick={handleSignOut} className="text-sm text-destructive font-medium">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-14 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-5 animate-fade-up" style={{ animationDuration: "0.4s" }}>
          <h1 className="text-3xl md:text-4xl font-bold font-satoshi text-foreground">
            Selamat datang di GENBOX! 🎉
          </h1>
          <p className="text-muted-foreground text-base">
            Kamu punya <span className="text-primary font-semibold">3 kredit gratis</span>.
          </p>
          <Button
            onClick={() => navigate("/generate")}
            className="bg-lime text-primary-foreground hover:bg-lime-hover uppercase font-bold tracking-wider h-12 px-8 text-sm"
          >
            BUAT GAMBAR UGC PERTAMAMU →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
