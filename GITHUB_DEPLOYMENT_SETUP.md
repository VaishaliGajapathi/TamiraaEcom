# GitHub Automated Deployment Setup

## Quick Start

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: E-commerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tamiraa.git
git push -u origin main
```

---

## Setup Vercel Deployment

### Step 1: Get Vercel Credentials
```bash
# Login to Vercel
vercel login

# Link your project
vercel link

# After linking, you'll see your credentials:
# VERCEL_ORG_ID
# VERCEL_PROJECT_ID
```

### Step 2: Add GitHub Secrets
Go to: `GitHub Repo Settings → Secrets and variables → Actions`

**Add these secrets:**
- `VERCEL_TOKEN` - From Vercel Settings → Tokens
- `VERCEL_ORG_ID` - From `vercel link` output
- `VERCEL_PROJECT_ID` - From `vercel link` output

### Step 3: Configure vercel.json
Already done! The `vercel.json` file handles:
- Building Tamiraa-UI → `tamiraa.com`
- Building tamiraa-Dashboard → `admin.tamiraa.com`
- API routing for backend

---

## Setup Netlify Deployment

### Step 1: Connect to GitHub
1. Login to Netlify
2. Click "Add new site" → "Import an existing project"
3. Select GitHub → Authorize → Choose repository

### Step 2: Get Netlify Credentials

**For Store (Tamiraa-UI):**
1. Create new site in Netlify
2. Go to Settings → API → Applications
3. Create Personal access token
4. Copy Site ID from General settings

**For Admin (tamiraa-Dashboard):**
1. Create another new site in Netlify
2. Repeat above steps

### Step 3: Add GitHub Secrets
Go to: `GitHub Repo Settings → Secrets and variables → Actions`

**Add these secrets:**
- `NETLIFY_AUTH_TOKEN` - Personal access token from Netlify
- `NETLIFY_SITE_ID_STORE` - Site ID for Tamiraa-UI
- `NETLIFY_SITE_ID_ADMIN` - Site ID for tamiraa-Dashboard
- `VITE_API_URL` - Your API endpoint (https://api.yourdomain.com)

### Step 4: Configure netlify.toml
Already done! Each site will auto-build on push.

---

## Database Setup (PlanetScale)

### Create MySQL Database
1. Sign up at https://planetscale.com
2. Create database: `tamiraa`
3. Get connection string: `mysql://user:pass@aws.connect.psdb.cloud/tamiraa`

### Add to Backend Environment
In Vercel/Netlify deployment settings:
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=<username>
DB_PASSWORD=<password>
DB_NAME=tamiraa
DB_PORT=3306
DB_DIALECT=mysql
```

---

## How It Works

### On Every Push to Main:
1. ✅ GitHub Actions triggers
2. ✅ Installs dependencies
3. ✅ Builds both frontends
4. ✅ Deploys to Vercel/Netlify automatically
5. ✅ Your domain updates automatically

### Deployment Workflow:
```
You push code to GitHub
    ↓
GitHub Actions starts
    ↓
Builds Tamiraa-UI → Deploys to tamiraa.com
Builds tamiraa-Dashboard → Deploys to admin.tamiraa.com
    ↓
Deployment complete! 🚀
```

---

## Deployment Status

### Check Deployments:
- **Vercel:** https://vercel.com/dashboard
- **Netlify:** https://app.netlify.com/

### View GitHub Actions:
- https://github.com/YOUR_USERNAME/tamiraa/actions

---

## Environment Variables Checklist

**Frontend (.env.production)**
- [ ] `VITE_API_URL=https://api.yourdomain.com`

**Backend Secrets (in Vercel/Netlify)**
- [ ] `DB_HOST`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `DB_NAME`
- [ ] `JWT_SECRET`
- [ ] `ADMIN_USERNAME`
- [ ] `ADMIN_PASSWORD`

---

## Troubleshooting

### Build Fails?
Check GitHub Actions logs:
1. Go to Actions tab
2. Click on failed workflow
3. Expand job logs

### Deployment Fails?
Check Vercel/Netlify dashboard for error messages

### Still Not Working?
- Verify all secrets are set correctly
- Ensure Node version is compatible (v20+)
- Check build commands in vercel.json and netlify.toml
