import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import bg from "../../assets/img/shortcode/breadcumb.jpg";

import AccountTab from "../../components/account/account-tab";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import NavbarFour from "../../components/navbar/navbar-four";

import Aos from "aos";

// interface for user
interface User {
  userId: number;
  username: string;
  phonenumber: string;
  email: string;
}

export default function EditAccount() {
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    Aos.init();


    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // get userId from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id || storedUser?.userId;

    if (!userId) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    // fetch current user details
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle save
  const handleSave = async () => {
  if (!formData) return;
  try {
    // Send update request
    await axios.put(`http://localhost:5000/api/users/${formData.userId}`, {
      username: formData.username,
      phonenumber: formData.phonenumber,
      email: formData.email,
    });

    // Fetch fresh user data from API
    const res = await axios.get(`http://localhost:5000/api/users/${formData.userId}`);
    const updatedUser = res.data;

    // Update form and localStorage with fresh data
    setFormData(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("✅ Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("❌ Failed to update profile.");
  }
};

  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <>
      <NavbarFour />

      {/* breadcrumb */}
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
            Edit Account
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li className="text-primary">Edit Account</li>
          </ul>
        </div>
      </div>

      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            {/* Sidebar */}
            <div
              className="w-full md:w-[200px] lg:w-[300px] flex-none"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <AccountTab />
            </div>

            {/* Edit form */}
            <div className="w-full md:w-auto md:flex-1 overflow-auto">
              <div className="w-full max-w-[951px] bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                {formData ? (
                  <div className="grid gap-5 sm:gap-6" data-aos="fade-up" data-aos-delay="200">
                    <div>
                      <label className="block mb-2">Full Name</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full h-12 border p-4"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Phone No.</label>
                      <input
                        type="text"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        className="w-full h-12 border p-4"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 border p-4"
                      />
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={handleSave}
                        className="btn btn-solid"
                        data-text="Save Change"
                      >
                        <span>Save Change</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Profile not found.</p>
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
