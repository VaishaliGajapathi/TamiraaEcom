import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bg from '../../assets/img/shortcode/breadcumb.jpg';
import AccountTab from '../../components/account/account-tab';
import FooterOne from '../../components/footer/footer-one';
import ScrollToTop from '../../components/scroll-to-top';
import Aos from 'aos';
import NavbarFour from '../../components/navbar/navbar-four';
import axios from 'axios';
import { getStoredUser } from '../../utils/user';

interface Order {
  orderId: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  deliveryStatus: string;
  paymentStatus: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
  Aos.init();

  const user = getStoredUser();
  const userId = user?.id;

  if (!userId) {
    console.error("User not logged in");
    return;
  }

  // 1️⃣ Fetch order history (per product)
  axios
    .get(`http://localhost:5000/api/orders/order-history/${userId}`)
    .then(historyRes => {
      const history = historyRes.data.history || [];

      // 2️⃣ Fetch orders summary
      axios
        .get(`http://localhost:5000/api/orders/user/${userId}`)
        .then(ordersRes => {
          const ordersSummary = ordersRes.data.orders || [];

          // Group products by orderId
          const grouped: Record<string, any> = {};
          history.forEach((item: any) => {
            if (!grouped[item.orderId]) {
              // Find deliveryStatus & paymentStatus from ordersSummary
              const summary = ordersSummary.find(
                (o: any) => o.orderId === item.orderId
              );

              grouped[item.orderId] = {
                orderId: item.orderId,
                fullName: item.fullName,
                address: `${item.addressLine1}, ${item.addressLine2}`,
                deliveryStatus: summary?.deliveryStatus || 'pending',
                paymentStatus: summary?.paymentStatus || 'unpaid',
              };
            }
          });

          setOrders(Object.values(grouped));
        })
        .catch(err => {
          console.error('Error fetching orders summary:', err);
        });
    })
    .catch(err => {
      console.error('Error fetching order history:', err);
    });
}, []);

  return (
    <>
      <NavbarFour />

      {/* Breadcrumb */}
      <div
        className="relative flex items-center justify-center gap-4 flex-wrap w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-cover bg-center bg-no-repeat pt-16 sm:pt-20 md:pt-24 lg:pt-32 before:absolute before:inset-0 before:bg-title before:bg-opacity-70"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="relative text-center w-full z-10">
          <h2 className="text-white text-3xl sm:text-4xl md:text-[40px] font-normal leading-none">
            Order History
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-sm sm:text-base md:text-lg font-normal text-white mt-3 sm:mt-4 flex-wrap">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>/</li>
            <li className="text-primary">History</li>
          </ul>
        </div>
      </div>

      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            <div className="w-full md:w-[200px] lg:w-[300px] flex-none" data-aos="fade-up" data-aos-delay="100">
              <AccountTab />
            </div>

            <div className="w-full md:w-auto md:flex-1 overflow-auto" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px] order-history-table">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2">Order ID</th>
                      <th className="px-4 py-2">Customer Name</th>
                      {/* <th className="px-4 py-2">Address</th> */}
                      <th className="px-4 py-2">Delivery Status</th>
                      <th className="px-4 py-2">Payment Status</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length ? (
                      orders.map((order, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-2">{order.orderId}</td>
                          <td className="px-4 py-2">{order.fullName}</td>
                          {/* <td className="px-4 py-2">
                            {[order.addressLine1, order.addressLine2].filter(Boolean).join(", ")}
                          </td> */}
                          <td className="px-4 py-2">{order.deliveryStatus}</td>
                          <td className="px-4 py-2">{order.paymentStatus}</td>
                          <td className="px-4 py-2">
                            <Link
                              to={`/invoice/${order.orderId}`}  // Link to invoice page
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
