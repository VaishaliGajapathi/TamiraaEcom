import { useState } from 'react'
import { Link } from 'react-router-dom'
import { shippingAbout, venderInfo } from '../../data/data'

export default function DetailTab() {
    const [activeTab, setActiveTab] = useState<number>(2) // default: Vendor Info

    return (
        <div className="max-w-[985px] mx-auto">
            <div className="product-dtls-navtab border-y border-bdr-clr dark:border-bdr-clr-drk">
                <ul
                    id="user-nav-tabs"
                    className="text-title dark:text-white text-base sm:text-lg lg:text-xl flex leading-none gap-3 sm:gap-6 md:gap-12 lg:gap-24 justify-between sm:justify-start max-w-md sm:max-w-full"
                >
                    {/* Vendor Info */}
                    <li
                        className={`py-3 sm:py-5 relative before:absolute before:w-full before:h-[1px] before:bg-title before:top-full before:left-0 before:duration-300 dark:before:bg-white before:opacity-0 ${
                            activeTab === 2 ? 'active' : ''
                        }`}
                    >
                        <Link
                            className="duration-300 hover:text-primary"
                            to="#"
                            onClick={() => setActiveTab(2)}
                        >
                            Vendor Info
                        </Link>
                    </li>

                    {/* Shipping */}
                    <li
                        className={`py-3 sm:py-5 relative before:absolute before:w-full before:h-[1px] before:bg-title before:top-full before:left-0 before:duration-300 dark:before:bg-white before:opacity-0 ${
                            activeTab === 4 ? 'active' : ''
                        }`}
                    >
                        <Link
                            className="duration-300 hover:text-primary"
                            to="#"
                            onClick={() => setActiveTab(4)}
                        >
                            Shipping
                        </Link>
                    </li>
                </ul>
            </div>

            <div
                id="content"
                className="mt-5 sm:mt-8 lg:mt-12 mx-0 sm:mr-5 md:mr-8 lg:mr-12"
            >
                {/* Vendor Info */}
                {activeTab === 2 && (
                    <div>
                        <div className="max-w-[680px] flex items-start justify-between gap-y-8 gap-x-10 flex-wrap">
                            {venderInfo.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <span className="text-primary sm:text-lg leading-none block">
                                            Shop Name
                                        </span>
                                        <h4 className="font-medium mt-2 sm:mt-3 text-xl sm:text-2xl leading-none">
                                            {item.name}
                                        </h4>
                                        <ul className="mt-4 sm:mt-6 grid gap-3 sm:text-lg">
                                            <li>Vendor : {item.vendor}</li>
                                            <li>Shop : {item.shop}</li>
                                            <li>Mail : {item.mail}</li>
                                            <li>Call : {item.call}</li>
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Shipping */}
                {activeTab === 4 && (
                    <div>
                        {shippingAbout.map((item, index) => {
                            return (
                                <div key={index} className="mb-4">
                                    <h4 className="text-xl sm:text-2xl leading-none font-medium">
                                        {item.title}
                                    </h4>
                                    <p className="sm:text-lg mt-3">
                                        {item.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
