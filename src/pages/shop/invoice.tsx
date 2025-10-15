import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Define the type for a single product/order item
interface OrderItem {
  id: number;
  productname: string;
  product_variant_image: string;
  product_price: number;
  quantity: number;
  total_price: number;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  zipCode: string;
  phoneNo: string;
  orderId: string;
  totalAmount: number;
  grandTotalAmount: number;
  couponCodeName?: string;
  productColor?: string;
  currency: string;
  discount_price: number;
}



export default function Invoice() {
  const { orderId } = useParams();
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${API_BASE_URL}/api/orders/order-history/order/${orderId}`)
      .then(res => setOrderHistory(res.data.history || []))
      .catch(err => console.error("Error fetching invoice data:", err));
  }, [orderId]);

  if (!orderHistory.length) {
    return <p className="text-center py-20">Loading invoice...</p>;
  }

  const orderInfo = orderHistory[0]; // Common info (customer, address, totals)
  const products = orderHistory.map(item => ({
    id: item.id,
    name: item.productname,
    image: `${API_BASE_URL}/uploads/${item.product_variant_image}`, // adjust path
    price: item.product_price ?? 0,
    quantity: item.quantity,
    total: item.total_price,
    productColor: item.productColor
  }));

  const currencySymbol = orderInfo.currency?.toUpperCase() === 'USD' ? '$' : '₹';
  

  return (
    <div className="s-py-100 min-h-screen bg-gray-100">
  <div className="container">
    <div className="max-w-[800px] mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Invoice : {orderInfo.orderId}</h1>
         {/* <button
      className="btn btn-outline"
      onClick={() => navigate("/")} 
      data-text="Back to Home"
    >
      Back to Home
    </button> */}
        <button
          className="btn btn-outline"
          onClick={() => window.print()}
          data-text="Print Invoice"
        >
          Print Invoice
        </button>
      </div>

      {/* Customer + Shop Info */}
      <div className="grid md:grid-cols-2 gap-5 mb-10 bg-gray-50 p-6 rounded-lg border">
        <div>
          <h2 className="font-semibold mb-3">Shop Information</h2>
          <p>Tamiraa Store</p>
          <p>Coimbatore, India</p>
        </div>
        <div>
          <h2 className="font-semibold mb-3">Customer Information</h2>
          <p>{orderInfo.fullName}</p>
          <p>{orderInfo.addressLine1}, {orderInfo.addressLine2}</p>
          <p>{orderInfo.townCity}, {orderInfo.zipCode}</p>
          <p>{orderInfo.phoneNo}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Color</th>
              <th className="p-2 text-center">Unit Price {currencySymbol}</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Total {currencySymbol}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-2 flex items-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-12 object-cover mr-3"
                  />
                  <span>{p.name}</span>
                </td>
                <td className="p-2 text-center">
                  <div
                    className="w-6 h-6 mx-auto  border"
                    style={{ backgroundColor: p.productColor || "#ffffff" }}
                  ></div>
                </td>
                <td className="p-2 text-center">{currencySymbol} {p.price}</td>
                <td className="p-2 text-center">{p.quantity}</td>
                <td className="p-2 text-right">{currencySymbol} {p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 text-right space-y-2">
       <p><strong>Total Amount : </strong> {currencySymbol} {orderInfo.totalAmount}</p>
       {orderInfo.couponCodeName && (
         <p><strong>Discount : </strong>  {currencySymbol} {orderInfo.discount_price}</p>
       )}
       <p><strong>Grand Total:</strong> {currencySymbol} {orderInfo.grandTotalAmount}</p>
     </div>
    </div>
  </div>
</div>
  );
}

