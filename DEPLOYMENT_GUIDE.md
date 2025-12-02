# Deployment Guide: Netlify & Vercel

## Database Options (Choose One)

### 1. **PlanetScale (Recommended for MySQL)**
- Free tier: 5GB storage, perfect for your MySQL setup
- No credit card needed
- Works with Sequelize ORM
- URL: `mysql://user:pass@aws.connect.psdb.cloud/tamiraa?sslaccept=strict`

### 2. **Supabase (PostgreSQL)**
- Free tier: 500MB storage
- Real-time capabilities included
- Built-in authentication

### 3. **MongoDB Atlas (NoSQL)**
- Free tier: 512MB storage
- Good for rapid development
- Requires schema changes to your app

### 4. **Firebase (Realtime Database)**
- Free tier: 1GB storage
- Real-time sync
- No SQL support

---

## Deployment Strategy

### **Option A: Netlify (Separate Repos)**
Deploy each app separately (easiest):

1. **Store Frontend** (Tamiraa-UI)
   - GitHub repo: Your-Org/Tamiraa-UI
   - Build: `npm run build`
   - Deploy to: `tamiraa.com`

2. **Admin Dashboard** (tamiraa-Dashboard)
   - GitHub repo: Your-Org/tamiraa-Dashboard
   - Build: `npm run build`
   - Deploy to: `admin.tamiraa.com`

3. **Backend API**
   - Host on Render/Railway (not Netlify - serverless limits)
   - Connect to PlanetScale MySQL
   - Domain: `api.tamiraa.com`

---

### **Option B: Vercel (Monorepo)**
Deploy everything from one repo:

1. **Connect GitHub monorepo** to Vercel
2. **Vercel will auto-detect**:
   - `Tamiraa-UI` → Build & Deploy to `tamiraa.com`
   - `tamiraa-Dashboard` → Build & Deploy to `admin.tamiraa.com`
   - `Tamiraa` → Deploy as Serverless Functions

---

## Setup Steps

### **1. Set Up PlanetScale Database**
```bash
# Sign up: https://planetscale.com
# Create database: tamiraa
# Get connection string: mysql://user:pass@aws.connect.psdb.cloud/tamiraa
```

### **2. Configure Backend Environment**
In `Tamiraa/.env`:
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=<your_user>
DB_PASSWORD=<your_password>
DB_NAME=tamiraa
DB_PORT=3306
DB_DIALECT=mysql
BASE_URL=https://api.yourdomain.com
JWT_SECRET=your-secret-key
```

### **3. Update Frontend API URLs**
Edit `tamiraa-Dashboard/src/utils/api.ts`:
```typescript
export const API_BASE_URL = process.env.VITE_API_URL || "https://api.yourdomain.com";
```

### **4. Deploy to Netlify (Separate approach)**
```bash
# For Tamiraa-UI:
cd Tamiraa-UI
npm run build
# Connect dist/ folder to Netlify

# For tamiraa-Dashboard:
cd tamiraa-Dashboard
npm run build
# Connect dist/ folder to Netlify
```

### **5. Deploy to Vercel (Monorepo approach)**
```bash
# Connect GitHub repo to Vercel
# Vercel auto-detects structure and deploys automatically
```

---

## Domain Configuration

| Domain | Service | Type |
|--------|---------|------|
| `tamiraa.com` | Netlify/Vercel | Store Frontend |
| `www.tamiraa.com` | Netlify/Vercel | Store Frontend (redirect) |
| `admin.tamiraa.com` | Netlify/Vercel | Admin Dashboard |
| `api.tamiraa.com` | Render/Railway | Backend API |

Update your DNS at registrar (GoDaddy, Namecheap, etc.):
- `CNAME tamiraa` → `yoursitename.netlify.app` or `yoursitename.vercel.app`
- `CNAME www` → same as above
- `CNAME admin` → `admin-site.netlify.app` or Vercel app
- `CNAME api` → Backend provider domain

---

## Environment Variables for Deployment

### **Netlify Dashboard:**
Settings → Build & Deploy → Environment → Add variables

### **Vercel Dashboard:**
Settings → Environment Variables → Add variables

Required variables:
- `VITE_API_URL=https://api.yourdomain.com`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

---

## Recommended: Vercel Monorepo
- ✅ Single GitHub connection
- ✅ Auto-deploys on push
- ✅ Free tier: 100GB bandwidth/month
- ✅ Instant rollbacks
- ✅ Built-in analytics

**Start with Vercel for easiest setup!**
