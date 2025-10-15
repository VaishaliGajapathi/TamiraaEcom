import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuEye, LuHeart } from 'react-icons/lu'
import { RiShoppingBag2Line } from 'react-icons/ri'
import { Price } from '../../context/CurrencyContext'
import { getStoredUser } from '../../utils/user'
import { API_BASE_URL } from '../../utils/api'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
// import 'swiper/css/autoplay'

interface Variant {
  productVariantId: number
  productVariantImage: string
  isBestSeller: boolean
  stockQuantity: number
  Product: {
    productId: number
    productName: string
    productOfferPrice: number
    productMrpPrice: number
  }
}

export default function BestSeller() {
  const [bestSellers, setBestSellers] = useState<Variant[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const navigate = useNavigate()

  const showModal = (msg: string) => {
    setModalMessage(msg)
    setModalOpen(true)
    setTimeout(() => setModalOpen(false), 2500)
  }

  // const handleAddToCart = async (variant: Variant) => {
  //   try {
  //     const user = getStoredUser()
  //     if (!user?.id) return showModal('Please login to add to cart')
  //     if (!variant?.productVariantId) return showModal('No product variant selected')

  //     const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userId: user.id, productVariantId: variant.productVariantId, quantity: 1 }),
  //     })
  //     const data = await res.json()
  //     if (res.ok) {
  //       showModal(data.message === 'Already in cart' ? '🛍️ This product is already in your cart' : '🎁 Added to your shopping bag – happy shopping!')
  //     } else showModal(data.message || 'Failed to add to cart')
  //   } catch (err) {
  //     console.error(err)
  //     showModal('❌ Something went wrong')
  //   }
  // }


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

  // const handleAddToWishlist = async (variant: Variant) => {
  //   try {
  //     const user = getStoredUser()
  //     if (!user?.id) return showModal('Please login to add to wishlist')
  //     if (!variant?.productVariantId) return showModal('No product variant selected')

  //     const res = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userId: user.id, productVariantId: variant.productVariantId }),
  //     })
  //     const data = await res.json()
  //     if (res.ok) {
  //       showModal(data.message === 'Product already in wishlist' ? '💖 Product already in wishlist' : '💖 Added to wishlist')
  //     } else showModal(data.message || '❌ Failed to add to wishlist')
  //   } catch (err) {
  //     console.error(err)
  //     showModal('❌ Something went wrong')
  //   }
  // }


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


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/product-variants`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sellers = data.data.filter((v: Variant) => v.isBestSeller)
          setBestSellers(sellers)
        }
      })
      .catch((err) => console.error('Error fetching best sellers:', err))
  }, [])

  return (
   <div className="max-w-1366 mx-auto px-8 sm:px-6 md:px-6 lg:px-10">
      {/* Header */}
      <div
        className="flex items-center justify-between gap-5 flex-wrap mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl">
          Best Sellers
        </h2>
        <Link
          to="/allproducts"
          className="group flex items-center gap-[10px] font-medium md:text-lg leading-none text-title dark:text-white"
        >
          <span className="text-underline leading-none">
            See All Collection
          </span>
          <FaArrowRightLong className="w-5 md:w-[30px] text-title dark:text-white" />
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={10} // reduce gap between slides for mobile
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {bestSellers.map((variant) => (
          <SwiperSlide key={variant.productVariantId}>
            <div className="group">
              <div className="relative overflow-hidden before:absolute card-gradient-overlay before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:opacity-0 group-hover:before:opacity-0 before:duration-300">
                <Link
                  to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                >
                  <img
                    className="w-full transform duration-300 group-hover:scale-110"
                    src={`${API_BASE_URL}/uploads/${variant.productVariantImage}`}
                    alt={variant.Product.productName}
                  />
                </Link>

                {/* Action Buttons */}
                <div className="flex flex-col gap-[10px] absolute z-20 bottom-5 right-5">
                  {/* Quick View (always visible) */}
                  <button
                    onClick={() =>
                      navigate(
                        `/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`
                      )
                    }
                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-300 bg-white dark:bg-title bg-opacity-20 dark:bg-opacity-80 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 quick-view tooltip-icon-2"
                  >
                    <LuEye className="transition-all duration-300 text-white w-6 h-6" />
                  </button>

                  {/* Add to Cart (only if in stock) */}
                  {variant.stockQuantity > 0 && (
                    <button
                      onClick={() => handleAddToCart(variant)}
                      className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-500 bg-white dark:bg-title bg-opacity-20 dark:bg-opacity-60 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                    >
                      <RiShoppingBag2Line className="transition-all duration-300 text-white w-6 h-6" />
                    </button>
                  )}

                  {/* Add to Wishlist (only if in stock) */}
                  {variant.stockQuantity > 0 && (
                    <button
                      onClick={() => handleAddToWishlist(variant)}
                      className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-700 bg-white dark:bg-title bg-opacity-20 dark:bg-opacity-80 faveIcon transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                    >
                      <LuHeart className="transition-all duration-300 text-white w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-5 md:mt-7">
                {/* Price + Out of Stock Badge */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium leading-none dark:text-white text-lg">
                    <Price value={variant.Product.productOfferPrice ?? 0} />
                  </h4>

                  {variant.stockQuantity === 0 && (
                    <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mr-2">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h5 className="mt-3 text-xl font-normal dark:text-white leading-[1.5]">
                  <Link
                    to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                  >
                    {variant.Product.productName}
                  </Link>
                </h5>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[100000]">
          <div className="bg-white dark:bg-title p-6 rounded-2xl shadow-lg text-center w-[300px]">
            <p className="text-lg font-medium text-gray-800 dark:text-white">
              {modalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
