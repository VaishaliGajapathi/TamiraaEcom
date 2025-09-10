import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NavbarFour from "../../components/navbar/navbar-four";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";


import bg from "../../assets/img/shortcode/breadcumb.jpg";
import { RiShoppingBag2Line } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { getStoredUser } from '../../utils/user';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user = getStoredUser();

  // ✅ Fetch wishlist
  // const fetchWishlist = async () => {
  //   if (!user?.id) {
  //     setWishlist([]);
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
  //     const data = await res.json();
  //     if (Array.isArray(data)) {
  //       setWishlist(data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching wishlist:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchWishlist = async () => {
  if (!user?.id) {
    setWishlist([]);
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setWishlist(data);
    }
  } catch (err) {
    console.error("Error fetching wishlist:", err);
  } finally {
    setLoading(false);
  }
};

  // ✅ Remove from wishlist
  const handleRemove = async (wishlistId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/${wishlistId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setWishlist((prev) =>
          prev.filter((item) => item.wishlistId !== wishlistId)
        );
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ✅ Move to cart
//   const handleMoveToCart = async (variantId: number, wishlistId: number) => {
//   if (!user?.id) {
//     alert("Please login to add to cart");
//     navigate("/login");
//     return;
//   }

//   try {
//     // 1️⃣ Add to Cart
//     const res = await fetch("http://localhost:5000/api/cart/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,
//         productVariantId: variantId,
//         quantity: 1,
//       }),
//     });
//     const data = await res.json();

//     if (res.ok) {
//       alert("Moved to cart!");

//       // 2️⃣ Remove from Wishlist immediately
//       await fetch(`http://localhost:5000/api/wishlist/${wishlistId}`, {
//         method: "DELETE",
//       });

//       // 3️⃣ Update UI by removing the item locally
//       setWishlist((prev) =>
//         prev.filter((item) => item.wishlistId !== wishlistId)
//       );
//     } else {
//       alert(data.message || "Failed to move to cart");
//     }
//   } catch (err) {
//     console.error("Error moving to cart:", err);
//   }
// };


const handleMoveToCart = async (variantId: number, wishlistId: number) => {
  const user = getStoredUser();
  if (!user?.id) {
    alert("Please login to add to cart");
    navigate("/login");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productVariantId: variantId,
        quantity: 1,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Moved to cart!");

      await fetch(`http://localhost:5000/api/wishlist/${wishlistId}`, {
        method: "DELETE",
      });

      setWishlist((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId)
      );
    } else {
      alert(data.message || "Failed to move to cart");
    }
  } catch (err) {
    console.error("Error moving to cart:", err);
  }
};

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      <NavbarFour />

      {/* Header Section */}
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
            Wishlist
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li className="text-primary">wishlist</li>
          </ul>
        </div>
      </div>

      {/* Wishlist Products */}
      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            <div
              className="w-full md:w-auto md:flex-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {loading ? (
                <p className="text-center">Loading wishlist...</p>
              ) : wishlist.length === 0 ? (
                <p className="text-center">No items in wishlist</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg::gap-8">
                  {wishlist.map((item) => {
                    const variant = item.ProductVariant;
                    return (
                      <div className="group" key={item.wishlistId}>
                        {/* Product Image */}
                        <div className="relative overflow-hidden group z-[5] before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-title before:opacity-0 before:duration-300 before:z-[5] hover:before:opacity-80">
                          <img
                            className="w-full transform duration-300 group-hover:scale-110"
                            src={`http://localhost:5000/uploads/${variant.productVariantImage}`}
                            alt="product-card"
                          />

                          {/* Hover Buttons */}
                          <div className="absolute z-10 top-1/2 left-1/2 transform -translate-y-2/4 -translate-x-2/4 flex gap-2">
                            <button
                              onClick={() =>
                                handleMoveToCart(
                                  item.ProductVariant.productVariantId,
                                  item.wishlistId
                                )
                              }
                              className="w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-10 flex items-center justify-center transform translate-y-8 opacity-0 transition-all group-hover:duration-500 group-hover:opacity-100 group-hover:translate-y-0 relative tooltip-icon"
                            >
                              <RiShoppingBag2Line className="text-white size-6" />
                              <span className="p-2 bg-white dark:bg-title text-xs text-title dark:text-white absolute -top-[60px] left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-[4px] opacity-0 invisible duration-300">
                                Add to Cart
                                <span className="w-3 h-3 bg-white dark:bg-title absolute -bottom-[6px] left-1/2 transform -translate-x-1/2 rotate-45"></span>
                              </span>
                            </button>
                            <button
                           onClick={() => handleRemove(item.wishlistId)}
                            className="w-9 lg:w-12 h-9 p-2 lg:h-12 bg-white dark:bg-title bg-opacity-10 flex items-center justify-center translate-y-8 opacity-0 transition-all group-hover:duration-300 group-hover:opacity-100 group-hover:translate-y-0 relative tooltip-icon"
                          >
                            <FaHeart className="dark:text-white text-[#F0264A] size-6" />
                          </button>
                          </div>
                        </div>

                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
       
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
}
