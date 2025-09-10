import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AccountTab() {
    const [current, setCurrent] = useState<string>('')
     const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setCurrent(window.location.pathname);
    }, []);

    const handleLogout = () => {
        logout();           // clears auth state
        localStorage.removeItem('token'); // remove JWT if you store it
        navigate('/login'); // redirect to login page
    };

    return (
        <ul className="divide-y dark:divide-paragraph text-title dark:text-white text-base sm:text-lg lg:text-xl flex flex-col justify-center leading-none">
            <li
                className={` py-3 lg:py-6 pl-6 lg:pl-12 ${
                    current === '/my-profile' ? 'active text-primary' : ''
                }`}
            >
                <Link
                    className="duration-300 hover:text-primary"
                    to="/my-profile"
                >
                    My Profile
                </Link>
            </li>
            {/* <li
                className={`py-3 lg:py-6 pl-6 lg:pl-12 ${
                    current === '/my-account' ? 'active text-primary' : ''
                }`}
            >
                <Link
                    className="duration-300 hover:text-primary"
                    to="/my-account"
                >
                    My Account
                </Link>
            </li> */}
            <li
                className={`py-3 lg:py-6 pl-6 lg:pl-12 ${
                    current === '/edit-account' ? 'active text-primary' : ''
                }`}
            >
                <Link
                    className="duration-300 hover:text-primary"
                    to="/edit-account"
                >
                    Edit Account
                </Link>
            </li>
            <li
                className={`py-3 lg:py-6 pl-6 lg:pl-12 ${
                    current === '/order-history' ? 'active text-primary' : ''
                }`}
            >
                <Link
                    className="duration-300 hover:text-primary"
                    to="/order-history"
                >
                    Order History
                </Link>
            </li>
            <li
                className={`py-3 lg:py-6 pl-6 lg:pl-12 ${
                    current === '/wishlist' ? 'active text-primary' : ''
                }`}
            >
                <Link
                    className="duration-300 hover:text-primary"
                    to="/wishlist"
                >
                    Wishlist
                </Link>
            </li>
            <li className={`py-3 lg:py-6 pl-6 lg:pl-12`}>
                {/* Call handleLogout on click instead of just linking */}
                <button
                    onClick={handleLogout}
                    className="duration-300 hover:text-primary text-left w-full"
                >
                    Logout
                </button>
            </li>
        </ul>
    )
}
