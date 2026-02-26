import type { ShotType, ShotConfig, CameraSpec } from "@/types/ai";

export const REALISM_BASE =
  "Ultra-realistic photographic portrait, commercial photography, " +
  "real-world studio photography, cinematic realism, lifelike details, " +
  "true-to-life textures.";

export const CAMERA_SPECS: Record<ShotType, CameraSpec> = {
  hero_portrait: {
    lens: "85mm prime lens",
    aperture: "f/1.8",
  },
  profile_3_4: {
    lens: "50mm prime lens",
    aperture: "f/2.0",
  },
  talking: {
    lens: "35mm wide-angle lens",
    aperture: "f/2.8",
  },
  full_body: {
    lens: "24-70mm zoom lens at 50mm",
    aperture: "f/4.0",
  },
  skin_detail: {
    lens: "100mm macro lens",
    aperture: "f/2.8",
  },
  product_interaction: {
    lens: "50mm prime lens",
    aperture: "f/2.2",
  },
};

export const LIGHTING_BLOCK =
  "Professional studio lighting setup: soft key light from 45 degrees " +
  "creating gentle modeling on the face, fill light reducing harsh shadows, " +
  "subtle rim light separating subject from background. " +
  "Warm neutral tones that complement Southeast Asian skin.";

export const SKIN_BLOCK_GENBOX =
  "Skin rendered with ultra-realistic detail: visible soft pores, " +
  "natural micro-texture, subtle skin imperfections that add authenticity. " +
  "Natural makeup look — 'rapi tapi natural' philosophy: foundation blends " +
  "seamlessly with real skin, subtle blush on cheeks, natural lip tint, " +
  "light mascara enhancing lashes without looking overdone. " +
  "Skin has natural sheen, not overly matte or glossy. " +
  "Fine vellus hair visible in close-up shots. " +
  "No airbrushed perfection — real human skin with character.";

export const QUALITY_BLOCK =
  "8K resolution, ultra-high detail, photographic realism, " +
  "sharp focus on subject, natural depth of field, " +
  "professional color grading, high dynamic range, " +
  "shot on high-end mirrorless camera, RAW quality output.";

export const NEGATIVE_BLOCK =
  "No cartoon, no anime, no CGI, no 3D render, no illustration, " +
  "no painting, no digital art, no watercolor, no sketch, " +
  "no deformed features, no extra limbs, no distorted face, " +
  "no blurry, no low resolution, no oversaturated, " +
  "no plastic skin, no airbrushed, no uncanny valley, " +
  "no stock photo pose, no stiff expression.";

export const SHOT_CONFIGS: Record<ShotType, ShotConfig> = {
  hero_portrait: {
    framing: "Close-up headshot, head and shoulders visible, centered composition",
    gaze: "Direct eye contact with the camera, engaging and confident",
    expression: "Warm, approachable smile with natural ease",
    background: "Clean, softly blurred neutral background with subtle gradient",
    instructions:
      "This is the hero image — the character's defining portrait. " +
      "Capture their personality and essence. Face should be perfectly lit " +
      "with catchlights visible in the eyes. Skin texture clearly visible.",
  },
  profile_3_4: {
    framing: "Three-quarter view, face turned 30-45 degrees from camera, head to chest",
    gaze: "Eyes looking slightly past camera or toward a natural focal point",
    expression: "Thoughtful, natural resting expression with slight softness",
    background: "Soft out-of-focus environment suggesting a lifestyle setting",
    instructions:
      "Show the character's profile and jawline definition. " +
      "Lighting should sculpt the face with gentle shadows on the far side. " +
      "Natural, editorial feel — like a candid moment captured.",
  },
  talking: {
    framing: "Medium shot from chest up, slightly wide to suggest conversation space",
    gaze: "Looking directly at camera as if mid-conversation with the viewer",
    expression: "Animated, mid-speech with natural mouth position, engaged eyes",
    background: "Casual indoor or cafe-like setting, softly blurred",
    instructions:
      "Capture the character as if they're talking to camera for a UGC video thumbnail. " +
      "Hands may be slightly visible gesturing. Natural, unposed energy. " +
      "Slight motion blur acceptable on hands for authenticity.",
  },
  full_body: {
    framing: "Full body shot from head to feet, standing or in natural pose",
    gaze: "Natural gaze direction, can be looking at camera or to the side",
    expression: "Confident, relaxed posture with natural body language",
    background: "Environmental context — outdoor street, studio, or lifestyle location",
    instructions:
      "Show the complete outfit and body proportions. " +
      "Natural stance — not a fashion runway pose. " +
      "Feet grounded, natural weight distribution. " +
      "Full outfit visible and styled consistently with character identity.",
  },
  skin_detail: {
    framing: "Extreme close-up on face, focusing on skin texture from cheek to forehead",
    gaze: "Eyes partially visible, focus is on skin surface",
    expression: "Neutral, relaxed face to show natural skin state",
    background: "Completely blurred, irrelevant — all attention on skin",
    instructions:
      "Macro-style shot showcasing the character's skin texture in detail. " +
      "Individual pores visible, natural skin sheen, any freckles or marks. " +
      "This shot proves the character has realistic skin — crucial for UGC credibility. " +
      "Soft directional light to reveal texture without harsh shadows.",
  },
  product_interaction: {
    framing: "Medium close-up, character holding or interacting with a product",
    gaze: "Looking at the product or at camera while holding the product",
    expression: "Genuine interest, natural reaction as if discovering the product",
    background: "Clean lifestyle setting appropriate for the product category",
    instructions:
      "Character naturally interacting with a product — holding, applying, or using it. " +
      "Hands should look natural with the product. " +
      "The product should be clearly visible but the focus remains on the character. " +
      "Authentic UGC feel — like a real review or recommendation moment.",
  },
};

export function assembleCharacterPrompt(params: {
  identityPrompt: string;
  shotType: ShotType;
}): string {
  const { identityPrompt, shotType } = params;

  const cameraSpec = CAMERA_SPECS[shotType];
  const shotConfig = SHOT_CONFIGS[shotType];

  const cameraLine = `Shot with ${cameraSpec.lens} at ${cameraSpec.aperture}.`;

  const shotBlock = [
    `Framing: ${shotConfig.framing}.`,
    `Gaze: ${shotConfig.gaze}.`,
    `Expression: ${shotConfig.expression}.`,
    `Background: ${shotConfig.background}.`,
    shotConfig.instructions,
  ].join(" ");

  const sections = [
    REALISM_BASE,
    cameraLine,
    identityPrompt,
    shotBlock,
    LIGHTING_BLOCK,
    SKIN_BLOCK_GENBOX,
    QUALITY_BLOCK,
    `Negative prompt: ${NEGATIVE_BLOCK}`,
  ];

  return sections.join("\n\n");
}

export function getNegativePrompt(): string {
  return NEGATIVE_BLOCK;
}
