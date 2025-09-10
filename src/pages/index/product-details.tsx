/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
import { LuMinus, LuPlus } from 'react-icons/lu'
import AOS from 'aos'
import bg from '../../assets/img/shortcode/breadcumb.jpg'
// import newprod1 from '../../assets/img/new_prods/prod_1.jpg'
// import IncreDre from '../../components/incre-dre'
import FooterOne from '../../components/footer/footer-one'
import DetailTab from '../../components/product/detail-tab'
// import LayoutOne from '../../components/product/layout-one'
import ScrollToTop from '../../components/scroll-to-top'
import { getStoredUser } from '../../utils/user'
// import { productList } from '../../data/data'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import NavbarFour from '../../components/navbar/navbar-four'
import { Price } from '../../context/CurrencyContext'

import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export default function ProductDetails() {
    // const navigate = useNavigate()
    const [activeImage, setActiveImage] = useState<number>(1)
    const [products, setProducts] = useState<any[]>([])
    const [variants, setVariants] = useState<any[]>([])
    const [childImages, setChildImages] = useState<any[]>([])
    // const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
    const [count, setCount] = useState(1)
    const swiperRef = useRef<SwiperType | null>(null)
    const [currentVariant, setCurrentVariant] = useState<any>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    useEffect(() => {
        if (currentVariant) {
            if (currentVariant.stockQuantity > 0) {
                setCount(1) // default 1 if in stock
            } else {
                setCount(0) // force 0 if out of stock
            }
        }
    }, [currentVariant])

    const showModal = (msg: string) => {
        setModalMessage(msg)
        setModalOpen(true)

        // auto-close after 2.5 sec
        setTimeout(() => {
            setModalOpen(false)
        }, 2500)
    }

    const params = useParams()
    const id: any = params.id
    const searchParams = new URLSearchParams(window.location.search)
    const variantId = parseInt(searchParams.get('variant') || '0')

    useEffect(() => {
        fetch('http://localhost:5000/api/product-variants')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setVariants(data.data)
                }
            })
            .catch((err) => console.error('Error fetching variants:', err))
    }, [])

    //   useEffect(() => {
    //        AOS.init()

    //        fetch("http://localhost:5000/api/products")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       const list = Array.isArray(data) ? data : data.data;
    //       setProducts(list);

    //       // find product
    //       const found = list.find((p: any) => p.productId === parseInt(id));
    //       if (found && found.Variants?.length > 0) {
    //         setCurrentVariant(found.Variants[0]); // ✅ default first variant
    //       }
    //     })
    //     .catch((err) => console.error("Error fetching products:", err));
    // }, [id]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.data
                setProducts(list)

                const found = list.find(
                    (p: any) => p.productId === parseInt(id)
                )

                if (found && found.Variants?.length > 0) {
                    const selectedVariant = found.Variants.find(
                        (v: any) => v.productVariantId === variantId
                    )
                    setCurrentVariant(selectedVariant || found.Variants[0])
                }
            })
            .catch((err) => console.error('Error fetching products:', err))
    }, [id, variantId])

    const stock = currentVariant?.stockQuantity || 0

    const variantImageUrl = currentVariant
        ? `http://localhost:5000/uploads/${currentVariant.productVariantImage}`
        : '' // fallback image

    //   const handleAddToWishlist = async () => {
    //   try {
    //     const user = JSON.parse(localStorage.getItem("user") || "{}");

    //     //  use "id" instead of "userId"
    //     if (!user?.id) {
    //       alert("Please login to add to wishlist");
    //       return;
    //     }

    //     if (!currentVariant?.productVariantId) {
    //       alert("No product variant selected");
    //       return;
    //     }

    //     const res = await fetch("http://localhost:5000/api/wishlist/add", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         userId: user.id, //  backend expects userId, but localStorage key is "id"
    //         productVariantId: currentVariant.productVariantId,
    //       }),
    //     });

    //     const data = await res.json();

    //     if (res.ok) {
    //       alert("Added to wishlist ");
    //        navigate("/wishlist");
    //     } else {
    //       alert(data.message || "Failed to add to wishlist ");
    //     }
    //   } catch (err) {
    //     console.error("Error adding to wishlist:", err);
    //     alert("Something went wrong ");
    //   }
    // };

    const handleAddToWishlist = async () => {
        try {
            // const user = JSON.parse(localStorage.getItem("user") || "{}");

            const user = getStoredUser()

            if (!user?.id) {
                showModal('Please login to add to wishlist')
                return
            }

            if (!currentVariant?.productVariantId) {
                showModal('No product variant selected')
                return
            }

            const res = await fetch('http://localhost:5000/api/wishlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    productVariantId: currentVariant.productVariantId,
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
                showModal(data.message || 'Failed to add to wishlist')
            }
        } catch (err) {
            console.error('Error adding to wishlist:', err)
            showModal('Something went wrong')
        }
    }

    const handleAddToCart = async () => {
        try {
            // const user = JSON.parse(localStorage.getItem("user") || "{}");

            const user = getStoredUser()

            if (!user?.id) {
                showModal('Please login to add to cart')
                return
            }

            if (!currentVariant?.productVariantId) {
                showModal('No product variant selected')
                return
            }

            const res = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id, //  backend expects userId
                    productVariantId: currentVariant.productVariantId,
                    quantity: count, //  pass selected quantity
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
            console.error('Error adding to cart:', err)
            alert('Something went wrong')
        }
    }

    // const _data = productList.find((item) => item.id === parseInt(id))

    const product = products.find((item) => item.productId === parseInt(id))

    useEffect(() => {
        if (currentVariant?.productVariantId) {
            fetch(
                `http://localhost:5000/api/product-variant-images/${currentVariant.productVariantId}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data.data)) {
                        setChildImages(data.data)
                    }
                })
                .catch((err) =>
                    console.error('Error fetching child images:', err)
                )
        }
    }, [currentVariant])

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.autoplay.start()
        }
    }, [childImages])

    useEffect(() => {
        AOS.init()
    }, [])

    return (
        <>
            <NavbarFour />
            {/* Banner */}
            <div
                className="relative flex items-center justify-center gap-4 flex-wrap 
                                       w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] 
                                       bg-cover bg-center bg-no-repeat 
                                       pt-16 sm:pt-20 md:pt-24 lg:pt-32 
                                       before:absolute before:inset-0 before:bg-title before:bg-opacity-70"
                style={{ backgroundImage: `url(${bg})` }}
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
                        <li>
                            <Link className="text-primary" to="/allproducts">
                                Shop
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="s-py-50" data-aos="fade-up">
                <div className="container-fluid">
                    <div className="max-w-[1720px] mx-auto flex justify-between gap-10 flex-col lg:flex-row">
                        <div className="w-full lg:w-[58%]">
                            <div className="relative product-dtls-wrapper">
                                {/* <button className="absolute top-5 left-0 p-2 bg-[#E13939] text-lg leading-none text-white font-medium z-50">
                                    -10%
                                </button> */}
                                {/* <div className="product-dtls-slider ">
                                    <div
                                        className={
                                            activeImage === 1 ? '' : 'hidden'
                                        }
                                    >
                                        <img
                                            src={
                                                data?.image
                                                    ? data?.image
                                                    : newprod1
                                            }
                                            className="w-full"
                                            alt="product"
                                        />
                                    </div>
                                   
                                    
                                </div> */}

                                <div className="product-dtls-slider">
                                    {childImages.length > 0 ? (
                                        childImages.map((img, index) => (
                                            <div
                                                key={img.childImageId}
                                                className={
                                                    activeImage === index + 1
                                                        ? ''
                                                        : 'hidden'
                                                }
                                            >
                                                <img
                                                    src={`http://localhost:5000/uploads/${img.childImage}`}
                                                    alt={`Variant ${currentVariant?.productId}`}
                                                    className="w-full"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <img
                                            src={variantImageUrl}
                                            className="w-full"
                                            alt={
                                                product?.productName ||
                                                'Product'
                                            }
                                        />
                                    )}
                                </div>

                                <div className="product-dtls-nav">
                                    <Swiper
                                        direction="vertical"
                                        spaceBetween={10}
                                        slidesPerView={4}
                                        loop={true}
                                        observer={true}
                                        observeParents={true}
                                        autoplay={{
                                            delay: 2000,
                                            disableOnInteraction: false,
                                            pauseOnMouseEnter: false,
                                        }}
                                        onSwiper={(swiper) =>
                                            (swiperRef.current = swiper)
                                        }
                                        modules={[Navigation, Autoplay]}
                                        className="h-[1100px]"
                                    >
                                        {childImages.length > 0 ? (
                                            childImages.map((img, index) => (
                                                <SwiperSlide
                                                    key={img.childImageId}
                                                    onClick={() =>
                                                        setActiveImage(
                                                            index + 1
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={`http://localhost:5000/uploads/${img.childImage}`}
                                                        alt={`Variant ${
                                                            currentVariant?.productVariantId
                                                        } - ${index + 1}`}
                                                        className="cursor-pointer"
                                                    />
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            <SwiperSlide>
                                                <img
                                                    src={variantImageUrl}
                                                    alt={
                                                        product?.productName ||
                                                        'Product'
                                                    }
                                                    className="cursor-pointer"
                                                />
                                            </SwiperSlide>
                                        )}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                        <div className="lg:max-w-[635px] w-full">
                            <div className="pb-4 sm:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk">
                                <h2 className="font-semibold leading-none">
                                    {product?.productName || ''}
                                </h2>
                                <div className="flex gap-4 items-center mt-[15px]">
                                    <span className="text-lg sm:text-xl leading-none pb-[5px] text-title line-through pl-2 inline-block dark:text-white">
                                        <Price
                                            value={
                                                product?.productMrpPrice || 0
                                            }
                                        />
                                    </span>
                                    <span className="text-2xl sm:text-3xl text-primary leading-none block">
                                        <Price
                                            value={
                                                product?.productOfferPrice || 0
                                            }
                                        />
                                    </span>
                                </div>

                                <p className="sm:text-lg mt-5 md:mt-7">
                                    {/* Experience the epitome of grace with our
                                    Classic Handwoven Saree. Crafted from
                                    premium fabric and adorned with intricate
                                    detailing, it offers unmatched elegance for
                                    any occasion — be it a festive celebration
                                    or an intimate gathering. Its timeless
                                    design blends tradition with modern
                                    sophistication, while the rich craftsmanship
                                    ensures it remains a cherished piece in your
                                    wardrobe for years to come. */}

                                    {product?.productDescription ||
                                        'No description available.'}
                                </p>
                            </div>
                            <div
                                className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                {stock <= 0 ? (
                                    <p className="text-red-600 font-medium text-lg">
                                        🚫 Out of Stock
                                    </p>
                                ) : (
                                    <>
                                        {/* Quantity Selector */}
                                        <div className="inc-dec flex items-center gap-2">
                                            <div
                                                className="dec w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center cursor-pointer"
                                                onClick={() =>
                                                    setCount(
                                                        count > 1
                                                            ? count - 1
                                                            : 1
                                                    )
                                                }
                                            >
                                                <LuMinus className="text-title dark:text-white" />
                                            </div>

                                            <input
                                                className="w-10 h-auto outline-none bg-transparent text-base md:text-lg leading-none text-title dark:text-white text-center"
                                                type="text"
                                                value={count}
                                                readOnly
                                            />

                                            <div
                                                className={`inc w-6 h-6 flex items-center justify-center cursor-pointer ${
                                                    count >= stock
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'bg-[#E8E9EA] dark:bg-dark-secondary'
                                                }`}
                                                onClick={() => {
                                                    if (count < stock) {
                                                        setCount(count + 1)
                                                    }
                                                }}
                                            >
                                                <LuPlus className="text-title dark:text-white" />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-4 mt-4 sm:mt-6">
                                            <button
                                                onClick={handleAddToCart}
                                                className="btn btn-outline"
                                                data-text="Add to Cart"
                                            >
                                                <span>Add to Cart</span>
                                            </button>
                                            <button
                                                onClick={handleAddToWishlist}
                                                className="btn btn-outline"
                                                data-text="Add to Wishlist"
                                            >
                                                <span>Add to Wishlist</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div
                                className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                <div className="flex gap-x-12 gap-y-3 flex-wrap">
                                    {/* <h6 className="leading-none font-medium">
                                        SKU : CH_0015
                                    </h6> */}
                                    <h6 className="leading-none font-medium">
                                        Brand :{' '}
                                        {product?.brandName ||
                                            'No brand name available.'}
                                    </h6>
                                </div>
                                <div className="flex gap-x-12 gap-y-3 flex-wrap mt-5 sm:mt-10">
                                    {/* <h6 className="leading-none font-medium">
                                        SKU : CH_0015
                                    </h6> */}

                                    <h6 className="leading-none font-medium">
                                        Material :{' '}
                                        {product?.material ||
                                            'No material available.'}
                                    </h6>
                                </div>
                                <div className="flex gap-x-12 lg:gap-x-24 gap-y-3 flex-wrap mt-5 sm:mt-10">
                                    <div className="flex gap-[10px] items-center">
                                        <h6 className="leading-none font-medium">
                                            Color :
                                        </h6>

                                        <div className="flex gap-2">
                                            {variants
                                                .filter(
                                                    (v) =>
                                                        v.productId ===
                                                        product?.productId
                                                ) // only variants for this product
                                                .map((variant: any) => (
                                                    // {product?.Variants?.map((variant: any) => (
                                                    <label
                                                        key={
                                                            variant.productVariantId
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="variant"
                                                            value={
                                                                variant.productVariantId
                                                            }
                                                            checked={
                                                                currentVariant?.productVariantId ===
                                                                variant.productVariantId
                                                            }
                                                            onChange={() =>
                                                                setCurrentVariant(
                                                                    variant
                                                                )
                                                            }
                                                            className="hidden"
                                                        />
                                                        <span
                                                            className={`inline-block w-8 h-8  border ${
                                                                currentVariant?.productVariantId ===
                                                                variant.productVariantId
                                                                    ? 'border-20 border-black' // Active variant: thick black border
                                                                    : 'border-gray-300' // Default thin gray border
                                                            }`}
                                                            style={{
                                                                backgroundColor:
                                                                    variant.productColor?.toLowerCase(),
                                                                boxSizing:
                                                                    'content-box', // Ensure padding doesn’t shrink the color box size
                                                                padding: '4px', // Creates the gap between color and border
                                                            }}
                                                        />
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="pt-4 sm:pt-6"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <div className="flex items-center gap-6">
                                    <h6 className="font-normal">Share : </h6>
                                    <div className="flex gap-6">
                                        <Link
                                            to="#"
                                            className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
                                        >
                                            <FaFacebookF className="size-5" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
                                        >
                                            <FaTwitter className="size-5" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
                                        >
                                            <FaInstagram className="size-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-50">
                <div className="container-fluid">
                    <DetailTab />
                </div>
            </div>

            <div
                className="s-py-50-100"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div className="container-fluid">
                    <div className="max-w-[547px] mx-auto text-center">
                        <h6 className="text-2xl sm:text-3xl md:text-4xl leading-none">
                            Related Products
                        </h6>
                        <p className="mt-3">
                            Explore complementary options that enhance your
                            experience. Discover related products curated just
                            for you.{' '}
                        </p>
                    </div>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{
                            delay: 2500, // 2.5 seconds
                            disableOnInteraction: false, // keeps autoplay after user interaction
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        modules={[Autoplay, Navigation]}
                    >
                        {variants.map((variant: any) => (
                            <SwiperSlide key={variant.productVariantId}>
                                <div className="group">
                                    <div className="relative overflow-hidden">
                                        <Link
                                            to={`/product-details/${variant.productId}?variant=${variant.productVariantId}`}
                                            onClick={() =>
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth',
                                                })
                                            }
                                        >
                                            <img
                                                src={`http://localhost:5000/uploads/${variant.productVariantImage}`}
                                                alt={
                                                    variant.Product.productName
                                                }
                                                className="w-full transform group-hover:scale-110 duration-300 mt-4"
                                            />
                                        </Link>
                                    </div>
                                    <h3 className="text-lg font-semibold mt-4">
                                        ₹{variant.Product.productOfferPrice}
                                    </h3>
                                    <h3 className="text-lg font-semibold">
                                        {variant.Product.productName}
                                    </h3>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
