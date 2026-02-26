import type { ProductAnalysis, CharacterConfig, SceneConfig } from "@/types/ai";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.0-flash";

const SKIN_TONE_MAP: Record<string, string> = {
  putih: "fair light Southeast Asian skin with cool undertones",
  kuning_langsat: "light warm golden-tan Southeast Asian skin",
  sawo_matang: "medium warm brown Southeast Asian skin with golden undertones",
  coklat: "rich deep brown Southeast Asian skin with warm tones",
  gelap: "deep dark brown Southeast Asian skin with warm mahogany undertones",
};

const HAIR_STYLE_MAP: Record<string, string> = {
  hijab_modern: "modern hijab neatly wrapped with soft natural draping",
  hijab_pashmina: "pashmina hijab draped loosely with elegant folds",
  hijab_sport: "sporty hijab tightly wrapped for active look",
  lurus_panjang: "long straight hair falling naturally past shoulders",
  lurus_sebahu: "straight shoulder-length hair with clean ends",
  bob_pendek: "short bob haircut framing the face neatly",
  bergelombang: "soft wavy hair with natural body and movement",
  keriting: "curly hair with defined bouncy curls",
  ponytail: "hair pulled back in a neat ponytail",
  sanggul: "traditional bun hairstyle neatly pinned",
  buzz_cut: "very short buzz cut close to the scalp",
  crew_cut: "clean crew cut tapered on the sides",
  undercut: "modern undercut with longer top and shaved sides",
  pompadour: "classic pompadour swept back with volume",
  messy_textured: "textured messy hairstyle with casual tousled look",
  side_part: "neatly combed side part with clean lines",
  man_bun: "longer hair tied in a man bun",
  fade: "gradual fade haircut blending short to long",
};

const EXPRESSION_MAP: Record<string, string> = {
  hangat_ramah: "warm genuine smile, friendly approachable eyes",
  senyum_tipis: "subtle soft smile with calm composed expression",
  percaya_diri: "confident self-assured look with steady gaze",
  serius_fokus: "serious focused expression with determined eyes",
  ceria_energik: "cheerful energetic expression with bright sparkling eyes",
  natural_santai: "natural relaxed expression with easygoing demeanor",
  misterius: "mysterious intriguing expression with slight enigmatic gaze",
  terkejut_senang: "pleasantly surprised expression with eyes slightly widened",
};

const FACE_SHAPE_MAP: Record<string, string> = {
  oval: "oval face shape with balanced proportions",
  bulat: "round face shape with soft full cheeks",
  kotak: "square face shape with defined jawline",
  hati: "heart-shaped face tapering to a pointed chin",
  panjang: "long face shape with elongated proportions",
  segitiga: "triangular face shape wider at the jaw",
};

const EYE_COLOR_MAP: Record<string, string> = {
  "Coklat tua": "deep dark brown eyes",
  "Coklat madu": "warm honey brown eyes",
  Hitam: "dark black eyes",
  Hazel: "hazel eyes with brown-green tones",
};

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userContent: string,
  imageUrl?: string,
): Promise<string> {
  const userParts: GeminiPart[] = [];

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    userParts.push({
      inlineData: {
        mimeType: contentType,
        data: base64,
      },
    });
  }

  userParts.push({ text: userContent });

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: userParts,
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];

  if (!candidate?.content?.parts?.[0]?.text) {
    throw new Error("Gemini returned an empty or invalid response");
  }

  return candidate.content.parts[0].text;
}

