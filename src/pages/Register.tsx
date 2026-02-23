import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      navigate("/dashboard");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");

    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div
          className="w-full max-w-md rounded-xl border border-border bg-card p-8 space-y-4 text-center animate-fade-up"
          style={{ animationDuration: "0.3s" }}
        >
          <h1 className="text-3xl font-bold font-satoshi text-foreground tracking-tight">GENBOX</h1>
          <h2 className="text-xl font-semibold text-foreground">Cek email kamu untuk verifikasi</h2>
          <p className="text-sm text-muted-foreground">
            Kami sudah mengirim link verifikasi ke <span className="text-foreground font-medium">{email}</span>
          </p>
          <Link to="/login" className="text-primary hover:underline text-sm font-medium inline-block mt-2">
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-8 space-y-6 animate-fade-up"
        style={{ animationDuration: "0.3s" }}
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-satoshi text-foreground tracking-tight">GENBOX</h1>
          <h2 className="text-xl font-semibold text-foreground">Buat Akun GENBOX</h2>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full bg-white text-black hover:bg-white/90 rounded-lg font-medium h-11 text-sm"
        >
          {googleLoading ? (
            "Loading..."
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Daftar dengan Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            placeholder="Nama lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-secondary border-border h-11"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary border-border h-11"
          />
          <Input
            type="password"
            placeholder="Password (min 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-secondary border-border h-11"
          />
          <Button
            type="submit"
            className="w-full bg-lime text-primary-foreground hover:bg-lime-hover uppercase font-bold tracking-wider h-11"
            disabled={loading}
          >
            {loading ? "Loading..." : "DAFTAR GRATIS"}
          </Button>
        </form>

        {/* Error */}
        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {/* Footer */}
        <div className="space-y-3 text-center">
          <p className="text-muted-foreground text-xs">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Masuk</Link>
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
            Dengan mendaftar, kamu setuju dengan Syarat & Ketentuan kami
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
