# GENBOX

AI-powered UGC (User Generated Content) generator app. Allows users to create realistic AI characters, generate image content, and manage their creations.

## Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router DOM v6, TanStack Query v5
- **Auth & Database**: Supabase (auth + PostgreSQL)
- **Styling**: Tailwind CSS with custom dark theme (lime/green accent `#BFFF00`)
- **Fonts**: DM Sans (body), Satoshi (headings)

## Architecture

Frontend uses Supabase client directly for auth and data (RLS). Backend utilities in `src/lib/` support server-side operations.

### Frontend
- `src/integrations/supabase/client.ts` — Supabase client (reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`)
- `src/integrations/supabase/types.ts` — Auto-generated Supabase DB types
- `src/integrations/lovable/index.ts` — OAuth wrapper using Supabase's built-in `signInWithOAuth`
- `src/contexts/AuthContext.tsx` — Auth state provider
- `src/hooks/useDashboardData.ts` — Fetches profile, credits, and generations for the dashboard

### Backend Utilities (src/lib/)
- `src/lib/encryption.ts` — AES-256-GCM encryption for BYOK API keys (uses `ENCRYPTION_SECRET`)
- `src/lib/rate-limit.ts` — In-memory rate limiter (10 req/60s per user, with cleanup)
- `src/lib/supabase/server.ts` — Server-side Supabase client (authenticated + admin/service-role)
- `src/lib/constants.ts` — App constants, KIE AI model configs, shot-model mapping

### AI Services (src/lib/ai/)
- `src/lib/ai/gemini.ts` — Gemini 2.0 Flash integration (product analysis, identity prompts, UGC prompts)
- `src/lib/ai/kie-ai.ts` — Kie AI image generation (job creation, status polling, image download) with retry/rate-limit handling
- `src/lib/ai/prompt-templates.ts` — GENBOX Prompt Formula: realism, camera specs, lighting, skin detail, quality, negative prompt, shot configs, and `assembleCharacterPrompt()` combiner

### Image Processing (src/lib/)
- `src/lib/watermark.ts` — Sharp-based watermark for free trial images (diagonal "GENBOX FREE TRIAL" + corner "GENBOX" via SVG overlay, graceful fallback)

### Types (src/types/)
- `src/types/ai.ts` — ProductAnalysis, CharacterConfig, SceneConfig, ShotType, ShotConfig, CameraSpec, KieAi types

## Database (Supabase)

Tables (all with RLS enabled, users can only access their own data):
- `profiles` — User profile info (name, avatar, tier: free/byok)
- `user_credits` — Image and video credit balances
- `generations` — Generated image history
- `characters` — User-created and preset characters
- `user_api_keys` — Encrypted user-provided API keys (kie_ai, gemini)

## Environment Secrets

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/publishable key

## Workflow

- **Start application**: `npm run dev` on port 5000

## Key Pages

- `/` — Landing page (Index)
- `/login`, `/register`, `/forgot-password`, `/reset-password` — Auth pages
- `/dashboard` — Dashboard home with credits and recent generations
- `/characters` — Browse preset and custom characters
- `/characters/create` — Create/edit a character
- `/generate` — Image generator (placeholder, in development)
- `/settings` — Profile, API keys, account management

## Notes

- The app is Indonesian-language UI (Bahasa Indonesia)
- Google OAuth goes through Supabase's built-in OAuth provider
- API keys stored in DB are base64-encoded (not truly encrypted — future improvement)
- The `lovable-tagger` dev dependency and `@lovable.dev/cloud-auth-js` are still in `package.json` but the lovable integration has been replaced with native Supabase OAuth
