import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import NavbarOne from '../../components/navbar/navbar-one'
import SliderOne from '../../components/banner-slider/slider-one'
import LayoutOne from '../../components/product/layout-one'
import FooterOne from '../../components/footer/footer-one'
import PartnerOne from '../../components/partner-one'
import ScrollToTop from '../../components/scroll-to-top'
import BlogOne from '../../components/blog/blog-one'

import { categoryOne, featureOne } from '../../data/data'
import { useProducts } from '../../hooks/useProducts'
import OwlCarousel from 'react-owl-carousel'

import chair from '../../assets/img/svg/chair.svg'
import sofa from '../../assets/img/svg/sofa.svg'
import bg from '../../assets/img/home-v1/choose-us-bg.jpg'
import like from '../../assets/img/svg/like.svg'
import bed from '../../assets/img/svg/bed.svg'
import comment from '../../assets/img/svg/comment.svg'
import hand from '../../assets/img/svg/hand.svg'

import AOS from 'aos'

function Index() {
    const { products, loading, error } = useProducts();
    
    useEffect(() => {
        AOS.init()
    }, [])
    const carouselRef = useRef<OwlCarousel | null>(null)

    const goToPrevSlide = () => {
        if (carouselRef.current) {
            carouselRef.current?.prev(300)
        }
    }

    const goToNextSlide = () => {
        if (carouselRef.current) {
            carouselRef.current?.next(300)
        }
    }

    // Show loading state
    if (loading) {
        return (
            <>
                <NavbarOne />
                <SliderOne />
                <div className="s-py-100-50 overflow-hidden">
                    <div className="container-fluid">
                        <div className="max-w-xl mx-auto mb-8 md:mb-12 text-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-lg">Loading products...</p>
                        </div>
                    </div>
                </div>
                <FooterOne />
            </>
        );
    }

    // Show error state
    if (error) {
        return (
            <>
                <NavbarOne />
                <SliderOne />
                <div className="s-py-100-50 overflow-hidden">
                    <div className="container-fluid">
                        <div className="max-w-xl mx-auto mb-8 md:mb-12 text-center">
                            <div className="text-red-500 text-lg mb-4">Error loading products</div>
                            <p className="text-gray-600">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
                <FooterOne />
            </>
        );
    }

    return (
        <>
            <NavbarOne />
            <SliderOne />

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={chair}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            Product Category
                        </h3>
                        <p className="mt-3">
                            Explore our curated selection of premium products,
                            tailored to suit every need and taste. From
                            essentials to indulgences, find your perfect fit.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto relative group"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <OwlCarousel
                            autoplay={true}
                            loop={true}
                            margin={15}
                            autoplayTimeout={5000}
                            autoplaySpeed={2000}
                            items={3}
                            responsive={{
                                0: { items: 1 },
                                768: { items: 2 },
                                991: { items: 3 },
                            }}
                            ref={carouselRef}
                            className="owl-carousel hv1-pdct-ctgry-slider"
                        >
                            {categoryOne.map((item, index) => {
                                return (
                                    <Link
                                        className="relative block"
                                        to="/product-category"
                                        key={index}
                                    >
                                        <div className="relative overflow-hidden rounded-[20px]">
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="w-full transform group-hover:scale-110 duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 duration-300"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <h4 className="text-xl font-semibold mb-2">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm opacity-90">
                                                        {item.item}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </OwlCarousel>
                        <button
                            onClick={goToPrevSlide}
                            className="icon hv1pdct_prev w-9 h-9 md:w-14 md:h-14 flex items-center justify-center text-title duration-300 bg-white hover:bg-primary transform p-2 absolute top-1/2  -translate-y-1/2 left-0 z-[999]"
                            aria-label="Prev Navigation"
                        >
                            <svg
                                className="fill-current"
                                width="24"
                                height="14"
                                viewBox="0 0 24 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M0.180223 7.38726L5.62434 12.8314C5.8199 13.0598 6.16359 13.0864 6.39195 12.8908C6.62031 12.6952 6.64693 12.3515 6.45132 12.1232C6.43307 12.1019 6.41324 12.082 6.39195 12.0638L1.87877 7.54516L23.4322 7.54516C23.7328 7.54516 23.9766 7.30141 23.9766 7.00072C23.9766 6.70003 23.7328 6.45632 23.4322 6.45632L1.87877 6.45632L6.39195 1.94314C6.62031 1.74758 6.64693 1.40389 6.45132 1.17553C6.25571 0.947171 5.91207 0.920551 5.68371 1.11616C5.66242 1.13441 5.64254 1.15424 5.62434 1.17553L0.180175 6.6197C-0.0308748 6.83196 -0.0308748 7.1749 0.180223 7.38726Z" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNextSlide}
                            className="icon hv1pdct_next w-9 h-9 md:w-14 md:h-14 flex items-center justify-center text-title duration-300 bg-white hover:bg-primary transform p-2 absolute top-1/2 -translate-y-1/2 right-0 z-[999]"
                            aria-label="Next Navigation"
                        >
                            <svg
                                className="fill-current"
                                width="24"
                                height="14"
                                viewBox="0 0 24 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M23.8198 6.61958L18.3757 1.17541C18.1801 0.947054 17.8364 0.920433 17.608 1.11604C17.3797 1.31161 17.3531 1.65529 17.5487 1.88366C17.5669 1.90494 17.5868 1.92483 17.608 1.94303L22.1212 6.46168L0.567835 6.46168C0.267191 6.46168 0.0234375 6.70543 0.0234375 7.00612C0.0234375 7.30681 0.267191 7.55052 0.567835 7.55052L22.1212 7.55052L17.608 12.0637C17.3797 12.2593 17.3531 12.6029 17.5487 12.8313C17.7443 13.0597 18.0879 13.0863 18.3163 12.8907C18.3376 12.8724 18.3575 12.8526 18.3757 12.8313L23.8198 7.38714C24.0309 7.17488 24.0309 6.83194 23.8198 6.61958Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={sofa}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            Featured Products
                        </h3>
                        <p className="mt-3">
                            Discover our handpicked selection of premium products,
                            carefully curated to meet your needs and exceed your
                            expectations.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {products.slice(0, 4).map((item, index) => {
                            return <LayoutOne item={item} key={index} />
                        })}
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-[1720px] mx-auto relative group"
                        data-aos="fade-up"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="relative">
                                <img
                                    src={bg}
                                    alt=""
                                    className="w-full rounded-[20px]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[20px]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h3 className="text-3xl font-bold mb-4">
                                            Why Choose Us
                                        </h3>
                                        <p className="text-lg opacity-90 max-w-md">
                                            We provide the best quality products with
                                            excellent customer service and competitive
                                            pricing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {featureOne.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-center p-6 rounded-[20px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={like}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            Best Sellers
                        </h3>
                        <p className="mt-3">
                            Our most popular products that customers love and
                            recommend. Discover what makes these items special.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {products.slice(0, 4).map((item, index) => {
                            return <LayoutOne item={item} key={index} />
                        })}
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-[1720px] mx-auto relative group"
                        data-aos="fade-up"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="relative">
                                <img
                                    src={bg}
                                    alt=""
                                    className="w-full rounded-[20px]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[20px]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h3 className="text-3xl font-bold mb-4">
                                            Quality Assurance
                                        </h3>
                                        <p className="text-lg opacity-90 max-w-md">
                                            Every product undergoes rigorous quality
                                            checks to ensure you receive only the best.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {featureOne.slice(0, 2).map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-center p-6 rounded-[20px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={bed}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            New Arrivals
                        </h3>
                        <p className="mt-3">
                            Be the first to discover our latest additions. Fresh
                            styles and innovative designs await you.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {products.slice(0, 4).map((item, index) => {
                            return <LayoutOne item={item} key={index} />
                        })}
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-[1720px] mx-auto relative group"
                        data-aos="fade-up"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="relative">
                                <img
                                    src={bg}
                                    alt=""
                                    className="w-full rounded-[20px]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[20px]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h3 className="text-3xl font-bold mb-4">
                                            Customer Satisfaction
                                        </h3>
                                        <p className="text-lg opacity-90 max-w-md">
                                            Your satisfaction is our priority. We're
                                            committed to providing exceptional service.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {featureOne.slice(2, 4).map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-center p-6 rounded-[20px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={comment}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            Customer Reviews
                        </h3>
                        <p className="mt-3">
                            Hear what our customers have to say about their
                            experience with our products and services.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {products.slice(0, 4).map((item, index) => {
                            return <LayoutOne item={item} key={index} />
                        })}
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-[1720px] mx-auto relative group"
                        data-aos="fade-up"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="relative">
                                <img
                                    src={bg}
                                    alt=""
                                    className="w-full rounded-[20px]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-[20px]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h3 className="text-3xl font-bold mb-4">
                                            Innovation
                                        </h3>
                                        <p className="text-lg opacity-90 max-w-md">
                                            We continuously innovate to bring you
                                            cutting-edge products and solutions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {featureOne.slice(0, 2).map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-center p-6 rounded-[20px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="s-py-100-50 overflow-hidden">
                <div className="container-fluid">
                    <div
                        className="max-w-xl mx-auto mb-8 md:mb-12 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <img
                                src={hand}
                                alt=""
                                className="mx-auto w-14 sm:w-24"
                            />
                        </div>
                        <h3 className="leading-none mt-4 md:mt-6 text-2xl md:text-3xl">
                            Special Offers
                        </h3>
                        <p className="mt-3">
                            Don't miss out on our exclusive deals and limited-time
                            offers. Save big on your favorite products.{' '}
                        </p>
                    </div>
                    <div
                        className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {products.slice(0, 4).map((item, index) => {
                            return <LayoutOne item={item} key={index} />
                        })}
                    </div>
                </div>
            </div>

            <PartnerOne />
            <BlogOne />
            <FooterOne />
            <ScrollToTop />
        </>
    )
}

export default Index
