# Tamiraa E-commerce Platform

## Overview
Tamiraa is a full-stack e-commerce platform for furniture and home decor. The project consists of three main components:
1. **Dashboard Frontend** (tamiraa-Dashboard): Admin panel built with React, TypeScript, and Vite
2. **Backend API** (Tamiraa): Node.js/Express API with Sequelize ORM
3. **Customer Frontend** (Tamiraa-UI): Customer-facing store interface

## Current State
- Dashboard frontend is configured and running on port 5000 (accessible via webview)
- Backend deployed to Render at https://tamiraaecom.onrender.com
- Dashboard uses Render backend API
- Customer store (Tamiraa-UI) configured to use Render backend API
- Neon PostgreSQL database for production
- Product images stored as persistent BLOB data in Neon database (never disappear)
- GlamAR virtual try-on integrated and working on product detail pages

## Recent Changes (December 6, 2025)
- **Implemented persistent image storage** - Product images now stored as BLOB in Neon database instead of ephemeral filesystem
- **Created image serving endpoint** - Added `/api/product-variants/:id/image` endpoint to retrieve images from database with proper MIME types
- **Fixed multer storage** - Switched from diskStorage to memoryStorage for direct database uploads
- **Updated image URLs** - All product pages now fetch from database endpoint instead of filesystem
- **Fixed GlamAR virtual try-on** - Button now positioned correctly after product details, uses database image URLs
- **Fixed related products images** - Updated to use new database endpoint

## Previous Changes (December 3, 2025)
- **Fixed product display issue** - Updated all store pages to fetch real products from API instead of static mock data
- **Updated product-category page** - Now fetches categories, subcategories, and products from API with filtering
- **Updated best-seller component** - Shows all products if none are flagged as bestsellers
- **Updated home page** - New Arrivals and Trending sections now show all products if none are flagged
- **Added GlamAR virtual try-on** - Integrated virtual try-on button on product detail pages
- **Fixed TypeScript errors** - Added proper type declarations for GlamAR and fixed Vite environment variables
- **API endpoint updated** - Changed from old production URL to Render backend (https://tamiraaecom.onrender.com)

## Previous Changes (December 2, 2025)
- Installed Node.js 20 and all project dependencies
- Configured Vite to bind to 0.0.0.0:5000 for dashboard frontend
- Updated backend to use port 3000 on all interfaces (avoiding port conflict with frontend)
- Created .gitignore for Node.js projects
- Configured deployment as static site with build output from tamiraa-Dashboard/dist

## Project Architecture

### Dashboard Frontend (tamiraa-Dashboard)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI**: TailwindCSS 4
- **Port**: 5000 (development)
- **Key Features**: 
  - Product management
  - Category and subcategory management
  - Order tracking (new, packaged, dispatched, out for delivery, delivered)
  - Customer management
  - Coupon and banner management
  - Charts and analytics

### Backend API (Tamiraa)
- **Framework**: Express 5
- **Database**: PostgreSQL (Neon)
- **ORM**: Sequelize
- **Port**: 3000
- **Authentication**: JWT
- **Key Features**:
  - User authentication
  - Product and variant management with persistent image storage
  - Order processing
  - Image upload and serving from database
  - Email notifications
  - Image serving endpoint: `/api/product-variants/:id/image`

**Note**: The dashboard and customer store are configured to use the Render backend at https://tamiraaecom.onrender.com with Neon PostgreSQL database.

### Customer Frontend (Tamiraa-UI)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Key Features**:
  - Product browsing and filtering
  - Virtual try-on with GlamAR
  - Shopping cart and wishlist
  - Product detail pages with variant selection
  - Category filtering

### Image Storage Architecture
**Persistent Storage with BLOB in Neon:**
- ProductVariant model stores images as BLOB('long') in `productVariantImage` field
- MIME type stored in `productVariantImageMimeType` field
- Multer configured with memoryStorage for direct database uploads
- No filesystem storage - images survive server restarts
- Images served via `/api/product-variants/:id/image` endpoint with proper Content-Type headers

## Database Configuration
The backend uses PostgreSQL (Neon) with the following key tables:
- Users, Categories, SubCategories
- Products, ProductVariants (with BLOB image storage), ProductVariantChildImages, ProductStock
- Orders, Bills, Cart, Wishlist
- Coupons, HomeBanners, CollectionBanners
- Contacts, Newsletter

**Critical Fields:**
- `ProductVariant.productVariantImage`: BLOB('long') - Binary image data
- `ProductVariant.productVariantImageMimeType`: STRING - Image format (e.g., 'image/jpeg')

## Environment Variables

### Backend (Tamiraa)
Required in .env file:
- `DB_HOST`: Neon database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (neondb)
- `DB_DIALECT`: postgresql
- `DB_PORT`: Database port (usually 5432)
- `BASE_URL`: Backend API URL (https://tamiraaecom.onrender.com)
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time
- `MAIL_USER`: Email service username
- `MAIL_PASS`: Email service password

## Development Workflow
1. Dashboard frontend runs automatically via the "Dashboard Frontend" workflow
2. Backend needs to be started separately with database configured
3. Customer frontend (Tamiraa-UI) can be run separately if needed
4. All product images are persisted in Neon database

## Admin Credentials
**Default Admin User:**
- Email: `admin@tamiraa.com`
- Password: `admin@2025`

**To create admin user after database setup:**
```bash
cd Tamiraa
npm run seed
```

This creates the initial admin user for the dashboard.

## Deployment
- Dashboard deployed to Netlify (tamiraaadmin.netlify.app)
- Store deployed to Netlify (tamiraa.com)
- Backend deployed to Render (tamiraaecom.onrender.com)
- Database: Neon PostgreSQL
- Images: Persistent storage in Neon database via BLOB fields

## Key Integrations
- **GlamAR Virtual Try-On**: Integrated for product visualization on detail pages
- **Currency**: INR-only (removed USD support)
- **Image Storage**: Neon PostgreSQL BLOB storage (replaces ephemeral filesystem)

