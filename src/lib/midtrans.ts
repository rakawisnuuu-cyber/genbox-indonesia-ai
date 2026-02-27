import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export function getSnap(): typeof snap {
  return snap;
}

export function getClientKey(): string {
  return process.env.MIDTRANS_CLIENT_KEY || "";
}

export const BYOK_LIFETIME_PRICE = 249000;
export const BYOK_LIFETIME_ITEM = {
  id: "BYOK_LIFETIME",
  price: BYOK_LIFETIME_PRICE,
  quantity: 1,
  name: "GENBOX BYOK Lifetime Access",
};
