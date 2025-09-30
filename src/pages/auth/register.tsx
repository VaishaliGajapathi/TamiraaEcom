import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import bg from "../../assets/img/bg/register.jpg";
import NavbarFour from "../../components/navbar/navbar-four";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import authImg from "../../assets/img/new_prods/authimage.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Aos from "aos";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Aos.init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      setSuccess(res.data.message || "Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // redirect after 1.5 sec
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Something went wrong");
  } else {
    setError("An unexpected error occurred");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarFour />

      <div className="flex">
        {/* Left Image */}
        <div className="w-1/2 hidden md:block lg:flex-1">
          <img className="h-full object-cover" src={authImg} alt="register" />
        </div>

        {/* Form Section */}
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
          <div className="mx-auto max-w-md w-full">
            <h2>Create New Account</h2>
            <p className="text-lg mt-[15px]">Elevating your style with timeless and elegant sarees at Tamiraa Sarees.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-12 border p-4"
                  required
                />
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full h-12 border p-4"
                  required
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-12 border p-4"
                  required
                />
              </div>

              <div className="relative">
                <label className="text-base sm:text-lg font-medium mb-2.5 block">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full h-12 md:h-14 border p-4 pr-12"
                  required
                />

                <span
                  className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                </span>
              </div>


               {/* <div className="mt-5 relative">
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
                
                <span
                  className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                </span>
              </div> */}

              {/* Error / Success */}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-theme-solid w-full mt-4"
                data-text="Register"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-lg mt-[15px]">
              Already have an account?
              <Link to="/login" className="text-primary font-medium ml-1">
                Login
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
