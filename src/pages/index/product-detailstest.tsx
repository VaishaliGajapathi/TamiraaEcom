// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState, useRef, } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { useNavigate } from "react-router-dom";
// import { LuMinus, LuPlus } from 'react-icons/lu'
// import AOS from 'aos'

// import newprod1 from '../../assets/img/new_prods/prod_1.jpg'
// // import IncreDre from '../../components/incre-dre'
// import FooterOne from '../../components/footer/footer-one'
// import DetailTab from '../../components/product/detail-tab'
// // import LayoutOne from '../../components/product/layout-one'
// import ScrollToTop from '../../components/scroll-to-top'

// import { productList } from '../../data/data'
// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
// import NavbarFour from '../../components/navbar/navbar-four'
// import { Price } from '../../context/CurrencyContext'

// import { Swiper, SwiperSlide } from "swiper/react"
// import type { Swiper as SwiperType } from "swiper";
// import { Autoplay, Navigation, Thumbs } from "swiper/modules";
// import "swiper/css"
// import "swiper/css/navigation"
// import "swiper/css/thumbs"

// export default function ProductDetails() {
//     const navigate = useNavigate();
//     const [activeImage, setActiveImage] = useState<number>(1)
//     const [products, setProducts] = useState<any[]>([])
//     const [variants, setVariants] = useState<any[]>([])
//     const [childImages, setChildImages] = useState<any[]>([])
//     const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
//     const [count, setCount] = useState(1)
//     const swiperRef = useRef<SwiperType | null>(null);

   
//     useEffect(() => {
//         fetch("http://localhost:5000/api/product-variants")
//           .then(res => res.json())
//           .then(data => {
//             if (Array.isArray(data.data)) {
//               setVariants(data.data)
//             }
//           })
//           .catch(err => console.error("Error fetching variants:", err))
//       }, [])
    
//     useEffect(() => {
//          AOS.init()
       
//          fetch('http://localhost:5000/api/products')
//            .then((res) => res.json())
//            .then((data) => {
//              if (Array.isArray(data)) {
//                setProducts(data)
//              } else if (data.data) {
//                setProducts(data.data) // if API wraps in { data: [...] }
//              }
//            })
//            .catch((err) => console.error('Error fetching products:', err))
//        }, [])

//         const params = useParams()
//     const id: any = params.id

    
//      const currentVariant = variants.find(v => v.productId === parseInt(id))
//     const stock = currentVariant?.stockQuantity || 0
    
//     const variantImageUrl = currentVariant
//   ? `http://localhost:5000/uploads/${currentVariant.productVariantImage}`
//   : newprod1 // fallback image


// //   const handleAddToWishlist = async () => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user") || "{}");

// //     //  use "id" instead of "userId"
// //     if (!user?.id) {
// //       alert("Please login to add to wishlist");
// //       return;
// //     }

// //     if (!currentVariant?.productVariantId) {
// //       alert("No product variant selected");
// //       return;
// //     }

// //     const res = await fetch("http://localhost:5000/api/wishlist/add", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         userId: user.id, //  backend expects userId, but localStorage key is "id"
// //         productVariantId: currentVariant.productVariantId,
// //       }),
// //     });

// //     const data = await res.json();

// //     if (res.ok) {
// //       alert("Added to wishlist ");
// //        navigate("/wishlist");
// //     } else {
// //       alert(data.message || "Failed to add to wishlist ");
// //     }
// //   } catch (err) {
// //     console.error("Error adding to wishlist:", err);
// //     alert("Something went wrong ");
// //   }
// // };

// const handleAddToWishlist = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

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
//         userId: user.id,
//         productVariantId: currentVariant.productVariantId,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       if (data.message === "Product already in wishlist") {
//         alert("Product already in wishlist");
//         navigate("/wishlist"); // ✅ navigate even if already there
//       } else {
//         alert("Added to wishlist");
//         navigate("/wishlist"); // ✅ navigate on success
//       }
//     } else {
//       alert(data.message || "Failed to add to wishlist");
//     }
//   } catch (err) {
//     console.error("Error adding to wishlist:", err);
//     alert("Something went wrong");
//   }
// };


// const handleAddToCart = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     if (!user?.id) {
//       alert("Please login to add to cart");
//       return;
//     }

//     if (!currentVariant?.productVariantId) {
//       alert("No product variant selected");
//       return;
//     }

//     const res = await fetch("http://localhost:5000/api/cart/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,  // ✅ backend expects userId
//         productVariantId: currentVariant.productVariantId,
//         quantity: count,  // ✅ pass selected quantity
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Added to cart");
//       navigate("/cart");
//     } else {
//       alert(data.message || "Failed to add to cart");
//     }
//   } catch (err) {
//     console.error("Error adding to cart:", err);
//     alert("Something went wrong");
//   }
// };


//     const data = productList.find((item) => item.id === parseInt(id))

//     const product = products.find((item) => item.productId === parseInt(id))

