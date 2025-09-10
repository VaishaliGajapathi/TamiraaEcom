import { Link } from 'react-router-dom'
import NavbarOne from '../../components/navbar/navbar-four'
import axios from 'axios'
import bg from '../../assets/img/shortcode/breadcumb.jpg'
// import cart1 from '../../assets/img/gallery/cart/cart-01.jpg'
// import cart2 from '../../assets/img/gallery/cart/cart-02.jpg'
// import cart3 from '../../assets/img/gallery/cart/cart-03.jpg'

import { useEffect, useState } from 'react'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'
import Aos from 'aos'
import { Price } from '../../context/CurrencyContext'
import IncreDre from '../../components/incre-dre'

const imageBaseUrl = `http://localhost:5000/uploads/`
export default function Checkout() {
    const [cartItems, setCartItems] = useState<any[]>([])
    const subTotal = cartItems.reduce(
        (sum, item) =>
            sum + item.ProductVariant.Product.productOfferPrice * item.quantity,
        0
    )

    // Example: Apply coupon (for now, just hardcode or fetch from state)
    const couponDiscount = 0 // change later if you implement coupon logic

    // Example: GST 5%
    // const gst = subTotal * 0.05;

    // Example: Shipping (choose one option)
    const shipping = 0 // Free shipping by default

    // Final total
    const total = subTotal - couponDiscount + shipping

    const [open, setOpen] = useState<boolean>(false)
    
    const [formData, setFormData] = useState({
        userId: '',
        fullName: '',
        email: '',
        phoneNo: '',
        townCity: '',
        zipCode: '',
        addressLine1: '',
        addressLine2: '',
        additionalText: '',
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                ...formData,
                userId: Number(formData.userId) || null,
            }
            const response = await axios.post(
                'http://localhost:5000/api/bill',
                dataToSend
            )
            alert('Bill created successfully!')
            console.log(response.data)
        } catch (error) {
            console.error(error)
            alert('Failed to submit billing information.')
        }
    }

    useEffect(() => {
        Aos.init()
    }, [])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setFormData((prev) => ({ ...prev, userId: parsedUser.id })) // dynamically set
            } catch (err) {
                console.error('Error parsing user:', err)
            }
        }
    }, [])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) return

        try {
            const user = JSON.parse(storedUser)
            if (!user?.id) return

            fetch(`http://localhost:5000/api/cart/${user.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) setCartItems(data)
                })
                .catch((err) => console.error('Error fetching cart:', err))
        } catch (e) {
            console.error('Invalid user in localStorage:', e)
        }
    }, [])

    

    return (
        <>
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-[80%] max-w-[80%] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                    />
                </div>
            )}

            <NavbarOne />

            <div
                className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="text-center w-full">
                    <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">
                        Checkout
                    </h2>
                    <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4 flex-wrap">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>/</li>
                        <li className="text-primary">Checkout</li>
                    </ul>
                </div>
            </div>

            <div className="s-py-100">
                <div className="container">
                    <div className="max-w-[1220px] mx-auto grid lg:grid-cols-2 gap-[30px] lg:gap-[70px]">
                        <div
                            className="bg-[#FAFAFA] dark:bg-dark-secondary p-[30px] md:p-[40px] lg:p-[50px] border border-[#17243026] border-opacity-15 rounded-xl"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <p className="mb-5 w-full bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 whitespace-normal">
                                Are you missing your coupon code ?
                                <button
                                    className="ml-1 add-coupon-code underline text-[#209A60]"
                                    onClick={() => setOpen(!open)}
                                >
                                    {' '}
                                    Click here to add
                                </button>
                            </p>

                            <div
                                className={`coupon-wrapper gap-3 flex mb-[30px] ${
                                    open ? '' : 'hidden'
                                }`}
                            >
                                <input
                                    className="max-w-[220px] w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                    type="text"
                                    placeholder="Coupon code"
                                />
                                <Link
                                    to="#"
                                    className="btn btn-sm-px btn-theme-solid "
                                    data-text="Apply coupon"
                                >
                                    <span>Apply coupon</span>
                                </Link>
                            </div>

                            <h4 className="font-semibold leading-none text-xl md:text-2xl mb-6 md:mb-[30px]">
                                Billing Information
                            </h4>
                            <div className="grid gap-5 md:gap-6">
                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Full Name
                                    </label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        type="text"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        type="email"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Phone No.
                                    </label>
                                    <input
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleChange}
                                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        type="text"
                                        placeholder="Type your phone number"
                                    />
                                </div>

                                {/* Keep other fields same, just add value & onChange */}
                                {/* Example for Town/City */}
                                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                                    <div>
                                        <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                            Town / City
                                        </label>
                                        <select
                                            name="townCity"
                                            value={formData.townCity}
                                            onChange={handleChange}
                                            className="nice-select select-active p-4 !bg-white dark:!bg-dark-secondary"
                                        >
                                            <option value="">
                                                Select City
                                            </option>
                                            <option value="Sylht">Sylht</option>
                                            <option value="Dhaka">Dhaka</option>
                                            <option value="Chittagong">
                                                Chittagong
                                            </option>
                                            <option value="Rajshahi">
                                                Rajshahi
                                            </option>
                                            <option value="Bogura">
                                                Bogura
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                            Zip Code
                                        </label>
                                        <input
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                            type="text"
                                            placeholder="1217"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Address Line 1
                                    </label>
                                    <input
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        type="text"
                                        placeholder="Your full address"
                                    />
                                </div>
                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Address Line 2
                                    </label>
                                    <input
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        type="text"
                                        placeholder="Your full address"
                                    />
                                </div>
                                <div>
                                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                        Additional Text
                                    </label>
                                    <textarea
                                        name="additionalText"
                                        value={formData.additionalText}
                                        onChange={handleChange}
                                        className="w-full h-[120px] bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                        placeholder="Type your message"
                                    ></textarea>
                                </div>
                                {/* <div>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-theme-solid"
                                        data-text="Submit"
                                    >
                                        <span>Submit</span>
                                    </button>
                                </div> */}
                            </div>
                        </div>

                        <div>
                            <div
                                className="bg-[#FAFAFA] dark:bg-dark-secondary pt-[30px] md:pt-[40px] lg:pt-[50px] px-[30px] md:px-[40px] lg:px-[50px] pb-[30px] border border-[#17243026] border-opacity-15 rounded-xl"
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                <h4 className="font-semibold leading-none text-xl md:text-2xl mb-6 md:mb-10">
                                    Product Information
                                </h4>
                                <div className="grid gap-5 mg:gap-6">
                                    {cartItems.map((item) => {
                                        const imageUrl = item.ProductVariant
                                            .productVariantImage
                                            ? `${imageBaseUrl}${item.ProductVariant.productVariantImage}`
                                            : `${imageBaseUrl}${item.ProductVariant.Product.productImage}`

                                        return (
                                            <div
                                                key={item.cartId}
                                                className="flex items-center justify-between gap-5"
                                            >

                                                
                                                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 cart-product flex-wrap">
                                                    <div className="w-16 sm:w-[70px] flex-none">
                                                        <img
                                                            src={imageUrl}
                                                            alt={
                                                                item
                                                                    .ProductVariant
                                                                    .Product
                                                                    .productName
                                                            }
                                                            className="cursor-pointer transition-transform duration-300 hover:scale-105"
                                                            onClick={() =>
                                                                setPreviewImage(
                                                                    imageUrl
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h6 className="leading-none font-medium">
                                                            {
                                                                item
                                                                    .ProductVariant
                                                                    .Product
                                                                    .categoryName
                                                            }
                                                        </h6>
                                                        <h5 className="font-semibold leading-none mt-2">
                                                            {
                                                                item
                                                                    .ProductVariant
                                                                    .Product
                                                                    .productName
                                                            }
                                                        </h5>
                                                    </div>
                                                </div>
                                                <h6 className="leading-none">
                                                    <Price
                                                        value={
                                                            item.ProductVariant
                                                                .Product
                                                                .productOfferPrice *
                                                            item.quantity
                                                        }
                                                    />
                                                </h6>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk text-right flex justify-end flex-col w-full ml-auto mr-0">
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
                                    {/* <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                        <span>VAT:</span>
                                        <span>
                                            {' '}
                                            <Price value={5.0} />
                                        </span>
                                    </div> */}
                                </div>
                                {/* <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk">
                                    <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                        <div>
                                            <label className="flex items-center gap-[10px] categoryies-iteem">
                                                <input
                                                    className="appearance-none hidden"
                                                    type="radio"
                                                    name="item-type"
                                                />
                                                <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                    <svg
                                                        className="duration-300 opacity-0"
                                                        width="8"
                                                        height="8"
                                                        viewBox="0 0 10 10"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="10"
                                                            height="10"
                                                            rx="5"
                                                            fill="#BB976D"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">
                                                    Free Shipping:
                                                </span>
                                            </label>
                                        </div>
                                        <span>
                                            {' '}
                                            <Price value={0.0} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                        <div>
                                            <label className="flex items-center gap-[10px] categoryies-iteem">
                                                <input
                                                    className="appearance-none hidden"
                                                    type="radio"
                                                    name="item-type"
                                                />
                                                <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                    <svg
                                                        className="duration-300 opacity-0"
                                                        width="8"
                                                        height="8"
                                                        viewBox="0 0 10 10"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="10"
                                                            height="10"
                                                            rx="5"
                                                            fill="#BB976D"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">
                                                    Fast Shipping:
                                                </span>
                                            </label>
                                        </div>
                                        <span>
                                            <Price value={10.0} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                        <div>
                                            <label className="flex items-center gap-[10px] categoryies-iteem">
                                                <input
                                                    className="appearance-none hidden"
                                                    type="radio"
                                                    name="item-type"
                                                />
                                                <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                    <svg
                                                        className="duration-300 opacity-0"
                                                        width="8"
                                                        height="8"
                                                        viewBox="0 0 10 10"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            width="10"
                                                            height="10"
                                                            rx="5"
                                                            fill="#BB976D"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">
                                                    {' '}
                                                    Local Pickup:
                                                </span>
                                            </label>
                                        </div>
                                        <span>
                                            <Price value={15.0} />
                                        </span>
                                    </div>
                                </div> */}
                                <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk">
                                    <div className="flex justify-between flex-wrap font-semibold leading-none text-2xl md:text-3xl">
                                        <span>Total:</span>
                                        <span>
                                            &nbsp;
                                            <Price value={total} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="mt-7 md:mt-12"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <h4 className="font-semibold leading-none text-xl md:text-2xl mb-6 md:mb-10">
                                    Payment Method
                                </h4>
                                <div className="flex gap-5 sm:gap-8 md:gap-12 flex-wrap">
                                    <div>
                                        <label className="flex items-center gap-[10px] categoryies-iteem">
                                            <input
                                                className="appearance-none hidden"
                                                type="radio"
                                                name="item-type"
                                            />
                                            <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                <svg
                                                    className="duration-300 opacity-0"
                                                    width="8"
                                                    height="8"
                                                    viewBox="0 0 10 10"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <rect
                                                        width="10"
                                                        height="10"
                                                        rx="5"
                                                        fill="#BB976D"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">
                                                Cash On Delivery
                                            </span>
                                        </label>
                                        <p className="ml-6 text-[15px] leading-none mt-2">
                                            Time ( 07 - 10 ) Days
                                        </p>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-[10px] categoryies-iteem">
                                            <input
                                                className="appearance-none hidden"
                                                type="radio"
                                                name="item-type"
                                            />
                                            <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                <svg
                                                    className="duration-300 opacity-0"
                                                    width="8"
                                                    height="8"
                                                    viewBox="0 0 10 10"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <rect
                                                        width="10"
                                                        height="10"
                                                        rx="5"
                                                        fill="#BB976D"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">
                                                Debit / Credit Card
                                            </span>
                                        </label>
                                        <p className="ml-6 text-[15px] leading-none mt-2">
                                            Time ( 07 - 10 ) Days
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 sm:mt-8 md:mt-10">
                                    <label className="flex items-center gap-2 iam-agree">
                                        <input
                                            className="appearance-none hidden"
                                            type="checkbox"
                                            name="categories"
                                        />
                                        <span className="w-6 h-6 rounded-[5px] border-2 border-title dark:border-white flex items-center justify-center duration-300">
                                            <svg
                                                className="duration-300 opacity-0 text-title dark:text-white fill-current"
                                                width="15"
                                                height="12"
                                                viewBox="0 0 20 15"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M18.3819 0.742676L6.10461 11.8998L2.25731 8.06381L0.763672 9.55745L6.20645 15.0002L20 2.32686L18.3819 0.742676Z" />
                                            </svg>
                                        </span>
                                        <span className="text-base sm:text-lg text-title dark:text-white leading-none sm:leading-none select-none inline-block transform translate-y-[3px]">
                                            I Agree all terms & Conditions
                                        </span>
                                    </label>
                                </div>
                                <div className="mt-4 md:mt-6 flex flex-wrap gap-3">
                                    <Link
                                        to="/cart"
                                        className="btn btn-outline"
                                        data-text="Back to Cart"
                                    >
                                        <span>Back to Cart</span>
                                    </Link>
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-theme-solid"
                                        data-text="Place to Order"
                                    >
                                        <span>Place to Order</span>
                                    </button>
                                </div>
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
