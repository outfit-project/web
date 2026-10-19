# Vestis web

Responsive React 19 and TypeScript application for email verification, a photo-first wardrobe and scored outfit suggestions. Built with Vite, React Router, TanStack Query, Zustand and Axios.

[Gateway and complete setup](https://github.com/outfit-project/api-gateway#run-all-repositories) · [Auth](https://github.com/outfit-project/auth-service) · [Wardrobe](https://github.com/outfit-project/wardrobe-service) · [Outfit](https://github.com/outfit-project/outfit-service)

## Start this repository

Requirements: Docker with Compose 2.20+. From this repository:

```bash
cp .env.example .env
docker network create vestis-services
docker compose up --build -d --wait --wait-timeout 180
```

PowerShell also supports `cp`. Copy the example only for initial setup and preserve an existing `.env`. Create the shared network once; skip creation if it already exists. Set `VESTIS_NETWORK` to select another pre-created network.

Open `http://localhost:3000`. This starts only the frontend, using files in this repository. Screens load without backend services; API operations need the corresponding services. Nginx proxies `/auth`, `/items` and `/outfits` directly to services on the shared network, so the gateway is optional when using port 3000. Missing APIs return 502. `docker compose down` stops only this frontend.

For complete functionality, start auth, wardrobe, notification, ML and outfit using their own repositories. Match JWT and ML secrets as described in the setup link above. The frontend itself has no secrets. `WEB_PORT` changes its direct host port; API CORS settings need to permit any separately configured API origin.

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

Typed API modules live in [src/api](src/api); shared response types live in [src/types](src/types). See [auth](https://github.com/outfit-project/auth-service), [wardrobe](https://github.com/outfit-project/wardrobe-service) and [outfit](https://github.com/outfit-project/outfit-service) for contracts.

Access/refresh tokens are persisted in `localStorage`. Axios attaches the access token to protected API requests. Concurrent 401 responses share a refresh request; the original request is retried once. Invalid refresh credentials expire the session. Login/logout and cross-tab storage changes clear cached user data; refresh preserves the current user's cache. Session-version checks prevent failed requests from a previous session from affecting a newer one.

This version uses token storage rather than HTTP-only session cookies. The frontend has no server-side rendering or separate backend-for-frontend.

## Local development

Use Node.js 22 in this repository. Backend-dependent flows need independently started services and a gateway, or the frontend container's proxy:

```bash
npm ci
npm run dev
```

Open the Vite address printed in the terminal, normally `http://localhost:5173`. The development server proxies `/auth`, `/items` and `/outfits` to `http://localhost:8080`. The proxy target must be running; Vite does not start backend services. To use the frontend container's API proxy instead of the gateway, set `VITE_DEV_PROXY_TARGET=http://localhost:3000` in your shell before running Vite.

## Configuration

| Setting | Default / behavior |
| --- | --- |
| `VITE_API_URL` | Empty: same-origin requests. Set a public API base URL for a separate origin. |
| `VITE_DEV_PROXY_TARGET` | `http://localhost:8080`; read from the shell environment by `vite.config.ts`. |

[.env.example](.env.example) documents the browser API setting. Existing `.env` files can override it during local builds. Vite substitutes browser settings at build time; changing container runtime environment does not rewrite built JavaScript. Never put secrets in `VITE_` variables. A separate API origin also requires matching backend CORS settings.

## Production container

The Dockerfile runs `npm ci` and `npm run build` using Node 22, then serves `dist` from Nginx on internal port 80 with SPA route fallback. The local Compose passes `VITE_API_URL` as a build argument; its empty default uses Nginx API proxying. Local `.env` files are excluded from the Docker build context.

Frontend Nginx resolves API aliases through Docker DNS (`outfit_auth_api:8000`, `outfit_wardrobe_api:8000`, `outfit_api:8003`). Variable upstreams allow startup without APIs and re-resolve replaced containers. Its health check probes the static root and does not prove backend readiness. The `vestis_frontend:80` alias allows an optional gateway to serve the app at port 8080.

From this repository:

```bash
docker compose ps
docker compose logs -f frontend
```

## Checks and source layout

```bash
npm run lint
npm run build
```

`build` runs TypeScript project compilation followed by Vite. `npm run preview` serves the production bundle for inspection; it does not use the container's API proxy. There is no committed automated browser-test suite. Check `/login`, registration with Mailpit, uploads and suggestions against independently started services for an integration smoke test.

| Directory | Responsibility |
| --- | --- |
| `src/pages` | Registration, verification, login, wardrobe, upload and outfit screens |
| `src/components` | Navigation, cards, icons, auth layout and route guard |
| `src/api` | Typed HTTP requests and refresh interceptor |
| `src/hooks` | Wardrobe polling and mutations |
| `src/store` | Session persistence and cache boundaries |
| `src/types` | API types and display formatting |

`npm run docker:up` and `npm run docker:reload` target only this repository's Compose project; the latter forces container recreation. Create the network and configure `.env` before using them. Validate the Compose configuration with `docker compose --env-file .env.example config --quiet`.
