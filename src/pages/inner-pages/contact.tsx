import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

import NavbarFour from "../../components/navbar/navbar-four"
import FooterOne from "../../components/footer/footer-one"
import ScrollToTop from "../../components/scroll-to-top"
import newProd1 from '../../assets/img/new_prods/prod_1.jpg'
import bg from "../../assets/img/shortcode/breadcumb.jpg"
// import contactImg from "../../assets/img/new_prods/prod_5.jpg"
import about from "../../assets/img/svg/about.svg"
import { API_BASE_URL } from "../../utils/api";
import Aos from "aos"

// ---- Types ----
type FormData = {
  name: string
  email: string
  phoneNumber: string
  subject: string
  comments: string
}

type Errors = Partial<Record<keyof FormData, string>>

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    comments: "",
  })

  const [errors, setErrors] = useState<Errors>({})
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    Aos.init()
  }, [])

  // validation function (submit safety)
  const validate = () => {
    const newErrors: Errors = {}

    // name: only letters & spaces
    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters"
    }

    // email validation
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email address"
    }

    // phone number: 10–15 digits
    if (!/^\d{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be 10–15 digits"
    }

    // subject required
    if (!formData.subject) {
      newErrors.subject = "Please select a subject"
    }

    // comments: max 400 chars
    if (formData.comments.trim().length === 0) {
      newErrors.comments = "Message cannot be empty"
    } else if (formData.comments.length > 400) {
      newErrors.comments = "Message must not exceed 400 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // handle input change with live validation
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    let newValue = value

    if (name === "name") {
      // allow only letters & spaces
      newValue = value.replace(/[^A-Za-z\s]/g, "")
    }

    if (name === "email") {
      // allow only valid email chars
      newValue = value.replace(/[^A-Za-z0-9@._-]/g, "")
    }

    if (name === "phoneNumber") {
      // only digits, max 15
      newValue = value.replace(/[^0-9]/g, "").slice(0, 15)
    }

    if (name === "comments") {
      // max 400 characters
      newValue = value.slice(0, 400)
    }

    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contacts`, formData)
      console.log(res.data)

      // show modal instead of alert
      setShowModal(true)
      setTimeout(() => setShowModal(false), 5000)

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        subject: "",
        comments: "",
      })
      setErrors({})
    } catch (err) {
      console.error("❌ Error submitting contact:", err)
    }
  }

  return (
    <>
      <NavbarFour />

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
            Contact Us
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li className="text-primary">Contact</li>
          </ul>
        </div>
      </div>

      <div className="s-pb-100 s-pt-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
            <div
              className="max-w-[600px] w-full hidden lg:flex justify-center"
              data-aos="zoom-in"
            >
              <img className="w-full max-w-[500px]" src={newProd1} alt="contct" />
            </div>
            <div className="max-w-[725px] w-full mx-auto lg:mx-0">
              <div data-aos="fade-up">
                <img src={about} className="size-16" alt="" />
                <h3 className="leading-none font-medium mt-3 md:mt-6 text-2xl">
                  Get in Touch
                </h3>
                <p className="max-w-[474px] mt-3 md:mt-4 font-medium">
                  We're here to address your inquiries, feedback, and
                  partnership opportunities promptly and effectively.
                </p>
              </div>

              {/* FORM START */}
              <form
                className="mt-8"
                data-aos="fade-up"
                data-aos-delay="100"
                onSubmit={handleSubmit}
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={50} 
                      placeholder="Enter your full name"
                      className="w-full h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                    />
                    {errors.name && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                    />
                    {errors.email && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2.5 block">
                      Phone No.
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Type your phone number"
                      className="w-full h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                    />
                    {errors.phoneNumber && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2.5 block">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-slate-400 focus:border-primary p-4 outline-none duration-300"
                    >
                      <option value="">-- Select Subject --</option>
                      <option value="Payment Problem">Payment Problem</option>
                      <option value="Damaged Product">Damaged Product</option>
                      <option value="Shipping Problem">Shipping Problem</option>
                    </select>
                    {errors.subject && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 sm:gap-6">
                  <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2.5 block">
                    Your Message
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Type your message"
                    className="w-full h-28 md:h-[170px] bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                  ></textarea>
                  {errors.comments && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                      {errors.comments}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="btn btn-solid"
                    data-text="Submit"
                  >
                    <span>Submit</span>
                  </button>
                </div>
              </form>
              {/* FORM END */}
            </div>
          </div>
        </div>
      </div>

      <div className="s-pb-100" data-aos="fade-up">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto">
            <iframe
              className="w-full h-[400px] md:h-[600px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28951.79709608298!2d91.85394430000001!3d24.898846749999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m3!3e6!4m0!4m0!5e0!3m2!1sen!2sbd!4v1668006237424!5m2!1sen!2sbd"
              style={{ border: "0" }}
            ></iframe>
          </div>
        </div>
      </div>

      <FooterOne />
      <ScrollToTop />

      {/* SUCCESS MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "40px 60px",
              borderRadius: "12px",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "500",
              maxWidth: "550px",
            }}
          >
            <h2 style={{ marginBottom: "10px", color: "#b91c1c" }}>
              Thank You! 💖
            </h2>
            <p style={{ marginBottom: "8px" }}>
              Your message has been successfully sent to{" "}
              <strong>Tamiraa Sarees</strong>.
            </p>
            <p style={{ marginBottom: "8px" }}>
              Our team will get back to you shortly with the details.
            </p>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Meanwhile, explore our latest saree collections and festive
              offers!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