//        useEffect(() => {
//            if (currentVariant?.productVariantId) {
//              fetch(`http://localhost:5000/api/product-variant-images/${currentVariant.productVariantId}`)
//                .then(res => res.json())
//                .then(data => {
//                  if (Array.isArray(data.data)) {
//                    setChildImages(data.data)
//                  }
//                })
//                .catch(err => console.error("Error fetching child images:", err))
//            }
//          }, [currentVariant])

//          useEffect(() => {
//   if (swiperRef.current) {
//     swiperRef.current.autoplay.start();
//   }
// }, [childImages]);
    

//     useEffect(() => {
//         AOS.init()
//     }, [])

   

//     return (
//         <>
//             <NavbarFour />
//             <div className="bg-[#F8F5F0] dark:bg-dark-secondary py-5 md:py-[30px] xl:pt-56">
//                 <div className="container-fluid">
//                     <ul className="flex items-center gap-[10px] text-base md:text-lg leading-none font-normal text-title dark:text-white max-w-[1720px] mx-auto flex-wrap">
//                         <li>
//                             <Link to="/">Home</Link>
//                         </li>
//                         <li>/</li>
//                         <li>
//                             <Link to="/shop-v1">Shop</Link>
//                         </li>
//                         <li>/</li>
//                         <li className="text-primary">
//                             {data?.name
//                                 ? data?.name
//                                 : 'Classic Relaxable Chair'}
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             <div className="s-py-50" data-aos="fade-up">
//                 <div className="container-fluid">
//                     <div className="max-w-[1720px] mx-auto flex justify-between gap-10 flex-col lg:flex-row">
//                         <div className="w-full lg:w-[58%]">
//                             <div className="relative product-dtls-wrapper">
//                                 <button className="absolute top-5 left-0 p-2 bg-[#E13939] text-lg leading-none text-white font-medium z-50">
//                                     -10%
//                                 </button>
//                                 {/* <div className="product-dtls-slider ">
//                                     <div
//                                         className={
//                                             activeImage === 1 ? '' : 'hidden'
//                                         }
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             className="w-full"
//                                             alt="product"
//                                         />
//                                     </div>
                                   
                                    
//                                 </div> */}

//                                 <div className="product-dtls-slider">
//                                   {childImages.length > 0 ? (
//                                     childImages.map((img, index) => (
//                                       <div key={img.childImageId} className={activeImage === index + 1 ? "" : "hidden"}>
//                                         <img
//                                           src={`http://localhost:5000/uploads/${img.childImage}`}
//                                           alt={`Variant ${currentVariant?.productId}`}
//                                           className="w-full"
//                                         />
//                                       </div>
//                                     ))
//                                   ) : (
//                                     <img src={variantImageUrl} className="w-full" alt={product?.productName || "Product"} />
//                                   )}
//                                 </div>

                               
//                                 {/* <div className="product-dtls-nav">
//                                     <div
//                                         onClick={() => setActiveImage(1)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div
//                                         onClick={() => setActiveImage(2)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div
//                                         onClick={() => setActiveImage(3)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div onClick={() => setActiveImage(4)}>
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                 </div> */}

//                                 <div className="product-dtls-nav">
//   <Swiper
//   direction="vertical"
//   spaceBetween={10}
//   slidesPerView={4}
//   loop={true}
//   observer={true}
//   observeParents={true}
//   autoplay={{
//     delay: 2000,
//     disableOnInteraction: false,
//     pauseOnMouseEnter: false,
//   }}
//    onSwiper={(swiper) => (swiperRef.current = swiper)}
//   modules={[Navigation, Autoplay]}
//   className="h-[1100px]"
// >
//     {childImages.length > 0 ? (
//       childImages.map((img, index) => (
//         <SwiperSlide
//           key={img.childImageId}
//           onClick={() => setActiveImage(index + 1)}
//         >
//           <img
//             src={`http://localhost:5000/uploads/${img.childImage}`}
//             alt={`Variant ${currentVariant?.productVariantId} - ${index + 1}`}
//             className="cursor-pointer"
//           />
//         </SwiperSlide>
//       ))
//     ) : (
//       <SwiperSlide>
//         <img
//           src={variantImageUrl}
//           alt={product?.productName || "Product"}
//           className="cursor-pointer"
//         />
//       </SwiperSlide>
//     )}
//   </Swiper>
// </div>
//                             </div>
//                         </div>
//                         <div className="lg:max-w-[635px] w-full">
//                             <div className="pb-4 sm:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk">
//                                 <h2 className="font-semibold leading-none">
//                                     {product?.productName || "Classic Relaxable Chair"}
//                                 </h2>
//                                 <div className="flex gap-4 items-center mt-[15px]">
//                                     <span className="text-lg sm:text-xl leading-none pb-[5px] text-title line-through pl-2 inline-block dark:text-white">
//                                     <Price value={product?.productMrpPrice || 0} />
//                                     </span>
//                                     <span className="text-2xl sm:text-3xl text-primary leading-none block">
//                                     <Price value={product?.productOfferPrice || 0} />
//                                     </span>
//                                 </div>

                            

