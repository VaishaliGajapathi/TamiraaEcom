import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuEye, LuHeart } from 'react-icons/lu'
import { RiShoppingBag2Line } from 'react-icons/ri'
import { Price } from '../../context/CurrencyContext'
import { useNavigate } from 'react-router-dom'
import { getStoredUser } from '../../utils/user'
import { API_BASE_URL } from "../../utils/api";

interface Variant {
    productVariantId: number
    productVariantImage: string
    isBestSeller: boolean
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

        // auto-close after 2.5 sec
        setTimeout(() => {
            setModalOpen(false)
        }, 2500)
    }

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

            const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
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

            const res = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
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
        fetch(`${API_BASE_URL}/api/product-variants`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const sellers = data.data.filter(
                        (v: Variant) => v.isBestSeller
                    )
                    setBestSellers(sellers)
                }
            })
            .catch((err) => console.error('Error fetching best sellers:', err))
    }, [])
    return (
        <div className="max-w-1366 mx-auto">
            <div className="flex items-center justify-between gap-5 flex-wrap mb-6 pb-4 md:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk">
                <h2 className="font-semibold leading-none text-2xl sm:text-3xl lg:text-4xl">
                    Best Sellers
                </h2>
            </div>

            {/* ✅ Grid layout: 4 left + 1 right */}
            <div className="mt-5 grid lg:grid-cols-2 grid-cols-1 gap-5">
                {/* Left side - first 4 best sellers */}
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    {bestSellers.slice(0, 4).map((item) => (
                        <div key={item.productVariantId}>
                            <div className="relative group z-[5] before:absolute card-gradient-overlay before:w-full before:h-full before:top-0 before:left-0 before:opacity-0 before:duration-300 before:z-[5] overflow-hidden hover:before:opacity-100 best-seller-pdct">
                                <img
                                    className="w-full transform duration-300 group-hover:scale-110"
                                    src={`${API_BASE_URL}/uploads/${item.productVariantImage}`}
                                    alt={item.Product.productName}
                                />
                                <div className="absolute z-10 top-0 left-0 w-full h-full items-start justify-end flex flex-col p-7">
                                    <div>
                                        <h4 className="text-lg font-medium text-white opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300">
                                            <Price
                                                value={
                                                    item.Product
                                                        .productOfferPrice
                                                }
                                            />
                                        </h4>
                                        <h6 className="sm:text-xl font-normal text-white mt-3 transition-all opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 duration-300">
                                            <Link
                                                to={`/product-details/${item.Product.productId}`}
                                            >
                                                {item.Product.productName}
                                            </Link>
                                        </h6>

                                        {/* buttons */}
                                        <div className="mt-4 sm:mt-5 flex gap-[10px] opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-700">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/product-details/${item.Product.productId}?variant=${item.productVariantId}`
                                                    )
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <LuEye className="size-6" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <RiShoppingBag2Line className="size-6" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleAddToWishlist(item)
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <LuHeart className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side - 5th product big */}
                <div className="grid grid-cols-1">
                    {bestSellers.slice(4, 5).map((item) => (
                        <div key={item.productVariantId}>
                            <div className="relative group overflow-hidden best-seller-pdct">
                                <img
                                    className="w-full transform duration-300 group-hover:scale-110"
                                    src={`${API_BASE_URL}/uploads/${item.productVariantImage}`}
                                    alt={item.Product.productName}
                                />
                                <div className="absolute z-10 top-0 left-0 w-full h-full items-start justify-end flex flex-col p-7">
                                    <div>
                                        <h4 className="text-lg font-medium text-white opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300">
                                            <Price
                                                value={
                                                    item.Product
                                                        .productOfferPrice
                                                }
                                            />
                                        </h4>
                                        <h6 className="sm:text-xl font-normal text-white mt-3 transition-all opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 duration-300">
                                            <Link
                                                to={`/product-details/${item.Product.productId}`}
                                            >
                                                {item.Product.productName}
                                            </Link>
                                        </h6>

                                        {/* buttons */}
                                        <div className="mt-4 sm:mt-5 flex gap-[10px] opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-700">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/product-details/${item.Product.productId}?variant=${item.productVariantId}`
                                                    )
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <LuEye className="size-6" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <RiShoppingBag2Line className="size-6" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleAddToWishlist(item)
                                                }
                                                className="w-9 lg:w-12 h-9 flex items-center justify-center bg-white/20 text-white"
                                            >
                                                <LuHeart className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
        </div>
    )
}
