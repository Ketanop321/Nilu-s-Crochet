# Shadcn-UI Template Usage Instructions

## technology stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

All shadcn/ui components have been downloaded under `@/components/ui`.

## File Structure

- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration file
- `tailwind.config.js` - Tailwind CSS configuration file
- `package.json` - NPM dependencies and scripts
- `src/app.tsx` - Root component of the project
- `src/main.tsx` - Project entry point
- `src/index.css` - Existing CSS configuration
- `src/pages/Index.tsx` - Home page logic

## Components

- All shadcn/ui components are pre-downloaded and available at `@/components/ui`

## Styling

- Add global styles to `src/index.css` or create new CSS files as needed
- Use Tailwind classes for styling components

## Development

- Import components from `@/components/ui` in your React components
- Customize the UI by modifying the Tailwind configuration

## Note

- The `@/` path alias points to the `src/` directory
- In your typescript code, don't re-export types that you're already importing

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Add Dependencies**

```shell
pnpm add some_new_dependency

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```

---

## Deployment (Frontend on Vercel, Backend on Render)

### 1) Backend: Render

- Repo root path for the server: `server/`
- Start command: `node server/index.js`
- Environment variables (add in Render Dashboard or `.env`):
  - `MONGODB_URI` (required)
  - `JWT_SECRET` (required)
  - `FRONTEND_URL` (required) e.g. `https://<your-vercel-app>.vercel.app`
  - `PORT` (Render sets automatically, default 3002 if running locally)
  - Optional: `PUBLIC_BASE_URL` (e.g. `https://<your-render-app>.onrender.com`)

Uploads are saved to `public/uploads`. Render disk is ephemeral; acceptable for demos. For persistence in production, switch to S3/Cloudinary.

Routes exposed by the API:
- `/api/auth/*` (auth)
- `/api/products/*` (products CRUD)
- `/api/upload` (single image upload, field name: `image`)
- `/uploads/*` (static file serving)

### 2) Frontend: Vercel

- Framework: Vite + React + TS
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables (Vercel Project Settings):
  - `VITE_API_BASE_URL` = `https://<your-render-app>.onrender.com/api`

The app uses `VITE_API_BASE_URL` at runtime for all API requests and to render absolute image URLs.

### 3) Local Development

- `vite.config.ts` proxies both `/api` and `/uploads` to `http://localhost:3002`.
- Start backend locally: `npm run dev:server` (uses `server/index.js`).
- Start frontend locally: `npm run dev:client` (Vite on port 5175).

### 4) Environment Examples

- Frontend example: `.env.example` at repo root
- Backend example: `server/.env.example`

Copy them to `.env` and `server/.env` and fill values before deploying.

