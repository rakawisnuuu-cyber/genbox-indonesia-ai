export interface ProductAnalysis {
  productName: string;
  category: string;
  colors: string[];
  features: string[];
  targetAudience: string;
  suggestedScenes: string[];
}

export interface CharacterConfig {
  gender: "female" | "male";
  age_range: string;
  skin_tone: string;
  face_shape?: string;
  eye_color?: string;
  hair_style?: string;
  hair_color?: string;
  expression?: string;
  outfit?: string;
  skin_condition?: string;
  custom_notes?: string;
}

export interface SceneConfig {
  setting: string;
  mood: string;
  lighting: string;
  props: string[];
  cameraAngle: string;
}

export type ShotType =
  | "hero_portrait"
  | "profile_3_4"
  | "talking"
  | "full_body"
  | "skin_detail"
  | "product_interaction";

export interface KieAiJobParams {
  prompt: string;
  model: string;
  referenceImageUrl?: string;
  negativePrompt?: string;
  apiKey: string;
}

export interface KieAiJobResult {
  jobId: string;
}

export type KieAiJobStatus = "pending" | "processing" | "completed" | "failed";

export interface KieAiJobStatusResult {
  status: KieAiJobStatus;
  resultUrl?: string;
  error?: string;
}

export interface ShotConfig {
  framing: string;
  gaze: string;
  expression: string;
  background: string;
  instructions: string;
}

export interface CameraSpec {
  lens: string;
  aperture: string;
}
