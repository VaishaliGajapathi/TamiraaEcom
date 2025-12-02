# Tamiraa E-commerce Platform

## Overview
Tamiraa is a full-stack e-commerce platform for furniture and home decor. The project consists of three main components:
1. **Dashboard Frontend** (tamiraa-Dashboard): Admin panel built with React, TypeScript, and Vite
2. **Backend API** (Tamiraa): Node.js/Express API with Sequelize ORM
3. **Customer Frontend** (Tamiraa-UI): Customer-facing store interface

## Current State
- Dashboard frontend is configured and running on port 5000 (accessible via webview)
- Backend is configured to run on port 3000 (accessible on all network interfaces)
- Dashboard currently uses external production API at https://tamiraaapi.tamiraa.com
- Local backend can be run separately for development with proper database configuration

## Recent Changes (December 2, 2025)
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
- **Database**: MySQL
- **ORM**: Sequelize
- **Port**: 3000
- **Authentication**: JWT
- **Key Features**:
  - User authentication
  - Product and variant management
  - Order processing
  - Image upload handling
  - Email notifications

**Note**: The dashboard is currently configured to use the production API at https://tamiraaapi.tamiraa.com. The local backend can be run separately if needed for development with a MySQL database.

### Database Configuration
The backend requires a MySQL database with the following tables:
- Users, Categories, SubCategories
- Products, ProductVariants, ProductVariantChildImages, ProductStock
- Orders, Bills, Cart, Wishlist
- Coupons, HomeBanners, CollectionBanners
- Contacts, Newsletter

**Note**: Database credentials need to be configured via environment variables.

## Environment Variables

### Backend (Tamiraa)
Required in .env file:
- `DB_HOST`: Database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_DIALECT`: mysql
- `DB_PORT`: Database port (default 3306)
- `BASE_URL`: Backend API URL
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

## Admin Credentials
**Default Admin User:**
- Email: `tamiraa@admin`
- Password: `admin@2025`

**To create admin user after database setup:**
```bash
cd Tamiraa
npm run seed
```

This creates the initial admin user for the dashboard.

## Deployment
- Configured as static deployment
- Build command: `npm run build --prefix tamiraa-Dashboard`
- Public directory: `tamiraa-Dashboard/dist`
