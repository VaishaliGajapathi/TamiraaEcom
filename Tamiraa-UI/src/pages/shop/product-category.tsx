import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavbarOne from "../../components/navbar/navbar-one";
import bg from '../../assets/img/shortcode/breadcumb.jpg'
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import { API_BASE_URL } from "../../utils/api";
import { Price } from "../../context/CurrencyContext";
import { LuEye, LuHeart } from "react-icons/lu";
import { RiShoppingBag2Line } from "react-icons/ri";
import { getStoredUser } from "../../utils/user";
import Aos from "aos";

interface Category {
  categoryId: number;
  categoryName: string;
}

interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
}

interface Product {
  productId: number;
  productName: string;
  productOfferPrice: number;
  productMrpPrice: number;
}

interface Variant {
  productVariantId: number;
  productId: number;
  productVariantImage: string;
  stockQuantity: number;
  Product: Product;
}

export default function ProductCategory() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const params = useParams();
  const urlCategoryId = params.categoryId ? parseInt(params.categoryId) : null;

  const showModal = (msg: string) => {
    setModalMessage(msg);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2500);
  };

  useEffect(() => {
    Aos.init();

    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));

    fetch(`${API_BASE_URL}/api/subcategories`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setSubCategories(data.data);
        }
      })
      .catch(err => console.error("Error fetching subcategories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/product-variants`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setVariants(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching variants:", err);
        setLoading(false);
      });
  }, []);

  const filteredVariants = variants.filter(variant => {
    if (selectedCategory && variant.Product) {
      const product = variant.Product as any;
      if (product.categoryId !== selectedCategory) return false;
    }
    if (selectedSubCategory && variant.Product) {
      const product = variant.Product as any;
      if (product.subCategoryId !== selectedSubCategory) return false;
    }
    return true;
  });

  const handleAddToCart = async (variant: Variant) => {
    try {
      const user = getStoredUser();
      if (!variant?.productVariantId) {
        showModal('No product variant selected');
        return;
      }

      if (user?.id) {
        const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productVariantId: variant.productVariantId,
            quantity: 1,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          showModal(data.message === 'Already in cart' ? '🛍️ Already in your cart' : '🎁 Added to cart');
        } else {
          showModal(data.message || 'Failed to add to cart');
        }
        return;
      }

      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const exists = guestCart.find((item: any) => item.productVariantId === variant.productVariantId);
      if (exists) {
        showModal('🛍️ Already in your cart');
      } else {
        guestCart.push({
          productVariantId: variant.productVariantId,
          productName: variant.Product?.productName,
          price: variant.Product?.productOfferPrice,
          image: variant.productVariantImage,
          quantity: 1,
        });
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        showModal('🎁 Added to cart');
      }
    } catch (err) {
      console.error(err);
      showModal('Something went wrong');
    }
  };

  const handleAddToWishlist = async (variant: Variant) => {
    try {
      const user = getStoredUser();
      if (!variant?.productVariantId) {
        showModal('No product variant selected');
        return;
      }

      if (user?.id) {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productVariantId: variant.productVariantId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          showModal(data.message === 'Product already in wishlist' ? '💖 Already in wishlist' : '💖 Added to wishlist');
        } else {
          showModal(data.message || 'Failed to add to wishlist');
        }
        return;
      }

      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const exists = guestWishlist.find((item: any) => item.productVariantId === variant.productVariantId);
      if (exists) {
        showModal('💖 Already in wishlist');
      } else {
        guestWishlist.push({
          productVariantId: variant.productVariantId,
          productName: variant.Product?.productName,
          price: variant.Product?.productOfferPrice,
          image: variant.productVariantImage,
        });
        localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
        showModal('💖 Added to wishlist');
      }
    } catch (err) {
      console.error(err);
      showModal('Something went wrong');
    }
  };

  return (
    <>
      <NavbarOne />
      <div className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70" style={{ backgroundImage: `url(${bg})` }}>
        <div className="text-center w-full">
          <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">Shop</h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li><Link to="/">Home</Link></li>
            <li>/</li>
            <li className="text-primary">Shop</li>
          </ul>
        </div>
      </div>

      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                      className={`w-full text-left px-3 py-2 rounded ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.categoryId}>
                      <button
                        onClick={() => { setSelectedCategory(cat.categoryId); setSelectedSubCategory(null); }}
                        className={`w-full text-left px-3 py-2 rounded ${selectedCategory === cat.categoryId ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {cat.categoryName}
                      </button>
                    </li>
                  ))}
                </ul>

                {selectedCategory && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 mt-6">Subcategories</h3>
                    <ul className="space-y-2">
                      {subCategories
                        .filter(sub => sub.categoryId === selectedCategory)
                        .map(sub => (
                          <li key={sub.subCategoryId}>
                            <button
                              onClick={() => setSelectedSubCategory(sub.subCategoryId)}
                              className={`w-full text-left px-3 py-2 rounded ${selectedSubCategory === sub.subCategoryId ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                              {sub.subCategoryName}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </>
                )}

                <h3 className="text-xl font-semibold mb-4 mt-6">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Under ₹500</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>₹1000 - ₹2000</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Above ₹2000</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredVariants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">No products found in this category.</p>
                </div>
              ) : (
                <div data-aos="fade-up" data-aos-delay="200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                    {filteredVariants.map((variant) => (
                      <div key={variant.productVariantId} className="group">
                        <div className="relative overflow-hidden">
                          <Link to={`/product-details/${variant.productId}?variant=${variant.productVariantId}`}>
                            <img
                              src={`${API_BASE_URL}/uploads/${variant.productVariantImage}`}
                              alt={variant.Product?.productName}
                              className="w-full transform duration-300 group-hover:scale-110"
                            />
                          </Link>
                          {variant.stockQuantity === 0 && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          )}
                          <div className="absolute w-11/12 h-[91.6666%] top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-white dark:bg-title bg-opacity-70 dark:bg-opacity-70 flex items-end p-5 scale-110 opacity-0 duration-200 group-hover:scale-100 group-hover:opacity-100">
                            <div className="absolute z-10 top-5 right-5 flex flex-col items-end gap-3">
                              <button
                                onClick={() => handleAddToWishlist(variant)}
                                className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden"
                              >
                                <LuHeart className="dark:text-white size-6" />
                                <span className="mt-1">Add to wishlist</span>
                              </button>
                              <button
                                onClick={() => handleAddToCart(variant)}
                                className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden"
                              >
                                <RiShoppingBag2Line className="dark:text-white size-6" />
                                <span className="mt-1">Add to Cart</span>
                              </button>
                              <Link
                                to={`/product-details/${variant.productId}?variant=${variant.productVariantId}`}
                                className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden"
                              >
                                <LuEye className="dark:text-white size-6" />
                                <span className="mt-1">Quick View</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-6">
                          <div className="flex items-center gap-2">
                            <h5 className="leading-none dark:text-white font-primary text-lg font-medium">
                              <Price value={variant.Product?.productOfferPrice || 0} />
                            </h5>
                            {variant.Product?.productMrpPrice > variant.Product?.productOfferPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                <Price value={variant.Product?.productMrpPrice} />
                              </span>
                            )}
                          </div>
                          <h5 className="text-lg md:text-xl font-normal dark:text-white leading-[1.5] mt-2">
                            <Link to={`/product-details/${variant.productId}?variant=${variant.productVariantId}`}>
                              {variant.Product?.productName}
                            </Link>
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[100000]">
          <div className="bg-white dark:bg-title p-6 rounded-2xl shadow-lg text-center w-[300px]">
            <p className="text-lg font-medium text-gray-800 dark:text-white">{modalMessage}</p>
          </div>
        </div>
      )}

      <FooterOne />
      <ScrollToTop />
    </>
  );
}
