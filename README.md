# Vestis web

Responsive React 19 and TypeScript application for email verification, a photo-first wardrobe and scored outfit suggestions. Built with Vite, React Router, TanStack Query, Zustand and Axios.

[Project overview and screenshots](../../README.md) · [Gateway](../../backend/api-gateway/README.md) · [Verification record](../../docs/verification.md)

## Screens and behavior

| Browser route | Purpose |
| --- | --- |
| `/register` | Start account registration |
| `/verify` | Confirm the emailed six-digit code or request another |
| `/login` | Sign in using username/password |
| `/wardrobe` | Owner's items, metadata, processing states, retry and confirmed deletion |
| `/upload` | Preview and upload one garment photo without metadata forms |
| `/outfit` | Request one scored outfit and display its pieces |

Wardrobe, upload and outfit routes require a session. Unknown paths redirect to login. The wardrobe polls every three seconds while any item is `pending` or `processing` and stops polling when none remain. Failed items expose the backend explanation and retry action. Cards display the category, subtype, style and color returned by the API.

The upload form accepts JPEG/PNG/WebP and performs client-side checks; the wardrobe API remains authoritative for content, byte and pixel validation. Outfit requests use `top_n=5` and render `{items, score, message}`. An incomplete wardrobe produces a helpful empty state rather than a fabricated suggestion.

## API and session integration

Typed API modules live in [src/api](src/api); shared response types live in [src/types](src/types). See [auth](../../backend/auth-service/README.md), [wardrobe](../../backend/wardrobe-service/README.md) and [outfit](../../backend/outfit-service/README.md) for contracts.

Access/refresh tokens are persisted in `localStorage`. Axios attaches the access token to protected API requests. Concurrent 401 responses share a refresh request; the original request is retried once. Invalid refresh credentials expire the session. Login/logout and cross-tab storage changes clear cached user data; refresh preserves the current user's cache. Session-version checks prevent failed requests from a previous session from affecting a newer one.

This version uses token storage rather than HTTP-only session cookies. The frontend has no server-side rendering or separate backend-for-frontend.

## Local development

Start the full stack using the [root instructions](../../README.md#run-locally), then use Node.js 22 in this directory:

```bash
npm ci
npm run dev
```

Open the Vite address printed in the terminal, normally `http://localhost:5173`. The development server proxies `/auth`, `/items` and `/outfits` to `http://localhost:8080`. The gateway/stack must be running; Vite does not start backend services.

## Configuration

| Setting | Default / behavior |
| --- | --- |
| `VITE_API_URL` | Empty: same-origin requests. Set a public API base URL for a separate origin. |
| `VITE_DEV_PROXY_TARGET` | `http://localhost:8080`; read from the shell environment by `vite.config.ts`. |

[.env.example](.env.example) documents the browser API setting. Existing `.env` files can override it during local builds. Vite substitutes browser settings at build time; changing container runtime environment does not rewrite built JavaScript. Never put secrets in `VITE_` variables. A separate API origin also requires matching backend CORS settings.

## Production container

The Dockerfile runs `npm ci` and `npm run build` using Node 22, then serves `dist` from Nginx on internal port 80 with SPA route fallback. Root Compose passes an empty `VITE_API_URL`; the public gateway supplies same-origin routing. Local `.env` files are excluded from the Docker build context.

The frontend container serves static files only: opening it without the gateway does not provide API proxying. Its health check probes the static root and does not prove backend readiness.

From the project root:

```bash
docker compose up --build -d --wait --wait-timeout 900
docker compose logs -f frontend gateway
```

## Checks and source layout

```bash
npm run lint
npm run build
```

`build` runs TypeScript project compilation followed by Vite. `npm run preview` serves the production bundle for inspection; it is not the full Compose environment. There is no committed automated browser-test suite. Actual browser verification and desktop/mobile screenshots are recorded in [docs/verification.md](../../docs/verification.md).

| Directory | Responsibility |
| --- | --- |
| `src/pages` | Registration, verification, login, wardrobe, upload and outfit screens |
| `src/components` | Navigation, cards, icons, auth layout and route guard |
| `src/api` | Typed HTTP requests and refresh interceptor |
| `src/hooks` | Wardrobe polling and mutations |
| `src/store` | Session persistence and cache boundaries |
| `src/types` | API types and display formatting |

`npm run docker:up` and `npm run docker:reload` target the root Compose stack; the latter forces container recreation. The service-local Compose file also forwards to the root project.