//                                 <p className="sm:text-lg mt-5 md:mt-7">
                                   

//                                     {product?.productDescription || "No description available."}
//                                 </p>
//                             </div>
//                             <div
//                                 className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
//                                 data-aos="fade-up"
//                                 data-aos-delay="200"
//                             >
//                                 {/* <IncreDre /> */}
//                                 <div className="inc-dec flex items-center gap-2">
//                                   {/* Decrement */}
//                                   <div
//                                     className="dec w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center cursor-pointer"
//                                     onClick={() => setCount(count > 1 ? count - 1 : 1)}
//                                   >
//                                     <LuMinus className="text-title dark:text-white" />
//                                   </div>
                                
//                                   {/* Count Input */}
//                                   <input
//                                     className="w-10 h-auto outline-none bg-transparent text-base md:text-lg leading-none text-title dark:text-white text-center"
//                                     type="text"
//                                     value={count}
//                                     readOnly
//                                   />
                                
//                                   {/* Increment */}
//                                   <div
//                                     className={`inc w-6 h-6 flex items-center justify-center cursor-pointer ${
//                                       count >= stock ? "opacity-50 cursor-not-allowed" : "bg-[#E8E9EA] dark:bg-dark-secondary"
//                                     }`}
//                                     onClick={() => {
//                                       if (count < stock) {
//                                         setCount(count + 1)
//                                       }
//                                     }}
//                                   >
//                                     <LuPlus className="text-title dark:text-white" />
//                                   </div>
//                                 </div>

//                                 <div className="flex gap-4 mt-4 sm:mt-6">
//                                     <button
//                                       onClick={handleAddToCart}
//                                       className="btn btn-solid"
//                                     >
//                                       <span>Add to Cart</span>
//                                     </button>
//                                     {/* <Link
//                                         to="/cart"
//                                         className="btn btn-solid"
//                                         data-text="Add to Cart"
//                                     >
//                                         <span>Add to Cart</span>
//                                     </Link> */}
//                                     {/* <Link
//                                         to="/wishlist"
//                                         className="btn btn-outline"
//                                         data-text="Add to Wishlist"
//                                     >
//                                         <span>Add to Wishlist</span>
//                                     </Link> */}
//                                     <button
//                                       onClick={handleAddToWishlist}
//                                       className="btn btn-outline"
//                                     >
//                                       <span>Add to Wishlist</span>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div
//                                 className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
//                                 data-aos="fade-up"
//                                 data-aos-delay="300"
//                             >
//                                 <div className="flex gap-x-12 gap-y-3 flex-wrap">
//                                     <h6 className="leading-none font-medium">
//                                         SKU : CH_0015
//                                     </h6>
//                                     <h6 className="leading-none font-medium">
//                                         Category : Saree
//                                     </h6>
//                                 </div>
//                                 <div className="flex gap-x-12 lg:gap-x-24 gap-y-3 flex-wrap mt-5 sm:mt-10">
//                                     <div className="flex gap-[10px] items-center">
//                                         <h6 className="leading-none font-medium">
//                                             Size :
//                                         </h6>
//                                         <div className="flex gap-[10px]">
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                     checked
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     S
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     M
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     L
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     XL
//                                                 </span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-[10px] items-center">
//                                         <h6 className="leading-none font-medium">
//                                             Color :
//                                         </h6>
//                                         <div className="flex gap-[10px] items-center">
//                                             <label className="product-color">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="color"
//                                                 />
//                                                 <span className="border border-[#D68553] flex rounded-full border-opacity-0 duration-300 p-1">
//                                                     <span className="w-4 h-4 rounded-full bg-[#D68553] flex"></span>
//                                                 </span>
//                                             </label>
//                                             <label className="product-color">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="color"
//                                                     checked
//                                                 />
//                                                 <span className="border border-[#61646E] flex rounded-full border-opacity-0 duration-300 p-1">
//                                                     <span className="w-4 h-4 rounded-full bg-[#61646E] flex"></span>
//                                                 </span>
//                                             </label>
//                                             <label className="product-color">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="color"
//                                                 />
//                                                 <span className="border border-[#E9E3DC] flex rounded-full border-opacity-0 duration-300 p-1">
//                                                     <span className="w-4 h-4 rounded-full bg-[#E9E3DC] flex"></span>
//                                                 </span>
//                                             </label>
//                                             <label className="product-color">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="color"
//                                                 />
//                                                 <span className="border border-[#9A9088] flex rounded-full border-opacity-0 duration-300 p-1">
//                                                     <span className="w-4 h-4 rounded-full bg-[#9A9088] flex"></span>
//                                                 </span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div
//                                 className="pt-4 sm:pt-6"
//                                 data-aos="fade-up"
//                                 data-aos-delay="200"
//                             >
//                                 <div className="flex items-center gap-6">
//                                     <h6 className="font-normal">Share : </h6>
//                                     <div className="flex gap-6">
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaFacebookF className="size-5" />
//                                         </Link>
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaTwitter className="size-5" />
//                                         </Link>
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaInstagram className="size-5" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="s-py-50">
//                 <div className="container-fluid">
//                     <DetailTab />
//                 </div>
//             </div>

