import { Link } from 'react-router-dom'

import bg from '../../assets/img/bg/footer.jpg'

import logoNew from '../../assets/img/new_logo/1234.png'

import { footerLink1, footerLink4 } from '../../data/nav-data'
import {
    FaFacebookF,
    FaHeart,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
} from 'react-icons/fa'

export default function FooterOne() {
    return (
        <div
            className="relative bg-overlay before:bg-title before:bg-opacity-95"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="s-pt-100">
                <div className="container-fluid">
                    <div className="max-w-[1722px] mx-auto flex items-center justify-between gap-10 s-pb-100 flex-wrap lg:flex-nowrap footer-wrapper">
                        <div className="lg:max-w-[366px] sm:w-[45%] lg:w-full flex items-center justify-around gap-10 footer-inner-wrapper">
                            <div>
                                <h4 className="text-white leading-none mb-5 md:mb-6 text-xl md:text-2xl">
                                    Quick links
                                </h4>
                                <ul className="text-white leading-none flex flex-col gap-4">
                                    {footerLink1.map((item, index) => {
                                        return (
                                            <li
                                                className="duration-100 hover:text-primary inline-block group"
                                                key={index}
                                            >
                                                <Link
                                                    className="text-underline-primary"
                                                    to={item.link}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="lg:max-w-[522px] w-full sm:text-center -order-1 lg:order-none">
                            <img
                                className="sm:mx-auto w-[201px] "
                                src={logoNew}
                                alt="logo"
                            />
                            <p className="mt-4 text-white-light max-w-[522px] sm:mx-auto">
                                At Nyra Sarees, our story is woven with
                                tradition, elegance, and a passion for timeless
                                style. Born from a dream to celebrate the beauty
                                of Indian heritage, we set out to create a
                                boutique that brings together grace, culture,
                                and craftsmanship under one roof. We believe
                                every woman deserves to feel confident and
                                radiant in what she wears.{' '}
                            </p>
                            <div className="flex items-center sm:justify-center gap-4 mt-6">
                                <Link
                                    to="#"
                                    className="w-10 h-10 rounded-full border border-white border-opacity-50 flex items-center justify-center group hover:border-primary duration-300"
                                >
                                    <FaFacebookF className=" text-white text-opacity-70 group-hover:text-primary duration-300 group-hover:text-opacity-100" />
                                </Link>
                                <Link
                                    to="#"
                                    className="w-10 h-10 rounded-full border border-white border-opacity-50 flex items-center justify-center group hover:border-primary duration-300"
                                >
                                    <FaTwitter className=" text-white text-opacity-70 group-hover:text-primary duration-300 group-hover:text-opacity-100" />
                                </Link>
                                <Link
                                    to="#"
                                    className="w-10 h-10 rounded-full border border-white border-opacity-50 flex items-center justify-center group hover:border-primary duration-300"
                                >
                                    <FaInstagram className=" text-white text-opacity-70 group-hover:text-primary duration-300 group-hover:text-opacity-100" />
                                </Link>
                                <Link
                                    to="#"
                                    className="w-10 h-10 rounded-full border border-white border-opacity-50 flex items-center justify-center group hover:border-primary duration-300"
                                >
                                    <FaLinkedin className=" text-white text-opacity-70 group-hover:text-primary duration-300 group-hover:text-opacity-100" />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:max-w-[460px] sm:w-[45%] lg:w-full flex items-center justify-around gap-10 footer-inner-wrapper">
                            <div>
                                <h4 className="text-white leading-none mb-5 md:mb-6 text-xl md:text-2xl">
                                    Customer Service
                                </h4>
                                <ul className="text-white leading-none flex flex-col gap-4">
                                    {footerLink4.map((item, index) => {
                                        return (
                                            <li
                                                className="duration-100 hover:text-primary inline-block group"
                                                key={index}
                                            >
                                                <Link
                                                    className="text-underline-primary"
                                                    to={item.link}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1722px] mx-auto border-t border-white border-opacity-10 py-5 md:py-7 text-center">
                      <p className="text-white-light inline-flex flex-col md:flex-row items-center justify-center">
                        <span className="mr-2">© {new Date().getFullYear()} Nyraa Sarees</span>
                        
                        <span className="flex items-center mt-2 md:mt-0">
                          Develop with <FaHeart className="mx-1 text-red-500" /> By{' '}
                          <Link
                            to="https://saitechnosolutions.com/"
                            target="_blank"
                            className="ms-1"
                          >
                            Sai Techno Solutions
                          </Link>
                        </span>
                      </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
