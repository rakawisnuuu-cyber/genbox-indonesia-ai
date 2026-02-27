import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../auth";
import { getSnap, BYOK_LIFETIME_PRICE, BYOK_LIFETIME_ITEM } from "../../src/lib/midtrans";

export const paymentCreateRouter = Router();

paymentCreateRouter.post("/", requireAuth, async (req, res: Response) => {
  const { user, supabase } = req as AuthenticatedRequest;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, is_lifetime")
      .eq("id", user.id)
      .single();

    if (profile?.is_lifetime) {
      res.status(400).json({ error: "Kamu sudah BYOK Lifetime!" });
      return;
    }

    const orderId = `GENBOX-${user.id.slice(0, 8)}-${Date.now()}`;

    const snap = getSnap();
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: BYOK_LIFETIME_PRICE,
      },
      item_details: [BYOK_LIFETIME_ITEM],
      customer_details: {
        email: user.email,
        first_name: user.user_metadata?.full_name || user.email,
      },
    });

    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      order_id: orderId,
      amount: BYOK_LIFETIME_PRICE,
      status: "pending",
      provider: "midtrans",
    });

    if (insertError) {
      console.error("Payment insert error:", insertError);
      res.status(500).json({ error: "Gagal membuat pembayaran." });
      return;
    }

    res.json({ token: transaction.token, orderId });
  } catch (err) {
    console.error("Payment create error:", err);
    res.status(500).json({ error: "Gagal membuat transaksi pembayaran." });
  }
});