function extractJson<T>(raw: string): T {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T;
    } catch {
      // fall through to other strategies
    }
  }

  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]) as T;
    } catch {
      // fall through
    }
  }

  try {
    return JSON.parse(raw.trim()) as T;
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${raw.slice(0, 300)}`);
  }
}

export async function analyzeProduct(
  imageUrl: string,
  apiKey: string,
): Promise<ProductAnalysis> {
  const systemPrompt =
    "You are a product analyst for UGC content creation. " +
    "Analyze this product image and return structured data in JSON format. " +
    "Focus on details useful for creating realistic marketing photos.";

  const userPrompt =
    "Analyze this product image and return a JSON object with exactly these fields:\n" +
    '- "productName": string (the product name or best guess)\n' +
    '- "category": string (e.g., "skincare", "fashion", "food", "tech", "beauty")\n' +
    '- "colors": string[] (dominant colors visible)\n' +
    '- "features": string[] (key product features or selling points)\n' +
    '- "targetAudience": string (who this product is for)\n' +
    '- "suggestedScenes": string[] (3-5 scene suggestions for UGC photos)\n\n' +
    "Return ONLY valid JSON, no extra text.";

  const raw = await callGemini(apiKey, systemPrompt, userPrompt, imageUrl);
  return extractJson<ProductAnalysis>(raw);
}

function mapConfigValue(value: string, mapping: Record<string, string>): string {
  return mapping[value] || value;
}

export async function buildIdentityPrompt(
  config: CharacterConfig,
  apiKey: string,
): Promise<string> {
  const genderDesc = config.gender === "female" ? "woman" : "man";
  const skinTone = mapConfigValue(config.skin_tone, SKIN_TONE_MAP);
  const hairStyle = config.hair_style ? mapConfigValue(config.hair_style, HAIR_STYLE_MAP) : "";
  const expression = config.expression ? mapConfigValue(config.expression, EXPRESSION_MAP) : "";
  const faceShape = config.face_shape ? mapConfigValue(config.face_shape, FACE_SHAPE_MAP) : "";
  const eyeColor = config.eye_color ? mapConfigValue(config.eye_color, EYE_COLOR_MAP) : "";

  const fragments = [
    `A ${config.age_range} Indonesian ${genderDesc}`,
    skinTone ? `with ${skinTone}` : "",
    faceShape ? `and ${faceShape}` : "",
    eyeColor ? `with ${eyeColor}` : "",
    hairStyle ? `wearing ${hairStyle}` : "",
    config.hair_color ? `in ${config.hair_color} color` : "",
    expression ? `showing ${expression}` : "",
    config.outfit ? `dressed in ${config.outfit} style clothing` : "",
    config.skin_condition ? `with ${config.skin_condition} skin condition` : "",
    config.custom_notes || "",
  ]
    .filter(Boolean)
    .join(", ");

  const systemPrompt =
    "You are an expert portrait description writer for AI image generation. " +
    "Take the character details provided and assemble them into a single polished, " +
    "natural-sounding identity description paragraph in English. " +
    "The paragraph should flow naturally and be optimized for AI image generation prompts. " +
    "Do NOT use JSON. Return ONLY the paragraph text.";

  const userPrompt =
    `Rewrite these character details into a single cohesive identity paragraph:\n\n${fragments}`;

  const result = await callGemini(apiKey, systemPrompt, userPrompt);
  return result.trim();
}

export async function buildUGCPrompt(params: {
  productAnalysis: ProductAnalysis;
  character: CharacterConfig;
  identityPrompt: string;
  scene: SceneConfig;
  apiKey: string;
}): Promise<string> {
  const { productAnalysis, identityPrompt, scene, apiKey } = params;

  const systemPrompt =
    "You are an expert UGC (User Generated Content) prompt engineer for AI image generation. " +
    "Create prompts that produce hyper-realistic, candid, authentic UGC-style photos. " +
    "The result should look like a real person took it with their phone for social media — " +
    "NOT a stock photo, NOT a studio portrait. " +
    "Include the product naturally in the scene. " +
    "Return ONLY the prompt text, no explanations.";

  const userPrompt =
    `Create a detailed UGC-style image generation prompt combining these elements:\n\n` +
    `CHARACTER IDENTITY:\n${identityPrompt}\n\n` +
    `PRODUCT:\n` +
    `- Name: ${productAnalysis.productName}\n` +
    `- Category: ${productAnalysis.category}\n` +
    `- Colors: ${productAnalysis.colors.join(", ")}\n` +
    `- Features: ${productAnalysis.features.join(", ")}\n\n` +
    `SCENE:\n` +
    `- Setting: ${scene.setting}\n` +
    `- Mood: ${scene.mood}\n` +
    `- Lighting: ${scene.lighting}\n` +
    `- Props: ${scene.props.join(", ")}\n` +
    `- Camera angle: ${scene.cameraAngle}\n\n` +
    `Requirements:\n` +
    `- Hyper-realistic, candid UGC aesthetic\n` +
    `- Product appears naturally in the scene (being used, held, or displayed)\n` +
    `- Southeast Asian context and setting\n` +
    `- Natural, unposed feel\n` +
    `- Detailed skin texture and lighting descriptions`;

  const result = await callGemini(apiKey, systemPrompt, userPrompt);
  return result.trim();
}