//             <div
//                 className="s-py-50-100"
//                 data-aos="fade-up"
//                 data-aos-delay="200"
//             >
//                 <div className="container-fluid">
//                     <div className="max-w-[547px] mx-auto text-center">
//                         <h6 className="text-2xl sm:text-3xl md:text-4xl leading-none">
//                             Related Products
//                         </h6>
//                         <p className="mt-3">
//                             Explore complementary options that enhance your
//                             experience. Discover related products curated just
//                             for you.{' '}
//                         </p>
//                     </div>
//                     <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8 pt-8 md:pt-[50px]">
//                         {/* {productList.slice(0, 4).map((item, index) => {
//                             return <LayoutOne item={item} key={index} />
//                         })} */}
                        

//                         {products.map((item, index) => (
//                          <div className="group" key={index}>
//                            <div className="relative overflow-hidden">
//                              <Link to={`/product-details/${item.productId}`}>
//                                <img
//                                  src={`http://localhost:5000/uploads/${item.productImage}`}
//                                  alt={item.productName}
//                                  className="w-full transform group-hover:scale-110 duration-300"
//                                />
//                              </Link>
//                            </div>
                           
//                            <h3 className="text-lg font-semibold mt-4">₹{item.productOfferPrice}</h3>
//                            <h3 className="text-lg font-semibold">{item.productName}</h3>
//                          </div>
//                        ))}

//                     </div>
//                 </div>
//             </div>

//             <FooterOne />

//             <ScrollToTop />
//         </>
//     )
// }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState, useRef, } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { LuMinus, LuPlus } from 'react-icons/lu'
// import AOS from 'aos'

// import newprod1 from '../../assets/img/new_prods/prod_1.jpg'
// // import IncreDre from '../../components/incre-dre'
// import FooterOne from '../../components/footer/footer-one'
// import DetailTab from '../../components/product/detail-tab'
// // import LayoutOne from '../../components/product/layout-one'
// import ScrollToTop from '../../components/scroll-to-top'

// import { productList } from '../../data/data'
// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
// import NavbarFour from '../../components/navbar/navbar-four'
// import { Price } from '../../context/CurrencyContext'

// import { Swiper, SwiperSlide } from "swiper/react"
// import type { Swiper as SwiperType } from "swiper";
// import { Autoplay, Navigation, Thumbs } from "swiper/modules";
// import "swiper/css"
// import "swiper/css/navigation"
// import "swiper/css/thumbs"

// export default function ProductDetails() {
//     const navigate = useNavigate();
//     const [activeImage, setActiveImage] = useState<number>(1)
//     const [products, setProducts] = useState<any[]>([])
//     const [variants, setVariants] = useState<any[]>([])
//     const [childImages, setChildImages] = useState<any[]>([])
//     const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
//     const [count, setCount] = useState(1)
    
//     const swiperRef = useRef<SwiperType | null>(null);
//     const location = useLocation();
// const queryParams = new URLSearchParams(location.search);
// const initialVariantId = queryParams.get("variant");

// const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
//   initialVariantId ? parseInt(initialVariantId, 10) : null
// );

   
//     useEffect(() => {
//         fetch("http://localhost:5000/api/product-variants")
//           .then(res => res.json())
//           .then(data => {
//             if (Array.isArray(data.data)) {
//               setVariants(data.data)
//             }
//           })
//           .catch(err => console.error("Error fetching variants:", err))
//       }, [])
    
//     useEffect(() => {
//          AOS.init()
       
//          fetch('http://localhost:5000/api/products')
//            .then((res) => res.json())
//            .then((data) => {
//              if (Array.isArray(data)) {
//                setProducts(data)
//              } else if (data.data) {
//                setProducts(data.data) // if API wraps in { data: [...] }
//              }
//            })
//            .catch((err) => console.error('Error fetching products:', err))
//        }, [])

//         const params = useParams()
//     const id: any = params.id

//     // grab productId from params
// const productId = parseInt(id as string, 10);


//    const currentVariant =
//   variants.find((v) => v.variantId === selectedVariantId) ||
//   variants.find((v) => v.productId === productId) ||
//   null;

// const stock = currentVariant?.stockQuantity ?? 0;

// //     const currentVariant =
// //   variants.find((v) => v.variantId === selectedVariantId) ||
// //   variants.find((v) => v.productId === parseInt(id));
    
    
//     const variantImageUrl = currentVariant
//   ? `http://localhost:5000/uploads/${currentVariant.productVariantImage}`
//   : newprod1 // fallback image


