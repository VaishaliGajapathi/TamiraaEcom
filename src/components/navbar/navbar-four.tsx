import { useEffect, useState } from 'react'
import logo from '../../assets/img/svg/logo.svg'
import logoLight from '../../assets/img/svg/logo-light.svg'
import { Link } from 'react-router-dom'
import NavMenu from './nav-menu'

export default function NavbarFour() {
    const [toggle, setToggle] = useState<boolean>(false)
    const [current, setCurrent] = useState<string>('')
    const [scroll, setScroll] = useState<boolean>(false)

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
            className={`header-area header-v3-area header-v4 absolute z-50 left-0 right-0 top-[10px] sm:top-5 lg:top-7 ${
                scroll ? 'sticky-header bg-white' : 'lg:bg-transparent'
            }`}
        >
            <div className="container">
                <div className="header-v4-wrapper relative flex items-center justify-between gap-5 bg-white lg:bg-opacity-80 rounded-[10px] dark:bg-title lg:dark:bg-opacity-80 px-5 py-3 md:py-5 lg:py-0">
                    <Link to="/" aria-label="Furnixar">
                        <img
                            src={logo}
                            alt=""
                            className="dark:hidden w-[120px] sm:w-[200px]"
                        />
                        <img
                            src={logoLight}
                            alt=""
                            className="dark:block hidden w-[120px] sm:w-[200px]"
                        />
                    </Link>
                    <div className="flex items-center gap-12 2xl:gap-24">
                        <div
                            className={`main-menu absolute z-50 w-full lg:w-auto top-full left-0 lg:static bg-white dark:bg-title lg:bg-transparent lg:dark:bg-transparent px-5 sm:px-[30px] py-[10px] sm:py-5 lg:px-0 lg:py-0 ${
                                toggle ? 'active' : ''
                            }`}
                        >
                            <ul className="text-lg leading-none text-title dark:text-white lg:flex lg:gap-[30px]">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/about">About Us</Link>
                                </li>
                                <li>
                                    <Link to="/allproducts">Products</Link>
                                </li>
                                <li>
                                    <Link to="/contact">Contact</Link>
                                </li>
                                <li className="lg:hidden">
                                    <Link to="/login">Login</Link>
                                </li>
                            </ul>
                        </div>

                        <NavMenu toggle={toggle} setToggle={setToggle} />
                    </div>
                </div>
            </div>
        </div>
    )
}
