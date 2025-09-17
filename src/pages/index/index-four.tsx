import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
// import type { Swiper as SwiperType } from 'swiper'
import NavbarFour from '../../components/navbar/navbar-four'
import BestSeller from '../../components/product/best-seller'
import PartnerOne from '../../components/partner-one'
// import BlogFour from '../../components/blog/blog-four'
// import NewsTwo from '../../components/news-letter/news-two'
import { Price } from '../../context/CurrencyContext'
import ScrollToTop from '../../components/scroll-to-top'

// import bgnew from '../../assets/img/new_banner/new_banner1.jpg'
import like from '../../assets/img/svg/like.svg'
// import bgUpdated from '../../assets/img/new_banner/new_project1.jpg'

import { servicesData } from '../../data/index-three'
import { featureOne } from '../../data/data'

import { LuEye, LuHeart } from 'react-icons/lu'
import { RiShoppingBag2Line } from 'react-icons/ri'
// import { GoStarFill } from 'react-icons/go'
import { FaArrowRightLong } from 'react-icons/fa6'

import Aos from 'aos'
import FooterOne from '../../components/footer/footer-one'
import ClientOne from '../../components/client/client-one'
import NewsOne from '../../components/news-letter/news-one'
import { getStoredUser } from '../../utils/user'
import { Autoplay } from 'swiper/modules'
// Modules

// Swiper CSS
import 'swiper/css'
import 'swiper/css/navigation'

interface Banner {
    id: number
    bannerImage: string
}

interface Product {
    productId: number
    productName: string
    productOfferPrice: number
}

interface Variant {
    productVariantId: number
    productVariantImage?: string
    isNewArrival: boolean
    isTrending: boolean
    Product: Product
}

interface CollectionBanner {
  id: number
  bannerImage: string
}

