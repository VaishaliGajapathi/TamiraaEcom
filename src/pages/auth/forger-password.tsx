import { useEffect, useState } from "react";
import axios from "axios";

import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import bg from "../../assets/img/bg/register.jpg";
import Aos from "aos";
import NavbarFour from "../../components/navbar/navbar-four";
import authImg from "../../assets/img/new_prods/authimage.jpg";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Aos.init();
  }, []);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
      );
      setSuccess(res.data.message || "OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/verify-otp",
        { email, otp }
      );
      setSuccess(res.data.message || "OTP verified");
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { email, newPassword: password }
      );
      setSuccess(res.data.message || "Password reset successfully");
      setStep("email");
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");

      // Show the success modal
      setShowSuccessModal(true);

      // Redirect to login page after showing success message
    setTimeout(() => {
    setShowSuccessModal(false);
    navigate("/login");
  }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
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
          <img className="h-full object-cover" src={authImg} alt="forget password" />
        </div>

        {/* Form */}
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
            
            relative z-10 flex items-center overflow-hidden
          "
        >
          <div className="mx-auto max-w-md w-full">
            <h2
              className="leading-none"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Forget Password
            </h2>
            <p
              className="text-lg mt-[15px]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Elevating your style with timeless and elegant sarees at Nyra Sarees.
            </p>

            <form
              onSubmit={
                step === "email"
                  ? handleSendOtp
                  : step === "otp"
                  ? handleVerifyOtp
                  : handleResetPassword
              }
            >
              {/* Email Step */}
              {step === "email" && (
                <div className="mt-7" data-aos="fade-up" data-aos-delay="300">
                  <label className="text-base sm:text-lg font-medium leading-none mb-2.5 block dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-12 md:h-14 bg-white dark:bg-transparent border border-bdr-clr focus:border-primary p-4 outline-none duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* OTP Step */}
              {step === "otp" && (
                <div className="mt-7" data-aos="fade-up" data-aos-delay="300">
                  <label className="text-base sm:text-lg font-medium leading-none mb-2.5 block dark:text-white">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the OTP"
                    className="w-full h-12 md:h-14 bg-white dark:bg-transparent border border-bdr-clr focus:border-primary p-4 outline-none duration-300"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Reset Password Step */}
              {step === "reset" && (
                <>
                  <div className="mt-7" data-aos="fade-up" data-aos-delay="300">
                    <label className="text-base sm:text-lg font-medium leading-none mb-2.5 block dark:text-white">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full h-12 md:h-14 bg-white dark:bg-transparent border border-bdr-clr focus:border-primary p-4 outline-none duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-7" data-aos="fade-up" data-aos-delay="350">
                    <label className="text-base sm:text-lg font-medium leading-none mb-2.5 block dark:text-white">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full h-12 md:h-14 bg-white dark:bg-transparent border border-bdr-clr focus:border-primary p-4 outline-none duration-300"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Error / Success */}
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}

              <div data-aos="fade-up" data-aos-delay="400">
                <button
                  type="submit"
                  className="btn btn-theme-solid mt-[15px] w-full"
                  disabled={loading}
                  data-text={
                    loading
                      ? "Processing..."
                      : step === "email"
                      ? "Send OTP"
                      : step === "otp"
                      ? "Verify OTP"
                      : "Reset Password"
                  }
                >
                  {loading
                    ? "Processing..."
                    : step === "email"
                    ? "Send OTP"
                    : step === "otp"
                    ? "Verify OTP"
                    : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
       <div className="bg-white p-6 rounded shadow-md text-center">
         <h3 className="text-lg font-semibold text-green-600">
           {success || "Password has been reset successfully!"}
         </h3>
       </div>
    </div>
)}

      <FooterOne />
      <ScrollToTop />
    </>
  );
}