// //   const handleAddToWishlist = async () => {
// //   try {
// //     const user = JSON.parse(localStorage.getItem("user") || "{}");

// //     //  use "id" instead of "userId"
// //     if (!user?.id) {
// //       alert("Please login to add to wishlist");
// //       return;
// //     }

// //     if (!currentVariant?.productVariantId) {
// //       alert("No product variant selected");
// //       return;
// //     }

// //     const res = await fetch("http://localhost:5000/api/wishlist/add", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         userId: user.id, //  backend expects userId, but localStorage key is "id"
// //         productVariantId: currentVariant.productVariantId,
// //       }),
// //     });

// //     const data = await res.json();

// //     if (res.ok) {
// //       alert("Added to wishlist ");
// //        navigate("/wishlist");
// //     } else {
// //       alert(data.message || "Failed to add to wishlist ");
// //     }
// //   } catch (err) {
// //     console.error("Error adding to wishlist:", err);
// //     alert("Something went wrong ");
// //   }
// // };

// const handleAddToWishlist = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

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
//         userId: user.id,
//         productVariantId: currentVariant.variantId,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       if (data.message === "Product already in wishlist") {
//         alert("Product already in wishlist");
//         navigate("/wishlist"); // ✅ navigate even if already there
//       } else {
//         alert("Added to wishlist");
//         navigate("/wishlist"); // ✅ navigate on success
//       }
//     } else {
//       alert(data.message || "Failed to add to wishlist");
//     }
//   } catch (err) {
//     console.error("Error adding to wishlist:", err);
//     alert("Something went wrong");
//   }
// };


// const handleAddToCart = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     if (!user?.id) {
//       alert("Please login to add to cart");
//       return;
//     }

//     if (!currentVariant?.productVariantId) {
//       alert("No product variant selected");
//       return;
//     }

//     const res = await fetch("http://localhost:5000/api/cart/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,  // ✅ backend expects userId
//         productVariantId: currentVariant.variantId,
//         quantity: count,  // ✅ pass selected quantity
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Added to cart");
//       navigate("/cart");
//     } else {
//       alert(data.message || "Failed to add to cart");
//     }
//   } catch (err) {
//     console.error("Error adding to cart:", err);
//     alert("Something went wrong");
//   }
// };


//     const data = productList.find((item) => item.id === parseInt(id))

//     const product = products.find((item) => item.productId === parseInt(id))

//        useEffect(() => {
//            if (currentVariant?.productVariantId) {
//              fetch(`http://localhost:5000/api/product-variant-images/${currentVariant.productVariantId}`)
//                .then(res => res.json())
//                .then(data => {
//                  if (Array.isArray(data.data)) {
//                    setChildImages(data.data)
//                  }
//                })
//                .catch(err => console.error("Error fetching child images:", err))
//            }
//          }, [currentVariant])

//          useEffect(() => {
//   if (swiperRef.current) {
//     swiperRef.current.autoplay.start();
//   }
// }, [childImages]);
    

//     useEffect(() => {
//         AOS.init()
//     }, [])

   

//     return (
//         <>
//             <NavbarFour />
//             <div className="bg-[#F8F5F0] dark:bg-dark-secondary py-5 md:py-[30px] xl:pt-56">
//                 <div className="container-fluid">
//                     <ul className="flex items-center gap-[10px] text-base md:text-lg leading-none font-normal text-title dark:text-white max-w-[1720px] mx-auto flex-wrap">
//                         <li>
//                             <Link to="/">Home</Link>
//                         </li>
//                         <li>/</li>
//                         <li>
//                             <Link to="/shop-v1">Shop</Link>
//                         </li>
//                         <li>/</li>
//                         <li className="text-primary">
//                             {data?.name
//                                 ? data?.name
//                                 : 'Classic Relaxable Chair'}
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             <div className="s-py-50" data-aos="fade-up">
//                 <div className="container-fluid">
//                     <div className="max-w-[1720px] mx-auto flex justify-between gap-10 flex-col lg:flex-row">
//                         <div className="w-full lg:w-[58%]">
//                             <div className="relative product-dtls-wrapper">
//                                 <button className="absolute top-5 left-0 p-2 bg-[#E13939] text-lg leading-none text-white font-medium z-50">
//                                     -10%
//                                 </button>
//                                 {/* <div className="product-dtls-slider ">
//                                     <div
//                                         className={
//                                             activeImage === 1 ? '' : 'hidden'
//                                         }
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             className="w-full"
//                                             alt="product"
//                                         />
//                                     </div>
                                   
                                    
//                                 </div> */}

