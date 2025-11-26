# Deploying to Render (Free Tier)

Render offers a forever-free "Web Service" plan that can run this Express API. Follow these steps:

1. **Create a Git repository**
   - Inside the project folder run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - Push to GitHub, GitLab, or Bitbucket (Render pulls from these providers).

2. **Prepare environment variables**
   - On Render you will need the exact same keys used in `.env` locally: `PORT`, `NODE_ENV`, `CLIENT_URL`, `DATABASE_URL`, `JWT_SECRET`.
   - Set `NODE_ENV=production` and choose a port (Render injects `PORT` automatically, but keep it defined for local dev too).
   - Use the Supabase `DATABASE_URL` (with `sslmode=require`).

3. **Create the Render service**
   - Sign in to https://render.com/ and click **New > Web Service**.
   - Connect your repo and select the main branch.
   - For the **Build Command** enter:
     ```
     npm install && npx prisma migrate deploy
     ```
   - For the **Start Command** enter:
     ```
     npm start
     ```
   - Choose the **Free** instance type.

4. **Run database migrations in production**
   - Render runs `npx prisma migrate deploy` during each deploy (from the build command above), applying new migrations to Supabase automatically.

5. **Redeploy on changes**
   - Push commits to the connected branch; Render redeploys automatically.

6. **Testing**
   - Once deployed, Render provides a public URL such as `https://budget-api.onrender.com`.
   - Update your frontend `API_BASE_URL` (or equivalent) to point to this URL.

> **Tip:** Keep an eye on Render's dashboard logs to ensure migrations succeed and the server starts without errors.
