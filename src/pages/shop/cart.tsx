import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'

import bg from '../../assets/img/shortcode/breadcumb.jpg'

import Aos from 'aos'
import NavbarFour from '../../components/navbar/navbar-four'
import { Price } from '../../context/CurrencyContext'
import IncreDre from '../../components/incre-dre'
import { getStoredUser } from '../../utils/user'
import { API_BASE_URL } from "../../utils/api";

interface Product {
  productName: string
  productImage: string
  productOfferPrice: number
  categoryName: string
}

interface ProductVariant {
  productVariantImage?: string
  productColor?: string
  stockQuantity?: number
  Stock?: { availableStock: number }
  Product: Product
}

interface CartItem {
  cartId: number
  quantity: number
  ProductVariant: ProductVariant
}

const imageBaseUrl = `${API_BASE_URL}/uploads/`
export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    // const [coupon,] = useState('')
    const [couponDiscount, ] = useState(0)
    // const [error, setError] = useState('')

    const subTotal = cartItems.reduce(
        (sum, item) =>
            sum + item.ProductVariant.Product.productOfferPrice * item.quantity,
        0
    )

    // Example: Apply coupon (for now, just hardcode or fetch from state)
    // change later if you implement coupon logic
    // const applyCoupon = async () => {
    //     setError('')
    //     if (!coupon) {
    //         setError('Please enter a coupon code')
    //         return
    //     }

    //     try {
    //         const res = await fetch(
    //             'https://tamiraaapi.tamiraa.com/api/coupons/validate',
    //             {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({
    //                     couponCodeName: coupon,
    //                     cartTotal: subTotal,
    //                 }),
    //             }
    //         )

    //         const data = await res.json()

    //         if (!data.success) {
    //             setError(data.message || 'Invalid coupon')
    //             setCouponDiscount(0)
    //             return
    //         }

    //         setCouponDiscount(data.discount) //  backend sends discount amount
    //     } catch (err) {
    //         console.error('Coupon apply failed:', err)
    //         setError('Something went wrong')
    //     }
    // }

    // Example: GST 5%
    // const gst = subTotal * 0.05;

    // Example: Shipping (choose one option)
    const shipping = 0 // Free shipping by default

    // Final total
    const total = subTotal - couponDiscount + shipping

    useEffect(() => {
        Aos.init()

        const user = getStoredUser()
        if (!user?.id) return

        fetch(`${API_BASE_URL}/api/cart/${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Cart API response:', data)
                if (Array.isArray(data)) {
                    setCartItems(data)
                }
            })
            .catch((err) => console.error('Error fetching cart:', err))
    }, [])

    useEffect(() => {
        Aos.init()
    })
    return (
        <>
            <NavbarFour />

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
                        Cart
                    </h2>
                    <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg leading-none font-normal text-white mt-3 sm:mt-4 flex-wrap">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>/</li>
                        <li className="text-primary">Cart</li>
                    </ul>
                </div>
            </div>

            <div className="s-py-100">
                <div className="container ">
                    <div className="flex xl:flex-row flex-col gap-[30px] lg:gap-[30px] xl:gap-[70px]">
                        <div
                            className="flex-1 overflow-x-auto"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <table
                                id="cart-table"
                                className="responsive nowrap table-wrapper"
                                style={{ width: '100%' }}
                            >
                                <thead className="table-header">
                                    <tr>
                                        <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">
                                            Product Info
                                        </th>
                                        <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">
                                            Price
                                        </th>
                                        <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">
                                            Quantity
                                        </th>
                                        <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">
                                            Total
                                        </th>
                                        <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">
                                            Remove
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="table-body">
                                    {cartItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-center py-6"
                                            >
                                                Your cart is empty
                                            </td>
                                        </tr>
                                    ) : (
                                        cartItems.map((item) => (
                                            <tr key={item.cartId}>
                                                <td className="md:w-[42%]">
                                                    <div className="flex items-center gap-3 md:gap-4 lg:gap-6 cart-product my-4">
                                                        <div className="w-14 sm:w-20 flex-none">
                                                            {/* <img
                                                                src={
                                                                    item
                                                                        .ProductVariant
                                                                        .productVariantImage ||
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productImage
                                                                }
                                                                alt={
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productName
                                                                }
                                                            /> */}

                                                            <img
                                                                src={`${imageBaseUrl}${
                                                                    item
                                                                        .ProductVariant
                                                                        .productVariantImage ||
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productImage
                                                                }`}
                                                                alt={
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productName
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h6>
                                                                {
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .categoryName
                                                                }
                                                            </h6>
                                                            <h5>
                                                                {
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productName
                                                                }
                                                            </h5>
                                                            {/* ✅ Show product color as square only */}
                                                            {item.ProductVariant
                                                                .productColor && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-md font-medium">
                                                                        Color :
                                                                    </span>
                                                                    <span
                                                                        className="w-4 h-4 border" // removed 'rounded-full' to make square
                                                                        style={{
                                                                            backgroundColor:
                                                                                item
                                                                                    .ProductVariant
                                                                                    .productColor,
                                                                        }}
                                                                    />
                                                                    {/* Remove the text span if you don't want the color code */}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {/* Unit Price */}
                                                    <h6 className="text-base md:text-lg font-semibold">
                                                        <Price
                                                            value={
                                                                item
                                                                    .ProductVariant
                                                                    .Product
                                                                    .productOfferPrice
                                                            }
                                                        />
                                                    </h6>
                                                </td>
                                                <td>
                                                    <IncreDre
                                                        count={item.quantity}
                                                        onChange={(
                                                            q: number
                                                        ) => {
                                                            const maxStock =
                                                                item
                                                                    .ProductVariant
                                                                    .Stock
                                                                    ?.availableStock ??
                                                                item
                                                                    .ProductVariant
                                                                    .stockQuantity

                                                            if (q <= 0) return
                                                            
                                                          if (maxStock === undefined) {
                                                            alert("Stock information not available")
                                                            return
                                                          }
                                                          
                                                          if (q > maxStock) {
                                                            alert(`Only ${maxStock} items available in stock`)
                                                            return
                                                          }

                                                            // Optimistic update
                                                            setCartItems(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (p) =>
                                                                            p.cartId ===
                                                                            item.cartId
                                                                                ? {
                                                                                      ...p,
                                                                                      quantity:
                                                                                          q,
                                                                                  }
                                                                                : p
                                                                    )
                                                            )

                                                            // Sync with backend
                                                            fetch(
                                                                `${API_BASE_URL}/api/cart/update/${item.cartId}`,
                                                                {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        'Content-Type':
                                                                            'application/json',
                                                                    },
                                                                    body: JSON.stringify(
                                                                        {
                                                                            quantity:
                                                                                q,
                                                                        }
                                                                    ),
                                                                }
                                                            ).catch((err) =>
                                                                console.error(
                                                                    'Update failed:',
                                                                    err
                                                                )
                                                            )
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <h6 className="text-base md:text-lg font-semibold">
                                                        <Price
                                                            value={
                                                                Number(
                                                                    item
                                                                        .ProductVariant
                                                                        .Product
                                                                        .productOfferPrice
                                                                ) *
                                                                item.quantity
                                                            }
                                                        />
                                                    </h6>
                                                </td>
                                                <td>
                                                    <button
                                                        // flex items-center
                                                        className="w-8 h-8 bg-[#E8E9EA] dark:bg-dark-secondary  justify-center ml-auto duration-300 text-title dark:text-white"
                                                        onClick={() => {
                                                            // remove from cart
                                                            fetch(
                                                                `${API_BASE_URL}/api/cart/${item.cartId}`,
                                                                {
                                                                    method: 'DELETE',
                                                                }
                                                            )
                                                                .then(() =>
                                                                    setCartItems(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev.filter(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    p.cartId !==
                                                                                    item.cartId
                                                                            )
                                                                    )
                                                                )
                                                                .catch((err) =>
                                                                    console.error(
                                                                        'Error removing:',
                                                                        err
                                                                    )
                                                                )
                                                        }}
                                                    >
                                                        ❌
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="300">
                            {/* <div className="mb-[30px]">
                                <h4 className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white mb-[15px]">
                                    Promo Code
                                </h4>
                                <div className="flex xs:flex-row flex-col gap-3">
                                    <input
                                        className="h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 placeholder:text-title dark:placeholder:text-white flex-1"
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button
                                     className="btn btn-solid"
                                     data-text="Apply"
                                     onClick={applyCoupon}
                                   >
                                     <span>Apply</span>
                                   </button>
                                </div>
                            </div> */}
                            <div className="bg-[#FAFAFA] dark:bg-dark-secondary pt-[30px] md:pt-[40px] px-[30px] md:px-[40px] pb-[30px] border border-[#17243026] border-opacity-15 rounded-xl">
                                <div className="text-right flex justify-end flex-col w-full ml-auto mr-0">
                                    <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium">
                                        <span>Sub Total:</span>
                                        <span>
                                            <Price value={subTotal} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                        <span>Coupon Discount:</span>
                                        <span>
                                            <Price value={couponDiscount} />
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk">
                                    <div className="flex justify-between flex-wrap font-semibold leading-none text-2xl">
                                        <span>Total:</span>
                                        <span>
                                            <Price value={total} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:mt-[10px] py-5 flex items-end gap-3 flex-wrap justify-end">
                                <Link
                                    to="/allproducts"
                                    className="btn btn-sm btn-outline !text-title hover:!text-white before:!z-[-1] dark:!text-white dark:hover:!text-title"
                                >
                                    Continue Shopping
                                </Link>

                                <Link
                                    to="/checkout"
                                    className="btn btn-sm btn-outline !text-title hover:!text-white before:!z-[-1] dark:!text-white dark:hover:!text-title"
                                >
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterOne />

            <ScrollToTop />
        </>
    )
}
