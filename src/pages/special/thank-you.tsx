import { Link } from "react-router-dom";

import bg from '../../assets/img/thank-you.png'
import gpay from '../../assets/img/gpay.webp'


// import NavbarOne from "../../components/navbar/navbar-one";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import NavbarFour from "../../components/navbar/navbar-four";

export default function ThankYou() {
  return (
    <>
        <NavbarFour/>

        <div className="py-20 sm:py-28">   {/* 🔥 increased padding top-bottom */}
  <div className="container">
    <div className="max-w-[710px] mx-auto text-center p-7 sm:p-10 lg:p-12">
      
      {/* GPay Image (bigger + centered + top margin) */}
      <div className="flex justify-center mt-8">
        <img src={gpay} alt="gpay" className="w-[280px] sm:w-[320px] md:w-[360px]" />
      </div>

      {/* Thank You Image (smaller + centered + gap below gpay) */}
      <div className="flex justify-center mt-10">
        <img src={bg} alt="thank-you" className="w-[140px] sm:w-[160px] md:w-[180px]" />
      </div>

      <h3 className="leading-[1.2] mt-6 md:mt-8 text-2xl md:text-[32px] font-bold text-title dark:text-white">
        For Shopping with Us!
      </h3>

      <p className="mt-3 text-base sm:text-lg text-paragraph dark:text-white">
        Please Check your email for Download Invoice . Or{" "}
        <Link to="/" className="text-primary underline">Click here</Link>
      </p>

      <Link to="/" className="btn btn-solid mt-6 md:mt-8" data-text="Back to home">
        <span>Back to home</span>
      </Link>
    </div>
  </div>
</div>
        
        <FooterOne/>

        <ScrollToTop/>
    </>
  )
}
