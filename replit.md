# Tamiraa E-commerce Platform

## Overview
Tamiraa is a full-stack e-commerce platform for furniture and home decor. The project consists of three main components:
1. **Dashboard Frontend** (tamiraa-Dashboard): Admin panel built with React, TypeScript, and Vite
2. **Backend API** (Tamiraa): Node.js/Express API with Sequelize ORM
3. **Customer Frontend** (Tamiraa-UI): Customer-facing store interface

## Current State
- ✅ Dashboard frontend running on port 5000 (accessible via webview)
- ✅ Backend deployed to Render at https://tamiraaecom.onrender.com
- ✅ Customer store (Tamiraa-UI) fully functional with API proxy
- ✅ All product images loading from Neon database
- ✅ GlamAR virtual try-on integrated and working
- ✅ Neon PostgreSQL database for production

## Latest Updates (December 6, 2025)
- **Fixed persistent image storage** - Images stored as BLOB in Neon, served via `/api/product-variants/:id/image` endpoint
- **Fixed GlamAR button positioning** - Now appears correctly after product details, works with database images
- **Implemented Vite API proxy** - Dev server proxies API requests through Vite to avoid CORS issues
- **Fixed API_BASE_URL for development** - Uses relative paths in dev, production URL in production builds
- **Disabled HMR warnings** - Configured Vite with stable development setup
- **All product images now load successfully** - Both main product images and related product thumbnails

## Project Architecture

### Dashboard Frontend (tamiraa-Dashboard)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI**: TailwindCSS 4
- **Port**: 5000 (development)
- **Features**: Product, category, order, customer, coupon, and banner management

### Backend API (Tamiraa)
- **Framework**: Express 5
- **Database**: PostgreSQL (Neon)
- **ORM**: Sequelize
- **Port**: 3000
- **Key Endpoints**:
  - `/api/product-variants/:variantId/image` - Serves product images from database
  - `/api/products` - Product listing with variants
  - `/api/home-banners` - Home page banners
  - All standard REST endpoints for products, orders, users, etc.

### Customer Frontend (Tamiraa-UI)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with API proxy
- **Features**: Product browsing, virtual try-on, cart, wishlist, filtering
- **Development**: Uses Vite proxy to `/api` routes → production backend
- **Production**: Direct API calls to https://tamiraaecom.onrender.com

## Image Storage Architecture
- **BLOB Storage**: ProductVariant.productVariantImage stores binary image data in Neon
- **MIME Type**: ProductVariant.productVariantImageMimeType tracks image format
- **Upload Handling**: Multer configured with memoryStorage (no disk writes)
- **Serving**: `/api/product-variants/:id/image` endpoint with proper Content-Type headers
- **Persistence**: Images survive server restarts - backed by Neon database

## Development Workflow

### Local Development (Port 5000)
```bash
# Start E-commerce Store
cd Tamiraa-UI && npm run dev

# Vite proxy automatically routes:
# /api/* → https://tamiraaecom.onrender.com/api/*
```

### Production Deployment
- **Store**: Netlify (auto-deploys from GitHub)
- **Backend**: Render (auto-deploys from GitHub)
- **Database**: Neon PostgreSQL
- **Images**: Persistent BLOB storage in Neon

## Deployment Checklist
To push changes to production:

```bash
# Backend changes
cd Tamiraa && git add -A && git commit -m "message" && git push origin main

# Frontend changes
cd Tamiraa-UI && git add -A && git commit -m "message" && git push origin main
```

Netlify and Render auto-deploy within 2-3 minutes of GitHub push.

## Admin Credentials
- **Email**: admin@tamiraa.com
- **Password**: admin@2025

## Key Features Implemented
✅ Persistent image storage in PostgreSQL
✅ GlamAR virtual try-on on product detail pages
✅ INR-only pricing (USD removed)
✅ Product filtering by category and price range
✅ Shopping cart and wishlist functionality
✅ API proxy for seamless development workflow
✅ Responsive design with TailwindCSS
✅ Real-time product data from backend API

## Known Limitations
- Swiper carousel shows warning about loop mode (harmless, only affects empty states)
- Home banners currently empty (optional feature)
- No SMS/payment integration yet

## Next Steps
1. Upload more products through the dashboard
2. Create home page banners for promotions
3. Test virtual try-on across different devices
4. Monitor image loading performance in production
5. Consider adding payment integration (Stripe/Razorpay)

