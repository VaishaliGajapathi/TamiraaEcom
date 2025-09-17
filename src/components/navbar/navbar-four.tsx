import { useEffect, useState } from 'react'
import logonew from '../../assets/img/new_logo/logo_new.png'
import { Link } from 'react-router-dom'
import NavMenu from './nav-menu'
import { useCurrency, SupportedCurrency } from '../../context/CurrencyContext'

export default function NavbarFour() {
    const [toggle, setToggle] = useState<boolean>(false)
    const [current, setCurrent] = useState<string>('')
    const [scroll, setScroll] = useState<boolean>(false)
    const { currency, setCurrency } = useCurrency()

    useEffect(() => {
        window.scrollTo(0, 0)
        setCurrent(window.location.pathname)

        const handlerScroll = () => {
            if (window.scrollY > 50) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }

        window.addEventListener('scroll', handlerScroll)

        return () => {
            window.removeEventListener('scroll', handlerScroll)
        }
    }, [])

    return (
       <div
  className={`header-area header-v3-area header-v4
    fixed top-0 left-0 right-0 z-50
    lg:absolute lg:top-7
    ${scroll ? 'sticky-header bg-white' : 'lg:bg-transparent'}`}
>
            <div className="container">
                <div className="header-v4-wrapper relative flex items-center justify-between gap-5 bg-white lg:bg-opacity-80 rounded-[10px] dark:bg-title lg:dark:bg-opacity-80 px-5 py-3 md:py-5 lg:py-0">
                    <Link to="/" aria-label="Nyra Sarees">
                        <img
                            src={logonew}
                            alt=""
                            className="dark:hidden w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[120px] lg:h-[120px] object-contain"
                        />
                        <img
                            src={logonew}
                            alt=""
                            className="dark:block hidden w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[120px] lg:h-[120px] object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-12 2xl:gap-24">
                        <div
                            className={`main-menu absolute z-50 w-full lg:w-auto top-full left-0 lg:static bg-white dark:bg-title lg:bg-transparent lg:dark:bg-transparent px-5 sm:px-[30px] py-[10px] sm:py-5 lg:px-0 lg:py-0 ${
                                toggle ? 'active' : ''
                            }`}
                        >
                            <ul className="text-lg leading-none text-title dark:text-white lg:flex lg:gap-[30px]">
                                <li
                                    className={
                                        current === '/' ? 'text-primary' : ''
                                    }
                                >
                                    <Link to="/">Home</Link>
                                </li>
                                <li
                                    className={
                                        current === '/about'
                                            ? 'text-primary'
                                            : ''
                                    }
                                >
                                    <Link to="/about">About Us</Link>
                                </li>
                                <li
                                    className={
                                        current === '/allproducts'
                                            ? 'text-primary'
                                            : ''
                                    }
                                >
                                    <Link to="/allproducts">Products</Link>
                                </li>
                                <li
                                    className={
                                        current === '/contact'
                                            ? 'text-primary'
                                            : ''
                                    }
                                >
                                    <Link to="/contact">Contact</Link>
                                </li>

                                <div className="flex items-center gap-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currency === 'USD'}
                                            onChange={(e) => {
                                                const newCurrency: SupportedCurrency =
                                                    e.target.checked
                                                        ? 'USD'
                                                        : 'INR'
                                                setCurrency(newCurrency)
                                            }}
                                            className="sr-only peer"
                                        />
                                        <div className="w-16 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-[#BB976D] transition-colors duration-300"></div>
                                        <span className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full peer-checked:translate-x-8 transform transition-transform duration-300"></span>
                                    </label>

                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {currency === 'INR' ? 'INR ₹' : 'USD $'}
                                    </span>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <NavMenu toggle={toggle} setToggle={setToggle} />
                </div>
            </div>
        </div>
    )
}