//                                 <div className="product-dtls-slider">
//                                   {childImages.length > 0 ? (
//                                     childImages.map((img, index) => (
//                                       <div key={img.childImageId} className={activeImage === index + 1 ? "" : "hidden"}>
//                                         <img
//                                           src={`http://localhost:5000/uploads/${img.childImage}`}
//                                           alt={`Variant ${currentVariant?.productId}`}
//                                           className="w-full"
//                                         />
//                                       </div>
//                                     ))
//                                   ) : (
//                                     <img src={variantImageUrl} className="w-full" alt={product?.productName || "Product"} />
//                                   )}
//                                 </div>

                               
//                                 {/* <div className="product-dtls-nav">
//                                     <div
//                                         onClick={() => setActiveImage(1)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div
//                                         onClick={() => setActiveImage(2)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div
//                                         onClick={() => setActiveImage(3)}
//                                         className="mb-2"
//                                     >
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                     <div onClick={() => setActiveImage(4)}>
//                                         <img
//                                             src={
//                                                 data?.image
//                                                     ? data?.image
//                                                     : newprod1
//                                             }
//                                             alt="product"
//                                         />
//                                     </div>
//                                 </div> */}

//                                 <div className="product-dtls-nav">
//   <Swiper
//   direction="vertical"
//   spaceBetween={10}
//   slidesPerView={4}
//   loop={true}
//   observer={true}
//   observeParents={true}
//   autoplay={{
//     delay: 2000,
//     disableOnInteraction: false,
//     pauseOnMouseEnter: false,
//   }}
//    onSwiper={(swiper) => (swiperRef.current = swiper)}
//   modules={[Navigation, Autoplay]}
//   className="h-[1100px]"
// >
//     {childImages.length > 0 ? (
//       childImages.map((img, index) => (
//         <SwiperSlide
//           key={img.childImageId}
//           onClick={() => setActiveImage(index + 1)}
//         >
//           <img
//             src={`http://localhost:5000/uploads/${img.childImage}`}
//             alt={`Variant ${currentVariant?.productVariantId} - ${index + 1}`}
//             className="cursor-pointer"
//           />
//         </SwiperSlide>
//       ))
//     ) : (
//       <SwiperSlide>
//         <img
//           src={variantImageUrl}
//           alt={product?.productName || "Product"}
//           className="cursor-pointer"
//         />
//       </SwiperSlide>
//     )}
//   </Swiper>
// </div>
//                             </div>
//                         </div>
//                         <div className="lg:max-w-[635px] w-full">
//                             <div className="pb-4 sm:pb-6 border-b border-bdr-clr dark:border-bdr-clr-drk">
//                                 <h2 className="font-semibold leading-none">
//                                     {product?.productName || "Classic Relaxable Chair"}
//                                 </h2>
//                                 <div className="flex gap-4 items-center mt-[15px]">
//                                     <span className="text-lg sm:text-xl leading-none pb-[5px] text-title line-through pl-2 inline-block dark:text-white">
//                                     <Price value={product?.productMrpPrice || 0} />
//                                     </span>
//                                     <span className="text-2xl sm:text-3xl text-primary leading-none block">
//                                     <Price value={product?.productOfferPrice || 0} />
//                                     </span>
//                                 </div>

