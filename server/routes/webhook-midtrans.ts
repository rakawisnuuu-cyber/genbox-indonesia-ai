import { Router, Request, Response } from "express";
import crypto from "crypto";
import { createAdminClient } from "../auth";

export const webhookMidtransRouter = Router();

webhookMidtransRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY not configured");
      res.status(200).json({ status: "ok" });
      return;
    }

    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Invalid Midtrans signature for order:", order_id);
      res.status(200).json({ status: "ok" });
      return;
    }

    const admin = createAdminClient();

    const { data: payment } = await admin
      .from("payments")
      .select("*")
      .eq("order_id", order_id)
      .single();

    if (!payment) {
      console.error("Payment not found for order:", order_id);
      res.status(200).json({ status: "ok" });
      return;
    }

    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    const isFailed =
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire";

    const isRefund = transaction_status === "refund";

    if (isSuccess) {
      await admin
        .from("payments")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      await admin
        .from("profiles")
        .update({
          tier: "byok",
          is_lifetime: true,
          lifetime_activated_at: new Date().toISOString(),
        })
        .eq("id", payment.user_id);

      await admin.from("credit_transactions").insert({
        user_id: payment.user_id,
        type: "purchase",
        amount: 0,
        description: "GENBOX BYOK Lifetime via Midtrans",
      });
    } else if (isFailed) {
      await admin
        .from("payments")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", payment.id);
    } else if (isRefund) {
      await admin
        .from("payments")
        .update({ status: "refunded", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      await admin
        .from("profiles")
        .update({
          tier: "free",
          is_lifetime: false,
        })
        .eq("id", payment.user_id);
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Midtrans webhook error:", err);
    res.status(200).json({ status: "ok" });
  }
});
