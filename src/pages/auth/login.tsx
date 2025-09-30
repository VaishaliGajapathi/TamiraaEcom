import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import bg from "../../assets/img/bg/register.jpg";
import NavbarFour from "../../components/navbar/navbar-four";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import contactImg from "../../assets/img/new_prods/prod_5.jpg";
import authImg from "../../assets/img/new_prods/authimage.jpg";
import { API_BASE_URL } from "../../utils/api";
import Aos from "aos";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email,
      password,
    });

    // Save token in localStorage
    localStorage.setItem("token", res.data.token);

    // (optional) save user info if backend returns it
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    
    login();
    // Redirect user to dashboard/home
    navigate("/");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Something went wrong");
    } else {
      setError("An unexpected error occurred");
    }
  }
};

  return (
    <>
      <NavbarFour />

      <div className="flex ">
       <div className="w-1/2 hidden md:block lg:flex-1">
          <img className="h-full object-cover" src={authImg} alt="register" />
        </div>
        <div
          className="
           bg-[#f1ecec]
            w-full 
            md:w-1/2 
            lg:max-w-lg 
            xl:max-w-3xl 
            lg:w-full 
            
            py-28 sm:py-12 md:py-40 lg:py-28 xl:py-24 
            px-4 sm:px-8 md:px-12 lg:p-16 xl:p-24  
            lg:pt-48 xl:pt-60    
            
            relative z-10 flex items-center overflow-hidden
          "
        >
          <div className="mx-auto max-w-md w-full ">
            <h2 className="leading-none" data-aos="fade-up">
              Welcome back !
            </h2>
            <p className="text-lg mt-[15px]" data-aos="fade-up" data-aos-delay="200">
              Elevating your style with timeless and elegant sarees at Tamiraa Sarees.
            </p>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-3">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="mt-7">
                <label className="text-base sm:text-lg font-medium mb-2.5 block">
                  Email
                </label>
                <input
                  className="w-full h-12 md:h-14 border p-4"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* <div className="mt-5">
                <label className="text-base sm:text-lg font-medium mb-2.5 block">
                  Password
                </label>
                <input
                  className="w-full h-12 md:h-14 border p-4"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div> */}
              <div className="mt-5 relative">
                <label className="text-base sm:text-lg font-medium mb-2.5 block">
                  Password
                </label>
                <input
                  className="w-full h-12 md:h-14 border p-4 pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {/* Eye icon */}
                <span
                  className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                </span>
              </div>
              
              <div className="mt-2 text-right">
                <Link 
                  to="/forger-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="btn btn-theme-solid w-full"
                  data-text="Login"
                >
                  <span>Login</span>
                </button>
              </div>
            </form>

            <p className="text-lg mt-[15px]">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-primary font-medium ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />
    </>
  );
}
