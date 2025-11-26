# .env Configuration Guide

Create a file named `.env` in the project root with the following keys:

```
PORT=4000
NODE_ENV=development
CLIENT_URL=https://butcetakip.onrender.com
DATABASE_URL=
JWT_SECRET=
```

## Explanation of each key

1. **PORT** – The port for the Express server. If you change this value, update any frontend requests.
2. **NODE_ENV** – `development`, `production`, or `test`. Controls logging and other environment-specific behavior.
3. **CLIENT_URL** – URL allowed by CORS. For local frontend set it to your dev server (e.g., Vite uses 5173). For production, update to your deployed frontend domain.
4. **DATABASE_URL** – Supabase PostgreSQL connection string. Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require`.
5. **JWT_SECRET** – A long, random string used to sign JSON Web Tokens. Example: run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate one.

## Getting the Supabase DATABASE_URL

1. Log in to https://supabase.com/ and open your project.
2. In the left menu, go to **Project Settings > Database**.
3. Scroll down to the **Connection string** section.
4. Choose the **URI** option and copy the entire string. It looks like:
   ```
   postgresql://postgres.USER:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
5. Append `?sslmode=require` at the end if it is not already present.
6. Paste the final string into `DATABASE_URL` inside `.env`.

> **Important:** Supabase shows a placeholder password in the string. Replace `YOUR_PASSWORD` with the actual password from the **Database Password** field in the same settings page.
