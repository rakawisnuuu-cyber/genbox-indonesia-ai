import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";

interface SnapResult {
  order_id: string;
  transaction_status: string;
}

interface SnapCallbacks {
  onSuccess: (result: SnapResult) => void;
  onPending: (result: SnapResult) => void;
  onError: (result: SnapResult) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: SnapCallbacks) => void;
    };
  }
}

export function usePayment() {
  const { session } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const buyLifetime = async () => {
    if (!session?.access_token) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    if (!window.snap) {
      toast.error("Payment system belum siap. Refresh halaman dan coba lagi.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal memulai pembayaran.");
      }

      const { token } = await res.json();

      window.snap.pay(token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil! Akun BYOK aktif.");
          setIsProcessing(false);
          // Reload to reflect new tier
          setTimeout(() => window.location.reload(), 1500);
        },
        onPending: () => {
          toast.info("Menunggu pembayaran...");
          setIsProcessing(false);
        },
        onError: () => {
          toast.error("Pembayaran gagal. Coba lagi.");
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memulai pembayaran.");
      setIsProcessing(false);
    }
  };

  return { buyLifetime, isProcessing };
}
