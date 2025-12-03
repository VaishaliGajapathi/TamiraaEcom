import { useEffect, useState } from 'react'
import logonew from '../../assets/img/new_logo/logo_new.png'
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
          className={`header-area fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scroll ? 'shadow-md' : ''
          } bg-white`}
        >
            <div className="container">
               <div className="flex items-center justify-between gap-5 px-5 py-2 md:py-2 bg-white">
                    <Link to="/" aria-label="Nyra Sarees">
                        <img
                            src={logonew}
                            alt=""
                            className="dark:hidden w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[120px] lg:h-[100px] object-contain"
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
                                {/* <li
                                    className={
                                        current === '/about'
                                            ? 'text-primary'
                                            : ''
                                    }
                                >
                                    <Link to="/about">About Us</Link>
                                </li> */}
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
                            </ul>
                        </div>
                    </div>
                    <NavMenu toggle={toggle} setToggle={setToggle} />
                </div>
            </div>
        </div>
    )
}
