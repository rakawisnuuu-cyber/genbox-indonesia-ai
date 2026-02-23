

## Supabase Auth Setup for Vite + React

### Important Note
This project uses **Vite + React + React Router**, not Next.js. The Next.js-specific packages (`@supabase/auth-helpers-nextjs`) and patterns (`middleware.ts`, server components) don't apply here. Below is the equivalent setup adapted for this stack.

### What Will Be Created

**1. Install `@supabase/supabase-js`**
- Only package needed for a Vite/React app (no auth-helpers-nextjs)

**2. `src/lib/supabase.ts` -- Supabase browser client**
- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables (Vite uses `VITE_` prefix, not `NEXT_PUBLIC_`)
- Single `createClient` instance for the entire app

**3. `src/contexts/AuthContext.tsx` -- Auth state provider**
- React context that wraps the app
- Listens to `onAuthStateChange` for session updates
- Exposes `user`, `session`, `loading`, `signOut` to all components

**4. `src/components/ProtectedRoute.tsx` -- Route guard component**
- Replaces the concept of Next.js middleware
- Wraps protected routes; redirects to `/login` if no session
- Shows a loading state while checking auth

**5. `src/components/PublicRoute.tsx` -- Reverse guard**
- Wraps `/login` and `/register` routes
- Redirects logged-in users to `/dashboard`

**6. Update `src/App.tsx` -- Wire up routes**
- Wrap app in `AuthProvider`
- Add protected routes: `/dashboard`, `/generate`, `/gallery`, `/character`, `/prompt`, `/settings`
- Add public routes: `/login`, `/register`

### What About `server.ts` and `admin.ts`?
- **No server-side client needed** -- Vite is a client-only SPA. Server-side logic belongs in Supabase Edge Functions, which have their own built-in Supabase client via `Deno.env`
- **No admin client in the frontend** -- The `service_role` key must never be in client code. If you need admin operations (e.g., webhook handlers), those go in Supabase Edge Functions where the service role key is available as a secret

### Route Protection Map

| Route | Behavior |
|-------|----------|
| `/dashboard`, `/generate`, `/gallery`, `/character`, `/prompt`, `/settings` | Redirect to `/login` if not authenticated |
| `/login`, `/register` | Redirect to `/dashboard` if already authenticated |
| `/`, `/*` | Public, no protection |

### Technical Details

- Environment variables use `VITE_` prefix (not `NEXT_PUBLIC_`)
- Auth state managed via `onAuthStateChange` listener (set up before `getSession()`)
- Route protection is component-based using React Router wrappers, not file-system middleware
- Placeholder pages will be created for `/login` and `/register` so the routes work immediately