//                                 {/* <div className="mt-5 md:mt-7 flex items-center gap-4 flex-wrap">
//                                     <h4 className="text-xl md:text-[22px] font-semibold !leading-none">
//                                         Hurry Up!
//                                     </h4>
//                                     <div className="overflow-auto">
//                                         <div className="py-2 px-3 bg-[#FAF2F2] rounded-[51px] flex items-end gap-[6px] w-[360px]">
//                                             <svg
//                                                 className="w-[15px]"
//                                                 height="20"
//                                                 viewBox="0 0 15 20"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <path
//                                                     d="M12.6923 7.59087C12.6383 7.52329 12.573 7.53657 12.5387 7.55036C12.51 7.562 12.4442 7.59919 12.4533 7.69239C12.4642 7.80431 12.4704 7.91841 12.4715 8.03157C12.4764 8.50102 12.2881 8.96094 11.9549 9.2934C11.6238 9.62371 11.1884 9.80168 10.7247 9.79652C10.0913 9.78844 9.56601 9.45809 9.20551 8.84118C8.90742 8.33106 9.03844 7.67313 9.17715 6.97654C9.25832 6.5688 9.34227 6.14716 9.34227 5.74588C9.34227 2.62132 7.24173 0.818669 5.98962 0.0222265C5.96373 0.00578123 5.93908 0 5.91724 0C5.88173 0 5.85361 0.0153124 5.83974 0.0246874C5.81287 0.0428905 5.76986 0.0843747 5.78369 0.157812C6.26228 2.69929 4.83478 4.22783 3.32346 5.84611C1.76566 7.51419 0 9.40485 0 12.8147C0 16.7767 3.22331 20 7.18532 20C10.4475 20 13.3237 17.7256 14.1796 14.4692C14.7633 12.2487 14.1517 9.42031 12.6923 7.59087ZM7.36458 18.4663C6.37247 18.5115 5.42896 18.1557 4.7083 17.4667C3.99537 16.7849 3.58647 15.8336 3.58647 14.8565C3.58647 13.0228 4.28756 11.6768 6.17326 9.88973C6.20412 9.86047 6.23572 9.85121 6.26326 9.85121C6.28822 9.85121 6.30986 9.85883 6.32474 9.86598C6.35611 9.88109 6.40767 9.91852 6.40072 9.99945C6.33329 10.784 6.33447 11.4352 6.40415 11.9351C6.58228 13.2118 7.51692 14.0697 8.73 14.0697C9.32477 14.0697 9.89129 13.8458 10.3252 13.4394C10.3756 13.3922 10.4318 13.3982 10.4534 13.4028C10.4819 13.409 10.5202 13.4265 10.5402 13.4748C10.7202 13.9092 10.8121 14.3703 10.8135 14.8453C10.8193 16.7564 9.27207 18.3808 7.36458 18.4663Z"
//                                                     fill="#E13939"
//                                                 />
//                                             </svg>
//                                             <h6 className="text-lg font-medium leading-none !text-[#E13939] whitespace-nowrap">
//                                                 Sale Ends :
//                                             </h6>
//                                             <div className="countdown-clock flex gap-[10px] items-center">
//                                                 <div className="countdown-item flex">
//                                                     <div className="ci-inner text-lg font-medium leading-none text-[#E13939]">
//                                                         <div className="clock-days ci-value"></div>
//                                                     </div>
//                                                     <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                         D
//                                                     </p>
//                                                 </div>
//                                                 <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                     :
//                                                 </p>
//                                                 <div className="countdown-item flex">
//                                                     <div className="ci-inner text-lg font-medium leading-none text-[#E13939]">
//                                                         <div className="clock-hours ci-value"></div>
//                                                     </div>
//                                                     <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                         H
//                                                     </p>
//                                                 </div>
//                                                 <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                     :
//                                                 </p>
//                                                 <div className="countdown-item flex">
//                                                     <div className="ci-inner text-lg font-medium leading-none text-[#E13939]">
//                                                         <div className="clock-minutes ci-value"></div>
//                                                     </div>
//                                                     <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                         M
//                                                     </p>
//                                                 </div>
//                                                 <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                     :
//                                                 </p>
//                                                 <div className="countdown-item flex">
//                                                     <div className="ci-inner text-lg font-medium leading-none text-[#E13939]">
//                                                         <div className="clock-seconds ci-value"></div>
//                                                     </div>
//                                                     <p className="text-lg font-medium leading-none text-[#E13939]">
//                                                         S
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div> */}

//                                 <p className="sm:text-lg mt-5 md:mt-7">
//                                     {/* Experience the epitome of grace with our
//                                     Classic Handwoven Saree. Crafted from
//                                     premium fabric and adorned with intricate
//                                     detailing, it offers unmatched elegance for
//                                     any occasion — be it a festive celebration
//                                     or an intimate gathering. Its timeless
//                                     design blends tradition with modern
//                                     sophistication, while the rich craftsmanship
//                                     ensures it remains a cherished piece in your
//                                     wardrobe for years to come. */}

//                                     {product?.productDescription || "No description available."}
//                                 </p>
//                             </div>
//                             <div
//                                 className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
//                                 data-aos="fade-up"
//                                 data-aos-delay="200"
//                             >
//                                 {/* <IncreDre /> */}
//                                 <div className="inc-dec flex items-center gap-2">
//                                   {/* Decrement */}
//                                   <div
//                                     className="dec w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center cursor-pointer"
//                                     onClick={() => setCount(count > 1 ? count - 1 : 1)}
//                                   >
//                                     <LuMinus className="text-title dark:text-white" />
//                                   </div>
                                
//                                   {/* Count Input */}
//                                   <input
//                                     className="w-10 h-auto outline-none bg-transparent text-base md:text-lg leading-none text-title dark:text-white text-center"
//                                     type="text"
//                                     value={count}
//                                     readOnly
//                                   />
                                
//                                   {/* Increment */}
//                                   <div
//                                     className={`inc w-6 h-6 flex items-center justify-center cursor-pointer ${
//                                       count >= stock ? "opacity-50 cursor-not-allowed" : "bg-[#E8E9EA] dark:bg-dark-secondary"
//                                     }`}
//                                     onClick={() => {
//                                       if (count < stock) {
//                                         setCount(count + 1)
//                                       }
//                                     }}
//                                   >
//                                     <LuPlus className="text-title dark:text-white" />
//                                   </div>
//                                 </div>

