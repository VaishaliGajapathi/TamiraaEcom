import { LuEye, LuHeart } from 'react-icons/lu';
import { RiShoppingBag2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Price } from '../../context/CurrencyContext';
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

interface Item {
    id: number;
    image: string;
    tag: string;
    price: string;
    name: string;
}

interface CartItem {
  productVariantId: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function LayoutOne({ item }: { item: Item }) {
    const { addToWishlist, wishlist } = useWishlist();
    const { addToCart, cart } = useCart();

    const handleAddToWishlist = (product: Item) => {
        if (!wishlist.some((w: Item) => w.id === product.id)) {
            addToWishlist(product);
            toast.success(`${product.name} added to wishlist!`);
        } else {
            toast.error(`${product.name} is already in wishlist!`);
        }
    };

    const handleAddToCart = (product: Item) => {
        if (!cart.some(c => c.id === product.id)) {
            addToCart(product);
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error(`${product.name} is already in cart!`);
        }
    };

    return (
        <div className="group">
            <div className="relative overflow-hidden">
                <Link to={`/product-details/${item.id}`}>
                    <img
                        className="w-full transform group-hover:scale-110 duration-300"
                        src={item.image}
                        alt={item.name}
                    />
                </Link>

                {/* Tag Badge */}
                {item.tag && (
                    <div
                        className={`absolute z-10 top-7 left-7 pt-[10px] pb-2 px-3 rounded-[30px] font-primary text-[14px] text-white font-semibold leading-none ${
                            item.tag === 'Hot Sale'
                                ? 'bg-[#1CB28E]'
                                : item.tag === 'NEW'
                                ? 'bg-[#9739E1]'
                                : item.tag === '10% OFF'
                                ? 'bg-[#E13939]'
                                : ''
                        }`}
                    >
                        {item.tag}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="absolute z-10 top-[50%] right-3 transform -translate-y-[40%] opacity-0 duration-300 transition-all group-hover:-translate-y-1/2 group-hover:opacity-100 flex flex-col items-end gap-3">
                    
                    {/* Add to Wishlist */}
                    <button
                        onClick={() => handleAddToWishlist(item)}
                        className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                    >
                        <LuHeart className="dark:text-white h-[22px] w-[20px]" />
                        <span className="mt-1">Add to wishlist</span>
                    </button>

                    {/* Add to Cart */}
                    <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon"
                    >
                        <RiShoppingBag2Line className="dark:text-white h-[22px] w-[20px]" />
                        <span className="mt-1">Add to Cart</span>
                    </button>

                    {/* Quick View */}
                    <button className="bg-white dark:bg-title dark:text-white bg-opacity-80 flex items-center justify-center gap-2 px-4 py-[10px] text-base leading-none text-title rounded-[40px] h-14 overflow-hidden new-product-icon quick-view">
                        <LuEye className="dark:text-white h-[22px] w-[20px]" />
                        <span className="mt-1">Quick View</span>
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="md:px-2 lg:px-4 xl:px-6 lg:pt-6 pt-5 flex gap-4 md:gap-5 flex-col">
                <h4 className="font-medium leading-none dark:text-white text-lg">
                    <Price value={item.price} />
                </h4>
                <div>
                    <h5 className="font-normal dark:text-white text-xl leading-[1.5]">
                        <Link to={`/product-details/${item.id}`} className="text-underline">
                            {item.name}
                        </Link>
                    </h5>
                </div>
            </div>
        </div>
    );
}
