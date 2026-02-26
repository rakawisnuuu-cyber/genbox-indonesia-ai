export const GENERATION_POLL_INTERVAL = 3000;

export const MAX_POLL_ATTEMPTS = 60;

export const FREE_TRIAL_CREDITS = 3;

export const BYOK_PRICE_IDR = 249000;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

interface KieAiModelConfig {
  name: string;
  credits: number;
  costIdr: number;
}

export const KIE_AI_MODELS: Record<string, KieAiModelConfig> = {
  NANO_BANANA_PRO: { name: "Nano Banana Pro", credits: 8, costIdr: 640 },
  NANO_BANANA: { name: "Nano Banana", credits: 4, costIdr: 320 },
  SEEDREAM: { name: "Seedream 4.0", credits: 3.5, costIdr: 280 },
} as const;

type KieAiModelKey = keyof typeof KIE_AI_MODELS;

type ShotType =
  | "hero_portrait"
  | "profile_3_4"
  | "talking"
  | "full_body"
  | "skin_detail"
  | "product_interaction";

export const SHOT_MODEL_MAP: Record<ShotType, KieAiModelKey> = {
  hero_portrait: "NANO_BANANA_PRO",
  profile_3_4: "NANO_BANANA",
  talking: "NANO_BANANA",
  full_body: "SEEDREAM",
  skin_detail: "NANO_BANANA_PRO",
  product_interaction: "NANO_BANANA",
} as const;