//                                 <div className="flex gap-4 mt-4 sm:mt-6">
//                                     <button
//                                       onClick={handleAddToCart}
//                                       className="btn btn-solid"
//                                     >
//                                       <span>Add to Cart</span>
//                                     </button>
//                                     {/* <Link
//                                         to="/cart"
//                                         className="btn btn-solid"
//                                         data-text="Add to Cart"
//                                     >
//                                         <span>Add to Cart</span>
//                                     </Link> */}
//                                     {/* <Link
//                                         to="/wishlist"
//                                         className="btn btn-outline"
//                                         data-text="Add to Wishlist"
//                                     >
//                                         <span>Add to Wishlist</span>
//                                     </Link> */}
//                                     <button
//                                       onClick={handleAddToWishlist}
//                                       className="btn btn-outline"
//                                     >
//                                       <span>Add to Wishlist</span>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div
//                                 className="py-4 sm:py-6 border-b border-bdr-clr dark:border-bdr-clr-drk"
//                                 data-aos="fade-up"
//                                 data-aos-delay="300"
//                             >
//                                 <div className="flex gap-x-12 gap-y-3 flex-wrap">
//                                     <h6 className="leading-none font-medium">
//                                         SKU : CH_0015
//                                     </h6>
//                                     <h6 className="leading-none font-medium">
//                                         Category : Saree
//                                     </h6>
//                                 </div>
//                                 <div className="flex gap-x-12 lg:gap-x-24 gap-y-3 flex-wrap mt-5 sm:mt-10">
//                                     <div className="flex gap-[10px] items-center">
//                                         <h6 className="leading-none font-medium">
//                                             Size :
//                                         </h6>
//                                         <div className="flex gap-[10px]">
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                     checked
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     S
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     M
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     L
//                                                 </span>
//                                             </label>
//                                             <label className="product-size">
//                                                 <input
//                                                     className="appearance-none hidden"
//                                                     type="radio"
//                                                     name="size"
//                                                 />
//                                                 <span className="w-6 h-6 flex items-center justify-center pt-[2px] text-sm leading-none bg-[#E8E9EA] dark:bg-dark-secondary text-title dark:text-white duration-300">
//                                                     XL
//                                                 </span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-[10px] items-center">
//   <h6 className="leading-none font-medium">Color :</h6>
//   <div className="flex gap-[10px] items-center">
//     {variants
//       .filter((variant) => variant.productId === productId) // only show colors for this product
//       .map((variant) => (
//         <label key={variant.variantId} className="product-color cursor-pointer">
//           <input
//             className="appearance-none hidden"
//             type="radio"
//             name="color"
//             checked={selectedVariantId === variant.variantId}
//             onChange={() => setSelectedVariantId(variant.variantId)}
//           />
//           <span
//             className={`border flex rounded-full duration-300 p-1 ${
//               selectedVariantId === variant.variantId
//                 ? "border-[#000]"
//                 : "border-transparent"
//             }`}
//           >
//             <span
//               className="w-4 h-4 rounded-full flex"
//               style={{ backgroundColor: variant.productColor }}
//             ></span>
//           </span>
//         </label>
//       ))}
//   </div>
// </div>
//                                 </div>
//                             </div>
//                             <div
//                                 className="pt-4 sm:pt-6"
//                                 data-aos="fade-up"
//                                 data-aos-delay="200"
//                             >
//                                 <div className="flex items-center gap-6">
//                                     <h6 className="font-normal">Share : </h6>
//                                     <div className="flex gap-6">
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaFacebookF className="size-5" />
//                                         </Link>
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaTwitter className="size-5" />
//                                         </Link>
//                                         <Link
//                                             to="#"
//                                             className="text-paragraph duration-300 dark:text-white hover:text-primary dark:hover:text-primary"
//                                         >
//                                             <FaInstagram className="size-5" />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="s-py-50">
//                 <div className="container-fluid">
//                     <DetailTab />
//                 </div>
//             </div>

//             <div
//                 className="s-py-50-100"
//                 data-aos="fade-up"
//                 data-aos-delay="200"
//             >
//                 <div className="container-fluid">
//                     <div className="max-w-[547px] mx-auto text-center">
//                         <h6 className="text-2xl sm:text-3xl md:text-4xl leading-none">
//                             Related Products
//                         </h6>
//                         <p className="mt-3">
//                             Explore complementary options that enhance your
//                             experience. Discover related products curated just
//                             for you.{' '}
//                         </p>
//                     </div>
//                     <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8 pt-8 md:pt-[50px]">
//                         {/* {productList.slice(0, 4).map((item, index) => {
//                             return <LayoutOne item={item} key={index} />
//                         })} */}
                        

//                         {products.map((item, index) => (
//                          <div className="group" key={index}>
//                            <div className="relative overflow-hidden">
//                              <Link to={`/product-details/${item.productId}`}>
//                                <img
//                                  src={`http://localhost:5000/uploads/${item.productImage}`}
//                                  alt={item.productName}
//                                  className="w-full transform group-hover:scale-110 duration-300"
//                                />
//                              </Link>
//                            </div>
                           
//                            <h3 className="text-lg font-semibold mt-4">₹{item.productOfferPrice}</h3>
//                            <h3 className="text-lg font-semibold">{item.productName}</h3>
//                          </div>
//                        ))}

//                     </div>
//                 </div>
//             </div>

//             <FooterOne />

//             <ScrollToTop />
//         </>
//     )
// }

