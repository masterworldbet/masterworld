FIX for Vercel build error

Replace the repository root file next.config.ts with the included next.config.ts.
This removes output: "export" because static export cannot run Next.js API routes.
Keep this change on the analytics-dashboard branch for testing; do not merge to main yet.
The images.unoptimized setting is preserved.
