import { useState } from 'react';
import letter from '../../assets/img/svg/letter.svg'

export default function NewsOne() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // handle input with live validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // allow only letters, numbers, @ . _ -
    value = value.replace(/[^A-Za-z0-9@._-]/g, "");

    setEmail(value);
  };

  const handleSubscribe = async () => {
    if (!email) return; // simple empty check

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setEmail('');
        setModalMessage("You have successfully subscribed to our newsletter.");
      } else {
        // show server error in modal
        setModalMessage(data.message || "Subscription failed");
      }
    } catch (err) {
      setModalMessage("Network error. Please try again.");
      console.error("Network error", err);
    } finally {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000); // auto close modal
      setLoading(false);
    }
  };

  return (
    <div className="container">
        <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center">
                <img src={letter} alt="" />                    
            </div>
            <h2 className="font-bold leading-none mt-4 dark:text-white">Newsletter</h2>
            <p className="mt-4 dark:text-white-light">
              Stay in the loop with exclusive offers and updates. Subscribe to our newsletter for the latest trends and promotions delivered straight to your inbox.
            </p>
            <div className="mt-6 lg:mt-12 sm:flex">
                <input 
                  className="w-full h-12 md:h-14 bg-snow border dark:bg-snow dark:bg-opacity-5 border-title focus:border-primary border-opacity-10 p-4 outline-none dark:text-white sm:flex-1 sm:border-r-0" 
                  type="text" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button 
                  className="w-full h-12 bg-title text-white flex items-center justify-center text-base md:text-lg font-medium p-3 mt-3 sm:mt-0 sm:w-32 sm:h-auto sm:flex-none dark:bg-primary"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </div>
        </div>

        {/* MODAL */}
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
              <h2 style={{ marginBottom: "10px", color: modalMessage.includes("successfully") ? "#b91c1c" : "#b91c1c" }}>
                {modalMessage.includes("successfully") ? "Thank You! 💖" : "Thank You! 💖"}
              </h2>
              <p style={{ marginBottom: "8px" }}>{modalMessage}</p>
            </div>
          </div>
        )}
    </div>
  )
}
