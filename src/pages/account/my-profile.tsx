import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import bg from '../../assets/img/shortcode/breadcumb.jpg';
import AccountTab from "../../components/account/account-tab";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";

import { LuMail, LuMapPin, LuPhoneCall } from "react-icons/lu";
import Aos from "aos";
import NavbarFour from "../../components/navbar/navbar-four";

// interface for user
interface User {
  userId: number;
  username: string;
  phonenumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  Aos.init();

  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const userId = storedUser?.id || storedUser?.userId;
  const token = localStorage.getItem('token');

  if (!userId || !token) {
    console.error("User not logged in");
    return;
  }

  // Set localStorage user as initial state to avoid loading spinner
  setUser(storedUser);

  // Then re-fetch fresh user data from API
  axios.get(`http://localhost:5000/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      setUser(res.data);  // Update with fresh data
      localStorage.setItem('user', JSON.stringify(res.data));  // Keep in sync
    })
    .catch(err => {
      console.error("Error fetching user profile:", err);
    });
}, []);

  return (
    <>
      <NavbarFour/>

      {/* breadcrumb */}
      <div 
        className="relative flex items-center justify-center gap-4 flex-wrap 
                           w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] 
                           bg-cover bg-center bg-no-repeat 
                           pt-16 sm:pt-20 md:pt-24 lg:pt-32 
                           before:absolute before:inset-0 before:bg-title before:bg-opacity-70" 
        style={{backgroundImage:`url(${bg})`}}
      >
        <div className="relative text-center w-full z-10">
          <h2 className="text-white text-3xl sm:text-4xl md:text-[40px] font-normal leading-none">My Profile</h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li><Link to="/">Home</Link></li>
            <li>/</li>
            <li className="text-primary">Profile</li>
          </ul>
        </div>
      </div>

      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            
            {/* Sidebar */}
            <div className="w-full md:w-[200px] lg:w-[300px] flex-none" data-aos="fade-up" data-aos-delay="100">
              <AccountTab/>
            </div>

            {/* Profile Content */}
            <div className="w-full md:w-auto md:flex-1 overflow-auto">
              <div className="w-full max-w-[951px] bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                {user ? (
                  <>
                    <div data-aos="fade-up" data-aos-delay="200">
                      <h3 className="font-semibold leading-none">{user.username}</h3>
                      <span className="leading-none mt-3">User ID: {user.userId}</span>
                    </div>

                    <div 
                      className="mt-5 sm:mt-8 md:mt-10 grid gap-4 sm:gap-6" 
                      data-aos="fade-up" 
                      data-aos-delay="400"
                    >
                      <Link to="#" className="flex items-center gap-2">
                        <LuPhoneCall className="text-primary size-5"/>
                        <span className="leading-none font-medium text-base sm:text-lg">
                          {user.phonenumber}
                        </span>
                      </Link>
                      <Link to="#" className="flex items-center gap-2">
                        <LuMail className="text-primary size-5"/>
                        <span className="leading-none font-medium text-base sm:text-lg">
                          {user.email}
                        </span>
                      </Link>
                      <Link to="#" className="flex items-center gap-2">
                        <LuMapPin className="text-primary size-5"/>
                        <span className="leading-none font-medium text-base sm:text-lg">
                          Registered on: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <p>Loading profile...</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <FooterOne/>
      <ScrollToTop/>
    </>
  );
}
