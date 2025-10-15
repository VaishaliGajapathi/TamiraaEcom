
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
// import bg from '../../assets/img/shortcode/breadcumb.jpg'
import cardImg from '../../assets/img/new_prods/prod_1.jpg'
import { LuEye, LuHeart } from 'react-icons/lu'
import { RiShoppingBag2Line } from 'react-icons/ri'
import { Price } from '../../context/CurrencyContext'
import { useCurrency } from '../../context/CurrencyContext'
// import SelectOne from '../../components/product/select-one'
import NavbarFour from '../../components/navbar/navbar-four'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'
import { getStoredUser } from '../../utils/user'; 
import MultiRangeSlider from 'multi-range-slider-react'
import Aos from 'aos'
import { API_BASE_URL } from "../../utils/api";

interface SubCategory {
  subCategoryId: number
  subCategoryName: string
}

interface Product {
  productId: number
  productName: string
  productOfferPrice: number
  productImage: string
  tag?: string
  subCategoryId: number
}

interface Variant {
  productVariantId: number
  productVariantImage: string
  Product: Product
  stockQuantity: number
}

export default function ShopV2() {
  const navigate = useNavigate();
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [ ,setProducts] = useState<Product[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { convertPriceString } = useCurrency()
    



    const showModal = (msg: string) => {
      setModalMessage(msg);
      setModalOpen(true);
    
      // auto-close after 2.5 sec
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    };




  const handleCategoryChange = (subCategoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    )
  }

  // 🔹 Category & Price filtering
  const filteredVariants = variants.filter((v) => {
    const product = v.Product || {}
    const inCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(product.subCategoryId)
        : true

    const inPriceRange =
      product.productOfferPrice >= minValue &&
      product.productOfferPrice <= maxValue

    return inCategory && inPriceRange
  })


// const handleAddToCart = async (variant: Variant) => {
//   try {
//     // const user = JSON.parse(localStorage.getItem("user") || "{}");

//     const user = getStoredUser();

//     if (!user?.id) {
//       showModal("Please login to add to cart");
//       return;
//     }

//     if (!variant?.productVariantId) {
//       showModal("No product variant selected");
//       return;
//     }

//     const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,  // same as ProductDetails
//         productVariantId: variant.productVariantId,
//         quantity: 1, // default 1 from shop grid
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       if (data.message === "Already in cart") {
//         // 🔹 Don't increase qty, just inform user
//         showModal("🛍️ This product is already in your cart");

//       } else {
//         showModal("🎁 Added to your shopping bag – happy shopping!");
//       }
//     } else {
//       showModal(data.message || " Failed to add to cart");
//     }
//   } catch (err) {
//     console.error("Add to cart error:", err);
//     showModal("❌ Something went wrong");
//   }
// };




  const handleAddToCart = async (variant: Variant) => {
  try {
    const user = getStoredUser();

    // 🧩 Validate variant
    if (!variant?.productVariantId) {
      showModal('No product variant selected');
      return;
    }

    // ✅ Logged-in user flow
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
        if (data.message === 'Already in cart') {
          showModal('🛍️ This product is already in your cart');
        } else {
          showModal('🎁 Added to your shopping bag – happy shopping!');
        }
      } else {
        showModal(data.message || 'Failed to add to cart');
      }

      return;
    }

    // 🚀 Guest user — localStorage cart logic
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

    const existingItem = guestCart.find(
      (item: any) => item.productVariantId === variant.productVariantId
    );

    if (existingItem) {
      // ✅ Same product already exists
      showModal('🛍️ This product is already in your cart');
    } else {
      // 🆕 Add new product
      guestCart.push({
        productVariantId: variant.productVariantId,
        productName: variant?.Product?.productName,
        price: variant?.Product?.productOfferPrice,
        image: variant?.productVariantImage,
        quantity: 1,
      });

      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      showModal('🎁 Added to your shopping bag');
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    showModal('❌ Something went wrong');
  }
};


// 🔹 Add to Wishlist
// const handleAddToWishlist = async (variant: Variant) => {
//   try {
//     // const user = JSON.parse(localStorage.getItem("user") || "{}");

//     const user = getStoredUser();

//     if (!user?.id) {
//       showModal("Please login to add to wishlist");
//       return;
//     }

//     if (!variant?.productVariantId) {
//       showModal("No product variant selected");
//       return;
//     }

//     const res = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,  //  include userId
//         productVariantId: variant.productVariantId,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       if (data.message === "Product already in wishlist") {
//         showModal("💖 Product already in wishlist");
        
//       } else {
//         showModal("💖 Added to wishlist");
//       }
//     } else {
//       showModal(data.message || "❌ Failed to add to wishlist");
//     }
//   } catch (err) {
//     console.error("Wishlist error:", err);
//     showModal("❌ Something went wrong");
//   }
// };


        const handleAddToWishlist = async (variant: Variant) => {
          try {
            const user = getStoredUser();
        
            if (!variant?.productVariantId) {
              showModal('No product variant selected');
              return;
            }
        
            if (user?.id) {
              // ✅ Logged-in: API call
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
                showModal(
                  data.message === 'Product already in wishlist'
                    ? '💖 Product already in wishlist'
                    : '💖 Added to wishlist'
                );
              } else {
                showModal(data.message || '❌ Failed to add to wishlist');
              }
              return;
            }
        
            // 🚀 Guest user: save in localStorage
            const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        
            const exists = guestWishlist.find(
              (item: any) => item.productVariantId === variant.productVariantId
            );
        
            if (exists) {
              showModal('💖 Product already in wishlist');
            } else {
              guestWishlist.push({
                productVariantId: variant.productVariantId,
                productName: variant.Product.productName,
                price: variant.Product.productOfferPrice,
                image: variant.productVariantImage,
              });
              localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
              showModal('💖 Added to wishlist');
            }
          } catch (err) {
            console.error('Wishlist error:', err);
            showModal('❌ Something went wrong');
          }
        };

        

  // 🔹 Fetch Variants
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/product-variants`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setVariants(data.data)
        }
      })
      .catch((err) => console.error('Error fetching variants:', err))
  }, [])

  // 🔹 Fetch Products (only to set price range & category matching)
  useEffect(() => {
    Aos.init()
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const productsData = Array.isArray(data) ? data : data.data || []
        setProducts(productsData)

        if (productsData.length > 0) {
          const maxPrice = Math.max(
            ...productsData.map((p: Product) => p.productOfferPrice)
          )
          setMaxValue(maxPrice)
        }
      })
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  // 🔹 Fetch Subcategories
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/subcategories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSubCategories(data)
        } else if (data.data) {
          setSubCategories(data.data)
        }
      })
      .catch((err) => console.error('Error fetching subcategories:', err))
  }, [])

  useEffect(() => {
    Aos.init()
  })

  return (
    <>
      <NavbarFour />

      {/* Banner */}
      <div
        className="relative flex items-center justify-center gap-4 flex-wrap 
                           w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] 
                           bg-cover bg-center bg-no-repeat 
                           pt-16 sm:pt-20 md:pt-24 lg:pt-32 
                           before:absolute before:inset-0 before:bg-title before:bg-opacity-50"
        style={{ backgroundImage: 'url("/src/assets/img/shortcode/breadcumb.jpg")' }} 
      >
        <div className="relative text-center w-full z-10">
          <h2 className="text-white text-3xl sm:text-4xl md:text-[40px] font-normal leading-none">
            Shop
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>  
            <li className="text-primary">Shop</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="s-py-100">
        <div className="container">
          <div className="max-w-[1477px] mx-auto flex items-start justify-between gap-8 md:gap-10 flex-col lg:flex-row">
            {/* Sidebar */}
            <div
              className="grid gap-[15px] lg:max-w-[300px] w-full sm:grid-cols-2 lg:grid-cols-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {/* Categories */}
              <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px]">
                <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
                  Categories
                </h4>
                <div className="grid gap-5">
                  {subCategories.map((cat) => (
                    <label
                      key={cat.subCategoryId}
                      className="categoryies-iteem flex items-center gap-[10px]"
                    >
                      <input
                        className="appearance-none hidden"
                        type="checkbox"
                        value={cat.subCategoryId}
                        checked={selectedCategories.includes(cat.subCategoryId)}
                        onChange={() => handleCategoryChange(cat.subCategoryId)}
                      />
                      <span className="w-4 h-4 rounded-[5px] border border-title dark:border-white flex items-center justify-center duration-300">
                        <svg
                          className={`duration-300 ${
                            selectedCategories.includes(cat.subCategoryId)
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                          width="9"
                          height="8"
                          viewBox="0 0 9 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.05203 7.04122C2.87283 7.04122 2.69433 6.97322 2.5562 6.83864L0.532492 4.8553C0.253409 4.58189 0.249159 4.13351 0.522576 3.85372C0.796701 3.57393 1.24578 3.57039 1.52416 3.84309L3.05203 5.34122L7.61512 0.868804C7.89491 0.595387 8.34328 0.59822 8.6167 0.87872C8.89082 1.1578 8.88657 1.60689 8.60749 1.8803L3.54787 6.83864C3.40974 6.97322 3.23124 7.04122 3.05203 7.04122Z"
                            fill="#BB976D"
                          />
                        </svg>
                      </span>
                      <span className="text-title dark:text-white">
                        {cat.subCategoryName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px] rounded-lg">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <h4 className="font-medium leading-none text-xl sm:text-2xl">
                    Price Range
                  </h4>
                  <span
                    className={`transition-transform duration-300 ${
                      isPriceOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isPriceOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div id="slider-container">
                    <MultiRangeSlider
                      ruler={false}
                      label={false}
                      min={0}
                      max={10000}
                      step={10}
                      minValue={minValue}
                      maxValue={maxValue}
                      onInput={(e) => {
                        setMinValue(e.minValue)
                        setMaxValue(e.maxValue)
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-[15px]">Price:</span>
                    <input
                      className="text-[15px] text-paragraph bg-transparent outline-none"
                      type="text"
                      value={`${convertPriceString(minValue)} - ${convertPriceString(maxValue)}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div  className="relative hidden lg:block">
                <img className="w-full" src={cardImg} alt="shop-card" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
                  {/* <h2 className="text-2xl font-semibold mb-2 text-white">
                    Browse Exclusive Collections
                  </h2>
                  <p className="text-lg hover:underline">Shop Now</p> */}
                </div>
              </div>
            </div>

            {/* Products Grid (Variants) */}
            <div
              className="lg:max-w-[1100px] w-full px-8 sm:px-6 md:px-8"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8">
                {filteredVariants.map((variant, index) => {
                  const product = variant.Product || {}
                  return (
                    // <div className="group" key={index}>
                    //   <div className="relative overflow-hidden">
                    //     <Link
                    //       to={`/product-details/${product.productId}?variant=${variant.productVariantId}`}
                    //     >
                    //       <img
                    //         src={`${API_BASE_URL}/uploads/${
                    //           variant.productVariantImage ||
                    //           product.productImage
                    //         }`}
                    //         alt={product.productName}
                    //         className="w-full transform group-hover:scale-110 duration-300"
                    //       />
                    //     </Link>

                    //     {/* Tag */}
                    //     {product.tag && (
                    //       <div
                    //         className={`absolute z-10 top-7 left-7 pt-[10px] pb-2 px-3 rounded-[30px] font-primary text-[14px] text-white font-semibold leading-none ${
                    //           product.tag === 'Hot Sale'
                    //             ? 'bg-[#1CB28E]'
                    //             : product.tag === 'NEW'
                    //             ? 'bg-[#9739E1]'
                    //             : product.tag === '10% OFF'
                    //             ? 'bg-[#E13939]'
                    //             : ''
                    //         }`}
                    //       >
                    //         {product.tag}
                    //       </div>
                    //     )}

                    //     {/* Action Buttons */}
                    //     <div className="absolute z-10 top-[50%] right-3 transform -translate-y-[40%] opacity-0 duration-300 transition-all group-hover:-translate-y-1/2 group-hover:opacity-100 flex flex-col items-end gap-3">
                    //        {/* Add to Wishlist */}
                    //        <button
                    //          onClick={() => handleAddToWishlist(variant)}
                    //          className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                    //        >
                    //          <LuHeart className="dark:text-white h-[22px] w-[20px]" />
                    //          <span className="mt-1">Add to wishlist</span>
                    //        </button>
                           
                    //        {/* Add to Cart */}
                    //        <button
                    //          onClick={() => handleAddToCart(variant)}
                    //          className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                    //        >
                    //          <RiShoppingBag2Line className="dark:text-white h-[22px] w-[20px]" />
                    //          <span className="mt-1">Add to Cart</span>
                    //        </button>
                                   
                    //        {/* Quick View */}
                    //        <button 
                    //        onClick={() =>
                    //                   navigate(
                    //                     `/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`
                    //                   )
                    //                 }
                    //        className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon quick-view">
                              
                    //            <LuEye className="dark:text-white h-[22px] w-[20px]" />
                    //            <span className="mt-1">Quick View</span>
                    //        </button>
                    //     </div>
                    //   </div>

                    //   {/* Name & Price */}
                    //   <h3 className="text-lg font-semibold mt-4">
                    //    <Price value={product.productOfferPrice} />
                    //   </h3>
                    //   <h3 className="text-lg font-semibold">
                    //     {product.productName}
                    //   </h3>
                    // </div>
                    <div className="group" key={index}>
                     <div className="relative overflow-hidden">
                       <Link
                         to={`/product-details/${product.productId}?variant=${variant.productVariantId}`}
                       >
                         <img
                           src={`${API_BASE_URL}/uploads/${
                             variant.productVariantImage || product.productImage
                           }`}
                           alt={product.productName}
                           className="w-full transform group-hover:scale-110 duration-300"
                         />
                       </Link>
                   
                       {/* Tag */}
                       {product.tag && (
                         <div
                           className={`absolute z-10 top-7 left-7 pt-[10px] pb-2 px-3 rounded-[30px] font-primary text-[14px] text-white font-semibold leading-none ${
                             product.tag === 'Hot Sale'
                               ? 'bg-[#1CB28E]'
                               : product.tag === 'NEW'
                               ? 'bg-[#9739E1]'
                               : product.tag === '10% OFF'
                               ? 'bg-[#E13939]'
                               : ''
                           }`}
                         >
                           {product.tag}
                         </div>
                       )}
                   
                       
                       <div className="absolute z-10 top-[50%] right-3 transform -translate-y-[40%] opacity-0 duration-300 transition-all group-hover:-translate-y-1/2 group-hover:opacity-100 flex flex-col items-end gap-3">
                        
                         {variant.stockQuantity > 0 && (
                           <button
                             onClick={() => handleAddToWishlist(variant)}
                             className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                           >
                             <LuHeart className="dark:text-white h-[22px] w-[20px]" />
                             <span className="mt-1">Add to wishlist</span>
                           </button>
                         )}
                   
                         
                         {variant.stockQuantity > 0 && (
                           <button
                             onClick={() => handleAddToCart(variant)}
                             className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                           >
                             <RiShoppingBag2Line className="dark:text-white h-[22px] w-[20px]" />
                             <span className="mt-1">Add to Cart</span>
                           </button>
                         )}
                   
                        
                         <button
                           onClick={() =>
                             navigate(
                               `/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`
                             )
                           }
                           className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon quick-view"
                         >
                           <LuEye className="dark:text-white h-[22px] w-[20px]" />
                           <span className="mt-1">Quick View</span>
                         </button>
                       </div>
                     </div>
                   
                     
                     <div className="mt-4">
                       <div className="flex items-center justify-between">
                         <h3 className="text-lg font-semibold">
                           <Price value={product.productOfferPrice ?? 0} />
                         </h3>
                   
                        
                         {variant.stockQuantity === 0 && (
                           <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mr-2">
                             Out of Stock
                           </span>
                         )}
                       </div>
                   
                       <h3 className="text-lg font-semibold">{product.productName}</h3>
                     </div>
                   </div>
                   

                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[100000]">
           <div className="bg-white dark:bg-title p-6 rounded-2xl shadow-lg text-center w-[300px]">
             <p className="text-lg font-medium text-gray-800 dark:text-white">
               {modalMessage}
             </p>
           </div>
         </div>
       )}

      <FooterOne />
      <ScrollToTop />
    </>
  )
}



/* eslint-disable @typescript-eslint/no-unused-vars */

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'

// import bg from '../../assets/img/shortcode/breadcumb.jpg'
// import cardImg from '../../assets/img/new_prods/prod_1.jpg'
// import { LuEye, LuHeart } from 'react-icons/lu';
// import { RiShoppingBag2Line } from 'react-icons/ri';
// import { productList } from '../../data/data'

// import SelectOne from '../../components/product/select-one'
// import NavbarFour from '../../components/navbar/navbar-four'
// import LayoutOne from '../../components/product/layout-one'
// import FooterOne from '../../components/footer/footer-one'
// import ScrollToTop from '../../components/scroll-to-top'

// import MultiRangeSlider from 'multi-range-slider-react'

// import Aos from 'aos'




// export default function ShopV2() {
//     const [minValue, setMinValue] = useState(0)
//     const [maxValue, setMaxValue] = useState(0)
//     const [isPriceOpen, setIsPriceOpen] = useState(false)
//     const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//     const [subCategories, setSubCategories] = useState<any[]>([]);
//     const [products, setProducts] = useState<any[]>([])    
//     const [variants, setVariants] = useState<any[]>([])


//     const handleCategoryChange = (subCategoryId: number) => {
//       setSelectedCategories((prev) =>
//         prev.includes(subCategoryId)
//           ? prev.filter((id) => id !== subCategoryId) // remove if already selected
//           : [...prev, subCategoryId] // add new one
//       );
//     };
//       const filteredProducts = products.filter((p) => {
//         const inCategory = selectedCategories.length > 0 
//           ? selectedCategories.includes(p.subCategoryId) 
//           : true;
      
//         const inPriceRange =
//           p.productOfferPrice >= minValue && p.productOfferPrice <= maxValue;
      
//         return inCategory && inPriceRange;
//       });

//       useEffect(() => {
//               fetch("https://tamiraaapi.tamiraa.com/api/product-variants")
//                 .then(res => res.json())
//                 .then(data => {
//                   if (Array.isArray(data.data)) {
//                     setVariants(data.data)
//                   }
//                 })
//                 .catch(err => console.error("Error fetching variants:", err))
//             }, [])

    

//      useEffect(() => {
//          Aos.init()    
//          // Fetch products from API
//          fetch('https://tamiraaapi.tamiraa.com/api/products')
//              .then((res) => res.json())
//              .then((data) => {
//                  if (Array.isArray(data)) {
//                      setProducts(data)
//                  } else if (data.data) {
//                      setProducts(data.data) // if wrapped inside { data: [...] }
//                  }
//              })
//              .catch((err) => console.error('Error fetching products:', err))
//      }, [])

//      useEffect(() => {
//       fetch('https://tamiraaapi.tamiraa.com/api/products')
//         .then((res) => res.json())
//         .then((data) => {
//           const productsData = Array.isArray(data) ? data : data.data || [];
//           setProducts(productsData);
    
//           // find max price from products and set as default
//           if (productsData.length > 0) {
//             const maxPrice = Math.max(...productsData.map(p => p.productOfferPrice));
//             setMaxValue(maxPrice);
//           }
//         })
//         .catch((err) => console.error('Error fetching products:', err));
//     }, []);

     

//      useEffect(() => {
//          fetch("https://tamiraaapi.tamiraa.com/api/subcategories")
//            .then((res) => res.json())
//            .then((data) => {
//              if (Array.isArray(data)) {
//                setSubCategories(data);
//              } else if (data.data) {
//                setSubCategories(data.data); // API wrapped response
//              }
//            })
//            .catch((err) => console.error("Error fetching subcategories:", err));
//      }, []);
    

//     useEffect(() => {
//         Aos.init()
//     })

//     return (
//         <>
//             <NavbarFour />

//             <div
//                 className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70"
//                 style={{ backgroundImage: `url(${bg})` }}
//             >
//                 <div className="text-center w-full mt-28">
//                     <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">
//                         Shop
//                     </h2>
//                     <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
//                         <li>
//                             <Link to="/">Home</Link>
//                         </li>
//                         <li>/</li>
//                         <li className="text-primary">Shop</li>
//                     </ul>
//                 </div>
//             </div>

//             <div className="s-py-100">
//                 <div className="container">
//                     <div className="max-w-[1477px] mx-auto flex items-start justify-between gap-8 md:gap-10 flex-col lg:flex-row">
//                         <div
//                             className="grid gap-[15px] lg:max-w-[300px] w-full sm:grid-cols-2 lg:grid-cols-1"
//                             data-aos="fade-up"
//                             data-aos-delay="100"
//                         >
                        
//                             <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px]">
//                              <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
//                                  Categories
//                                </h4>
//                                <div className="grid gap-5">
//                                  {subCategories.map((cat) => (
//                                  <label
//                                    key={cat.subCategoryId}
//                                    className="categoryies-iteem flex items-center gap-[10px]"
//                                  >
//                                    <input
//                                      className="appearance-none hidden"
//                                      type="checkbox"
//                                      name="categories"
//                                      value={cat.subCategoryId}
//                                      checked={selectedCategories.includes(cat.subCategoryId)}
//                                      onChange={() => handleCategoryChange(cat.subCategoryId)}
//                                    />
//                                    <span className="w-4 h-4 rounded-[5px] border border-title dark:border-white flex items-center justify-center duration-300">
//                                      <svg
//                                        className={`duration-300 ${selectedCategories.includes(cat.subCategoryId) ? "opacity-100" : "opacity-0"}`}
//                                        width="9"
//                                        height="8"
//                                        viewBox="0 0 9 8"
//                                        fill="none"
//                                        xmlns="http://www.w3.org/2000/svg"
//                                      >
//                                        <path
//                                          d="M3.05203 7.04122C2.87283 7.04122 2.69433 6.97322 2.5562 6.83864L0.532492 4.8553C0.253409 4.58189 0.249159 4.13351 0.522576 3.85372C0.796701 3.57393 1.24578 3.57039 1.52416 3.84309L3.05203 5.34122L7.61512 0.868804C7.89491 0.595387 8.34328 0.59822 8.6167 0.87872C8.89082 1.1578 8.88657 1.60689 8.60749 1.8803L3.54787 6.83864C3.40974 6.97322 3.23124 7.04122 3.05203 7.04122Z"
//                                          fill="#BB976D"
//                                        />
//                                      </svg>
//                                    </span>
//                                    <span className="text-title dark:text-white block sm:leading-none transform translate-y-[1px] duration-300 select-none">
//                                      {cat.subCategoryName}
//                                    </span>
//                                  </label>
//                                ))}
//                                </div>
//                              </div>
//                             <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px]">
//                                 <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
//                                     Item Type
//                                 </h4>
//                                 <div className="grid gap-5">
//                                     <label className="categoryies-iteem flex items-center gap-[10px]">
//                                         <input
//                                             className="appearance-none hidden"
//                                             type="radio"
//                                             name="item-type"
//                                         />
//                                         <span className="w-[18px] h-[18px] rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
//                                             <svg
//                                                 className="duration-300 opacity-0"
//                                                 width="10"
//                                                 height="10"
//                                                 viewBox="0 0 10 10"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <rect
//                                                     width="10"
//                                                     height="10"
//                                                     rx="5"
//                                                     fill="#BB976D"
//                                                 />
//                                             </svg>
//                                         </span>
//                                         <span className="sm:text-lg text-title duration-300 dark:text-white block sm:leading-none transform translate-y-[1px] select-none text">
//                                             Regular
//                                         </span>
//                                     </label>
//                                     <label className="categoryies-iteem flex items-center gap-[10px]">
//                                         <input
//                                             className="appearance-none hidden"
//                                             type="radio"
//                                             name="item-type"
//                                         />
//                                         <span className="w-[18px] h-[18px] rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
//                                             <svg
//                                                 className="duration-300 opacity-0"
//                                                 width="10"
//                                                 height="10"
//                                                 viewBox="0 0 10 10"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <rect
//                                                     width="10"
//                                                     height="10"
//                                                     rx="5"
//                                                     fill="#BB976D"
//                                                 />
//                                             </svg>
//                                         </span>
//                                         <span className="text-title dark:text-white block sm:leading-none transform translate-y-[1px] duration-300 select-none">
//                                             Premium
//                                         </span>
//                                     </label>
//                                     <label className="categoryies-iteem flex items-center gap-[10px]">
//                                         <input
//                                             className="appearance-none hidden"
//                                             type="radio"
//                                             name="item-type"
//                                         />
//                                         <span className="w-[18px] h-[18px] rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
//                                             <svg
//                                                 className="duration-300 opacity-0"
//                                                 width="10"
//                                                 height="10"
//                                                 viewBox="0 0 10 10"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <rect
//                                                     width="10"
//                                                     height="10"
//                                                     rx="5"
//                                                     fill="#BB976D"
//                                                 />
//                                             </svg>
//                                         </span>
//                                         <span className="text-title dark:text-white block sm:leading-none transform translate-y-[1px] duration-300 select-none">
//                                             Vintage
//                                         </span>
//                                     </label>
//                                 </div>
//                             </div>
//                             <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px]">
//                                 <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
//                                     Choose Brand
//                                 </h4>
//                                 <div>
//                                     <SelectOne />
//                                 </div>
//                             </div>
//                             <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-[30px] rounded-lg">
//                                 {/* Dropdown Header */}
//                                 <div
//                                     className="flex justify-between items-center cursor-pointer"
//                                     onClick={() => setIsPriceOpen(!isPriceOpen)}
//                                 >
//                                     <h4 className="font-medium leading-none text-xl sm:text-2xl">
//                                         Price Range
//                                     </h4>
//                                     <span
//                                         className={`transition-transform duration-300 ${
//                                             isPriceOpen ? 'rotate-180' : ''
//                                         }`}
//                                     >
//                                         ▼
//                                     </span>
//                                 </div>

//                                 {/* Dropdown Content */}
//                                 <div
//                                     className={`overflow-hidden transition-all duration-300 ${
//                                         isPriceOpen
//                                             ? 'max-h-96 opacity-100 mt-4'
//                                             : 'max-h-0 opacity-0'
//                                     }`}
//                                 >
//                                     <div id="slider-container">
//                                         <MultiRangeSlider
//                                             ruler={false}
//                                             label={false}
//                                             min={0}
//                                             max={1000}
//                                             step={10}
//                                             minValue={minValue}
//                                             maxValue={maxValue}
//                                             onInput={(e) => {
//                                                 setMinValue(e.minValue)
//                                                 setMaxValue(e.maxValue)
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="mt-3 flex items-center gap-1">
//                                         <span className="text-[15px]">
//                                             Price:
//                                         </span>
//                                         <input
//                                             className="text-[15px] text-paragraph bg-transparent outline-none"
//                                             type="text"
//                                             value={`₹${minValue} - ₹${maxValue}`}
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <Link
//                                 to="/shop-v1"
//                                 className="relative hidden lg:block"
//                             >
//                                 <img
//                                     className="w-full"
//                                     src={cardImg}
//                                     alt="shop-card"
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
//                                     <h2 className="text-2xl font-semibold mb-2 text-white">
//                                         Browse Exclusive Collections
//                                     </h2>
//                                     <p className="text-lg hover:underline">
//                                         Shop Now
//                                     </p>
//                                 </div>
//                             </Link>
//                         </div>
//                         <div
//                             className="lg:max-w-[1100px] w-full"
//                             data-aos="fade-up"
//                             data-aos-delay="300"
//                         >
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8">
//                                 {/* {productList.map((item, index) => {
//                                     return <LayoutOne item={item} key={index} />
//                                 })} */}
//                                 {filteredProducts.map((item, index) => (
//                                  <div className="group" key={index}>
//                                    <div className="relative overflow-hidden">
//                                      <Link to={`/product-details/${item.productId}`}>
//                                        <img
//                                          src={`https://tamiraaapi.tamiraa.com/uploads/${item.productImage}`}
//                                          alt={item.productName}
//                                          className="w-full transform group-hover:scale-110 duration-300"
//                                        />
//                                      </Link>

//                                      {/* Tag Badge */}
//                                        {item.tag && (
//                                            <div
//                                                className={`absolute z-10 top-7 left-7 pt-[10px] pb-2 px-3 rounded-[30px] font-primary text-[14px] text-white font-semibold leading-none ${
//                                                    item.tag === 'Hot Sale'
//                                                        ? 'bg-[#1CB28E]'
//                                                        : item.tag === 'NEW'
//                                                        ? 'bg-[#9739E1]'
//                                                        : item.tag === '10% OFF'
//                                                        ? 'bg-[#E13939]'
//                                                        : ''
//                                                }`}
//                                            >
//                                                {item.tag}
//                                            </div>
//                                        )}


//                                        {/* Action Buttons */}
//                                        <div className="absolute z-10 top-[50%] right-3 transform -translate-y-[40%] opacity-0 duration-300 transition-all group-hover:-translate-y-1/2 group-hover:opacity-100 flex flex-col items-end gap-3">
                                           
//                                            {/* Add to Wishlist */}
//                                            <button
                                              
//                                                className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
//                                            >
//                                                <LuHeart className="dark:text-white h-[22px] w-[20px]" />
//                                                <span className="mt-1">Add to wishlist</span>
//                                            </button>
                        
//                                            {/* Add to Cart */}
//                                            <button
                                               
//                                                className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
//                                            >
//                                                <RiShoppingBag2Line className="dark:text-white h-[22px] w-[20px]" />
//                                                <span className="mt-1">Add to Cart</span>
//                                            </button>
                        
//                                            {/* Quick View */}
//                                            <button className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon quick-view">
//                                                <LuEye className="dark:text-white h-[22px] w-[20px]" />
//                                                <span className="mt-1">Quick View</span>
//                                            </button>
//                                        </div>
                        
//                                    </div>
                                   
//                                    <h3 className="text-lg font-semibold mt-4">₹{item.productOfferPrice}</h3>

//                                    <h3 className="text-lg font-semibold">{item.productName}</h3>
//                                  </div>
//                                ))}
                       

//                             </div>
//                             <div className="mt-10 md:mt-12 flex items-center justify-center gap-[10px]">
//                                 <Link
//                                     to="#"
//                                     className="text-title dark:text-white text-xl"
//                                 >
//                                     <span className="lnr lnr-arrow-left"></span>
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="w-8 sm:w-10 h-8 sm:h-10 bg-title bg-opacity-5 flex items-center justify-center leading-none text-base sm:text-lg font-medium text-title transition-all duration-300 hover:bg-opacity-100 hover:text-white dark:bg-white dark:bg-opacity-5 dark:text-white dark:hover:bg-opacity-100 dark:hover:text-title"
//                                 >
//                                     01
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="w-8 sm:w-10 h-8 sm:h-10 bg-title bg-opacity-5 flex items-center justify-center leading-none text-base sm:text-lg font-medium text-title transition-all duration-300 hover:bg-opacity-100 hover:text-white dark:bg-white dark:bg-opacity-5 dark:text-white dark:hover:bg-opacity-100 dark:hover:text-title"
//                                 >
//                                     02
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="w-8 sm:w-10 h-8 sm:h-10 bg-title bg-opacity-5 flex items-center justify-center leading-none text-base sm:text-lg font-medium text-title transition-all duration-300 hover:bg-opacity-100 hover:text-white dark:bg-white dark:bg-opacity-5 dark:text-white dark:hover:bg-opacity-100 dark:hover:text-title"
//                                 >
//                                     03
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="text-title dark:text-white text-3xl sm:text-4xl transform"
//                                 >
//                                     ...
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="w-8 sm:w-10 h-8 sm:h-10 bg-title bg-opacity-5 flex items-center justify-center leading-none text-base sm:text-lg font-medium text-title transition-all duration-300 hover:bg-opacity-100 hover:text-white dark:bg-white dark:bg-opacity-5 dark:text-white dark:hover:bg-opacity-100 dark:hover:text-title"
//                                 >
//                                     09
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="w-8 sm:w-10 h-8 sm:h-10 bg-title bg-opacity-5 flex items-center justify-center leading-none text-base sm:text-lg font-medium text-title transition-all duration-300 hover:bg-opacity-100 hover:text-white dark:bg-white dark:bg-opacity-5 dark:text-white dark:hover:bg-opacity-100 dark:hover:text-title"
//                                 >
//                                     10
//                                 </Link>
//                                 <Link
//                                     to="#"
//                                     className="text-title dark:text-white text-xl"
//                                 >
//                                     <span className="lnr lnr-arrow-right"></span>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <FooterOne />

//             <ScrollToTop />
//         </>
//     )
// }