export default function IndexFour() {
    const [banners, setBanners] = useState<Banner[]>([])
    // const [variants, setVariants] = useState<Variant[]>([])
    const navigate = useNavigate()
    const [newArrivals, setNewArrivals] = useState<Variant[]>([])
    const [trending, setTrending] = useState<Variant[]>([])
    const [collectionBanners, setCollectionBanners] = useState<CollectionBanner[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const showModal = (msg: string) => {
        setModalMessage(msg)
        setModalOpen(true)

        // auto-close after 2.5 sec
        setTimeout(() => {
            setModalOpen(false)
        }, 2500)
    }

    // 🔹 Add to Cart
    const handleAddToCart = async (variant: Variant) => {
        try {
            // const user = JSON.parse(localStorage.getItem("user") || "{}");
            const user = getStoredUser()

            if (!user?.id) {
                showModal('Please login to add to cart')
                return
            }

            if (!variant?.productVariantId) {
                showModal('No product variant selected')
                return
            }

            const res = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id, // same as ProductDetails
                    productVariantId: variant.productVariantId,
                    quantity: 1, // default 1 from shop grid
                }),
            })

            const data = await res.json()

            if (res.ok) {
                if (data.message === 'Already in cart') {
                    // 🔹 Don't increase qty, just inform user
                    showModal('🛍️ This product is already in your cart')
                } else {
                    showModal('🎁 Added to your shopping bag – happy shopping!')
                }
            } else {
                showModal(data.message || ' Failed to add to cart')
            }
        } catch (err) {
            console.error('Add to cart error:', err)
            showModal('❌ Something went wrong')
        }
    }

    // 🔹 Add to Wishlist
    const handleAddToWishlist = async (variant: Variant) => {
        try {
            // const user = JSON.parse(localStorage.getItem("user") || "{}");
            const user = getStoredUser()

            if (!user?.id) {
                showModal('Please login to add to wishlist')
                return
            }

            if (!variant?.productVariantId) {
                showModal('No product variant selected')
                return
            }

            const res = await fetch('http://localhost:5000/api/wishlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id, //  include userId
                    productVariantId: variant.productVariantId,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                if (data.message === 'Product already in wishlist') {
                    showModal('💖 Product already in wishlist')
                } else {
                    showModal('💖 Added to wishlist')
                }
            } else {
                showModal(data.message || '❌ Failed to add to wishlist')
            }
        } catch (err) {
            console.error('Wishlist error:', err)
            showModal('❌ Something went wrong')
        }
    }
    useEffect(() => {
        Aos.init()

        // Fetch banners from backend
        fetch('http://localhost:5000/api/home-banners') // adjust URL if deployed
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    // Pick first banner (or random / latest depending on your logic)
                    setBanners(data)
                }
            })
            .catch((err) => console.error('Error fetching banners:', err))
    }, [])

    useEffect(() => {
        Aos.init()

        fetch('http://localhost:5000/api/product-variants')
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.data)) {
                    const arrivals = data.data.filter(
                        (variant: Variant) => variant.isNewArrival
                    )
                    const trendingProducts = data.data.filter(
                        (variant: Variant) => variant.isTrending
                    )

                    setNewArrivals(arrivals)
                    setTrending(trendingProducts)
                }
            })
            .catch((err) => console.error('Error fetching variants:', err))
    }, [])

    useEffect(() => {
        const fetchCollectionBanners = async () => {
            try {
                const res = await fetch(
                    'http://localhost:5000/api/collection-banners'
                )
                const data = await res.json()

                // if single object → wrap in array
                setCollectionBanners(Array.isArray(data) ? data : [data])
            } catch (err) {
                console.error('Error fetching collection banners:', err)
            }
        }

        fetchCollectionBanners()
    }, [])

    return (
        <>
            <NavbarFour />
            <div className="pt-[50px] sm:pt-[96px] lg:pt-0"> 
    {/* Only add padding for small devices, remove for desktop */}
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={true}
      className="w-full"
    >
      {banners.map((item) => (
        <SwiperSlide key={item.id}>
          <div
            className="
              pt-2 sm:pt-52 lg:pt-[280px] xl:pt-56
              pb-52 lg:pb-[350px] 2xl:pb-[450px]
              bg-no-repeat bg-center
              bg-contain lg:bg-cover
              dark:before:bg-title dark:before:bg-opacity-70 xl:pt-56

            

            "
            style={{
              backgroundImage: `url(http://localhost:5000/uploads/${item.bannerImage})`,
            }}
          >
            <div
              className="container"
              data-aos="fade-up"
              data-aos-delay="100"
            ></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>

            {/* ✅ Keep your services section same */}
            <div className="container">
                <div className="max-w-1366 mx-auto">
                    <div className="hv3-service-wrapper bg-white dark:bg-title rounded-[10px] mt-4 lg:-mt-16  relative z-10 xl:flex xl:justify-evenly sm:gap-5 grid sm:grid-cols-2">
                        {servicesData.map((item, index) => (
                            <>
                                <div
                                    className="group flex items-center gap-5 p-6"
                                    key={index}
                                >
                                    <div className="text-left">
                                        <h5 className="font-medium leading-none text-lg lg:text-xl mt-0 mb-0 md:mt-5 md:mb-5">
                                            {item.title}
                                        </h5>
                                    </div>
                                </div>
                                <div className="w-[1px] border border-dashed border-title border-opacity-50 dark:border-opacity-50 dark:border-white absolute h-full xl:h-auto xl:static transform left-1/2 -translate-x-1/2 xl:-translate-x-0 top-0 hidden sm:block last:hidden"></div>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <div className="s-py-100">
                <div className="container">
                    <div className="max-w-1366 mx-auto">
                        <div
                            className="flex items-center justify-between gap-5 flex-wrap mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl">
                                New Arrival
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

                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                        >
                            {newArrivals.map((variant) => (
                                <SwiperSlide key={variant.productVariantId}>
                                    <div className="group">
                                        <div className="relative overflow-hidden before:absolute card-gradient-overlay before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:opacity-0 group-hover:before:opacity-100 before:duration-300">
                                            <Link
                                                to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                                            >
                                                <img
                                                    className="w-full transform duration-300 group-hover:scale-110"
                                                    src={`http://localhost:5000/uploads/${variant.productVariantImage}`}
                                                    alt={
                                                        variant.Product
                                                            .productName
                                                    }
                                                />
                                            </Link>

                                            {/* Buttons */}
                                            <div className="flex flex-col gap-[10px] absolute z-20 bottom-5 right-5">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`
                                                        )
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-300 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-80 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 quick-view tooltip-icon-2"
                                                >
                                                    <LuEye className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleAddToCart(variant)
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-500 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-60 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                                                >
                                                    <RiShoppingBag2Line className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleAddToWishlist(
                                                            variant
                                                        )
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-700 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-80 faveIcon transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                                                >
                                                    <LuHeart className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 md:mt-7">
                                            <h4 className="font-medium leading-none dark:text-white text-lg">
                                                <Price
                                                    value={
                                                        variant.Product
                                                            .productOfferPrice
                                                    }
                                                />
                                            </h4>
                                            <h5 className="mt-3 text-xl font-normal dark:text-white leading-[1.5]">
                                                <Link
                                                    to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                                                >
                                                    {
                                                        variant.Product
                                                            .productName
                                                    }
                                                </Link>
                                            </h5>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            <div className="s-py-100 bg-[#f5f5f5] dark:bg-dark-secondary">
                <div className="container">
                    <div className="max-w-1366 mx-auto">
                        <div
                            className="mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl text-center  sm:text-left">
                                Why you Choose Us
                            </h2>
                        </div>
                        <div
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-[30px]"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            {featureOne.slice(0, 4).map((item, index) => {
                                return (
                                    <div
                                        className="p-6 pb-0 rounded-[10px] relative"
                                        key={index}
                                    >
                                        <div
                                            className={`w-[1px] h-[120px] absolute right-0 top-[30%] ${
                                                index === 3
                                                    ? ''
                                                    : 'hidden 2xl:block border-l border-dashed border-primary'
                                            }`}
                                        ></div>
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="size-12"
                                        />
                                        <h5 className="font-semibold text-xl md:text-2xl mt-3 md:mt-7">
                                            {item.title}
                                        </h5>
                                        <p className="mt-2 sm:mt-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50">
                <div
                    className="container"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <BestSeller />
                </div>
            </div>

            <div className="s-py-100">
                <div className="container">
                    <div className="max-w-1366 mx-auto">
                        <div
                            className="flex items-center justify-between gap-5 flex-wrap mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {/* <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl">
                                New Arrival
                            </h2> */}
                        </div>

                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                1024: { slidesPerView: 1 },
                            }}
                        >
                            {collectionBanners.map((banner) => (
                                <SwiperSlide key={banner.id}>
                                    <div className="group">
                                        <div className="relative overflow-hidden before:absolute card-gradient-overlay before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:opacity-0 group-hover:before:opacity-100 before:duration-300">
                                            <img
                                                className="w-full transform duration-300 group-hover:scale-110"
                                                src={`http://localhost:5000/uploads/${banner.bannerImage}`}
                                                alt="Collection Banner"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            <div
                className="s-py-50-100"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <div className="container">
                    <div className="max-w-1366 mx-auto">
                        <div className="flex items-center justify-between gap-5 flex-wrap mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk">
                            <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl">
                                Trending
                            </h2>
                            <Link
                                to="/allproducts"
                                className="group flex items-center gap-[10px] font-medium md:text-lg leading-none text-title dark:text-white"
                            >
                                <span className="text-underline leading-none">
                                    See All Collection
                                </span>
                                <svg
                                    className="w-5 md:w-[30px] fill-current text-title dark:text-white"
                                    viewBox="0 0 31 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M30.5311 6.43072C30.824 6.13783 30.824 5.66295 30.5311 5.37006L25.7581 0.59709C25.4653 0.304196 24.9904 0.304196 24.6975 0.59709C24.4046 0.889983 24.4046 1.36486 24.6975 1.65775L28.9401 5.90039L24.6975 10.143C24.4046 10.4359 24.4046 10.9108 24.6975 11.2037C24.9904 11.4966 25.4653 11.4966 25.7581 11.2037L30.5311 6.43072ZM0.300781 6.65039L30.0008 6.65039V5.15039L0.300781 5.15039L0.300781 6.65039Z" />
                                </svg>
                            </Link>
                        </div>

                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                        >
                            {trending.map((variant) => (
                                <SwiperSlide key={variant.productVariantId}>
                                    <div className="group">
                                        <div className="relative overflow-hidden before:absolute card-gradient-overlay before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:opacity-0 group-hover:before:opacity-100 before:duration-300">
                                            <Link
                                                to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                                            >
                                                <img
                                                    className="w-full transform duration-300 group-hover:scale-110"
                                                    src={`http://localhost:5000/uploads/${variant.productVariantImage}`}
                                                    alt={
                                                        variant.Product
                                                            .productName
                                                    }
                                                />
                                            </Link>

                                            {/* Buttons */}
                                            <div className="flex flex-col gap-[10px] absolute z-20 bottom-5 right-5">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`
                                                        )
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-300 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-80 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 quick-view tooltip-icon-2"
                                                >
                                                    <LuEye className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleAddToCart(variant)
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-500 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-60 transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                                                >
                                                    <RiShoppingBag2Line className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleAddToWishlist(
                                                            variant
                                                        )
                                                    }
                                                    className="w-9 lg:w-12 h-9 p-2 lg:h-12 flex items-center justify-center transition-all duration-700 bg-white dark:bg-title bg-opacity-10 dark:bg-opacity-80 faveIcon transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 tooltip-icon-2"
                                                >
                                                    <LuHeart className="transition-all duration-300 text-white w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 md:mt-7">
                                            <h4 className="font-medium leading-none dark:text-white text-lg">
                                                <Price
                                                    value={
                                                        variant.Product
                                                            .productOfferPrice
                                                    }
                                                />
                                            </h4>
                                            <h5 className="mt-3 text-xl font-normal dark:text-white leading-[1.5]">
                                                <Link
                                                    to={`/product-details/${variant.Product.productId}?variant=${variant.productVariantId}`}
                                                >
                                                    {
                                                        variant.Product
                                                            .productName
                                                    }
                                                </Link>
                                            </h5>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            <div
                className="s-py-100 bg-[#ffffff] dark:bg-dark-secondary"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <div className="container">
                    <div className="md:px-20 relative">
                        <PartnerOne />
                        <div className="md:absolute md:top-2/4 md:left-0 transform md:-translate-y-2/4 mt-8 md:mt-0 w-full">
                            <div className="flex gap-2 md:gap-4 justify-center md:justify-between">
                                <button className="icon ptnrSlider02_prev w-9 h-9 border dark:border-white flex items-center justify-center text-title border-title dark:text-white">
                                    <span className="lnr lnr-arrow-left"></span>
                                </button>
                                <button className="icon ptnrSlider02_next w-9 h-9 border border-title dark:border-white flex items-center justify-center text-title dark:text-white">
                                    <span className="lnr lnr-arrow-right"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#f5f5f5] dark:bg-dark-secondary s-py-100">
                <div
                    className="container max-w-[1365px] mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="text-center mb-8 md:mb-12 max-w-[548px] mx-auto">
                        <img src={like} alt="" className="mx-auto size-16" />
                        <h2 className="dark:text-white font-bold leading-none mt-4">
                            Testimonial
                        </h2>
                        <p className="mt-3 md:mt-4">
                            Discover what our customers are saying about us.
                            Real stories, real experiences – find out why they
                            choose us.{' '}
                        </p>
                    </div>
                    <ClientOne />
                </div>
            </div>
            <div
                className="s-py-50-100"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <NewsOne />
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
