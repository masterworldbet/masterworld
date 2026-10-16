# Masterworld analytics dashboard setup

## 1. Create the database

1. Create/open a project at https://supabase.com/.
2. Open **SQL Editor**.
3. Run the SQL in `supabase/analytics-schema.sql`.
4. In **Project Settings -> API**, copy the Project URL and the `service_role` key. Keep the service-role key private.

## 2. Add Vercel environment variables

In **Vercel -> Project -> Settings -> Environment Variables**, add these variables for Production (and Preview if you want analytics there):

- `SUPABASE_URL`: your Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: your Supabase service-role key (server-only)
- `ADMIN_PASSWORD`: a long, unique dashboard password
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters

Do not use the `NEXT_PUBLIC_` prefix for any of these values. Redeploy after saving the variables.

## 3. Open the dashboard

Visit `/admin/analytics`. If not signed in, the page redirects to `/admin/analytics/login`.

## 4. What is tracked

- `page_view`: each time the landing page is mounted in a browser
- `register_click`: each click on the existing registration link
- Referrer hostname and broad device category are stored when available

No IP address, name, email, password, or registration details are collected. Browser privacy settings and ad blockers can prevent some events from being recorded. A click does not mean a registration succeeded. The dashboard currently supports 7, 30, and 90-day views and displays up to 10,000 events per selected period.

## 5. Deploy

Commit/push the changed files to the GitHub repository connected to Vercel. Vercel will deploy automatically. The existing landing page layout, registration URL, image assets, Meta Pixel setup, and LINE-related environment variable are left unchanged apart from adding the non-blocking analytics event call to the landing page.
