import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import LayoutOne from '../../components/product/layout-one'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'
import SelectOne from '../../components/product/select-one'
import bg from '../../assets/img/shortcode/breadcumb.jpg'
import { useProducts } from '../../hooks/useProducts'
import Aos from 'aos'
import NavbarFour from '../../components/navbar/navbar-four'

export default function ShopV1() {
  const [category, setCategory] = useState<"sarees" | "kurtis" | "all">("all");
  const { products, loading, error } = useProducts();

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category.toLowerCase().includes(category));

  useEffect(() => {
    Aos.init();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <>
        <NavbarFour />
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
        <NavbarFour />
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
      <NavbarFour />

      {/* Breadcrumb */}
      <div
        className="s-py-100-50 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container-fluid relative z-10">
          <div className="max-w-xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
            <nav className="text-sm">
              <Link to="/" className="hover:text-blue-300">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>Shop</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="s-py-100-50">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-1/4">
                <SelectOne
                  category={category}
                  setCategory={setCategory}
                />
              </div>

              {/* Products Grid */}
              <div className="lg:w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((item, index) => (
                    <LayoutOne item={item} key={index} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No products found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
}
