# MASTER WORLD CLASS Landing Page

Next.js landing page for a game website.

## 1) Install

```bash
npm install
```

## 2) Configure

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_META_PIXEL_ID=YOUR_META_PIXEL_ID
NEXT_PUBLIC_LINE_URL=https://lin.ee/YOUR_LINE_LINK
```

The Pixel ID is public browser-side configuration; do not put secret tokens in `NEXT_PUBLIC_*` variables.

## 3) Run

```bash
npm run dev
```

Open http://localhost:3000

## 4) Deploy to Vercel

Push this folder to a new GitHub repository, then import the repository in Vercel.

In Vercel:
Project Settings -> Environment Variables

Add:

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_LINE_URL`

Enable them for Production (and Preview/Development if needed), then redeploy.

## Meta Pixel events

- `PageView` fires on page load.
- `Contact` fires when the visitor clicks a LINE button.

Check Events Manager after the production page receives traffic.

## Important

Replace the placeholder LINE URL with the actual LINE OA URL.
Only describe the game and its offer accurately on the landing page.