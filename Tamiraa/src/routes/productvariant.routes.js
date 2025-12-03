const express = require("express");
const router = express.Router();
const multer = require("../middlewares/appStorageMiddleware"); // <-- use app storage middleware
const productVariantController = require("../controllers/productVariantController");

module.exports = (ProductVariant, ProductStock, Product, SubCategory, Category, imageBaseUrl) => {
  // CREATE
  router.post(
  "/",
  multer.fields([
    { name: "productVariantImage", maxCount: 1 },
  ]),
  productVariantController.createProductVariant(ProductVariant, ProductStock, imageBaseUrl)
);

  // GET ALL
  router.get("/", productVariantController.getProductVariants(ProductVariant, Product, SubCategory, Category, ProductStock));

  // GET BY ID
  router.get("/:id", productVariantController.getProductVariantById(ProductVariant, Product, SubCategory, Category, ProductStock));

  // UPDATE
  router.put(
  "/:id",
  multer.fields([
    { name: "productVariantImage", maxCount: 1 },
  ]),
  productVariantController.updateProductVariant(ProductVariant, ProductStock, imageBaseUrl)
);
 
  // DELETE
  router.delete("/:id", productVariantController.deleteProductVariant(ProductVariant));

  // GET image from database
  router.get("/image/:id", async (req, res) => {
    try {
      const variant = await ProductVariant.findByPk(req.params.id);
      if (!variant || !variant.imageData) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.set('Content-Type', 'image/jpeg');
      res.send(variant.imageData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get(
  "/",
  productVariantController.getLowStockProducts(ProductVariant, ProductStock, Product)
);

  return router;
};
