const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv');
const initModels = require('./src/models');

// const createRegisterRoutes = require('./src/routes/register.routes');
const createCategoryRoutes = require('./src/routes/category.routes');
const createSubCategoryRoutes = require("./src/routes/subcategory.routes");
const createProductRoutes = require('./src/routes/product.routes');
const createProductVariantRoutes = require('./src/routes/productvariant.routes');
const createUserRoutes = require("./src/routes/auth.routes");
const createHomeBannerRoutes = require("./src/routes/homeBanner.routes");
const createWishlistRoutes = require("./src/routes/wishlist.routes");
const createCartRoutes = require("./src/routes/cart.routes");
const createCouponRoutes = require("./src/routes/coupon.routes");
const createProductVariantChildImageRoutes = require("./src/routes/productVariantChildImage.routes");
const createBillRoutes = require("./src/routes/bill.routes");
const createCollectionBannerRoutes = require("./src/routes/collectionBanner.routes");
const createContactRoutes = require("./src/routes/contact.routes");
const createOrderRoutes = require("./src/routes/order.routes");



// const createVariantRoutes = require('./src/routes/variant.routes');



dotenv.config();
const app = express();  

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const imageBaseUrl = `${BASE_URL}/uploads`;

app.use(express.json());

// Configure CORS
const allowedOrigins = [
  'https://tamiraaadmin.netlify.app',
  'https://tamiraa.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5001',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

(async () => {
  try {
    const { sequelize, User, Category, SubCategory, Product, ProductVariant, ProductVariantChildImage, ProductStock, HomeBanner, Wishlist, Cart, Coupon, CollectionBanner, Bill } = await initModels();

    // Register routes
    // app.use('/api/register', createRegisterRoutes(User));
    app.use("/api/users", createUserRoutes(User));
    app.use('/api/categories', createCategoryRoutes(Category));
    app.use("/api/subcategories", createSubCategoryRoutes(SubCategory, Category));
    app.use("/api/products", require("./src/routes/product.routes")(Product, SubCategory, Category, ProductVariant, ProductVariantChildImage, imageBaseUrl));
    app.use("/api/product-variants", createProductVariantRoutes(ProductVariant, ProductStock, Product, SubCategory, Category, imageBaseUrl));
    app.use("/api/home-banners", createHomeBannerRoutes(HomeBanner, imageBaseUrl));
    app.use("/api/wishlist", createWishlistRoutes(Wishlist, ProductVariant, Product));
    app.use("/api/cart", createCartRoutes(Cart, ProductVariant, Product));
    app.use("/api/coupons", createCouponRoutes(Coupon));
    app.use("/api/product-variant-images", createProductVariantChildImageRoutes(ProductVariantChildImage, imageBaseUrl));
    app.use("/api/product-stock", require("./src/routes/productstock.routes")(ProductStock, ProductVariant));
    app.use("/api/admin", require("./src/routes/admin.routes"));
    const models = await initModels();
    app.use("/api/bill", require("./src/routes/bill.routes")(models.Bill, models.User));
    app.use("/api/collection-banners", createCollectionBannerRoutes(models.CollectionBanner, imageBaseUrl));
    app.use("/api/contacts", createContactRoutes(models.Contact));
    app.use("/api/newsletter", require("./src/routes/newsletter.routes")(models.Newsletter));
    app.use("/api/orders", createOrderRoutes);
    app.use("/api/low-stock", require("./src/routes/productvariant.routes")(
  ProductVariant, ProductStock, Product, SubCategory, Category, imageBaseUrl
));
    
  

    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized successfully.');
    console.log(`🖼 Image Base URL: ${imageBaseUrl}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
})();