import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveData } from "../../redux/authSlice.js";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import { useEffect ,useState} from "react";

export default function PremiumPage() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(199);
  const userId = useSelector((state) => state.auth.id);
  const emailId = useSelector((state) => state.auth.email);
  let trackStatus = false;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/payment/premium-price`);
        setPrice(response.data.price);
      } catch (error) {
        console.error("Error fetching premium price:", error);
      }
    };

    fetchPrice();
  }, []);
  

  const handleBuyNow = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/order`, {
       
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.order.amount,
        currency: "INR",
        name: "Naulej Premium",
        description: "Access premium features",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/payment/verify`,
              {
                ...response,
                userId,
                amount: data.order.amount / 100,
              }
            );
            if (verifyRes.data.success) {
              toast.success("Payment Successful!");
              setTimeout(() => {
                toast.success("Congratulations! You are now a premium member!");
              }, 2000);

              dispatch(
                saveData({
                  token: localStorage.getItem("token"),
                  id: userId,
                  email: emailId,
                  isPremium: true,
                  role: "student",
                })
              );
              navigate("/dashboard");
            } else {
           

              toast.error("Payment verification failed!");
              console.error("Verification Error:", verifyRes.data);
            }
          } catch (error) {
            toast.error("An error occurred during payment verification.");
            console.error("Payment Verification Error:", error);
          }
        },
        modal: {
          ondismiss: function () {
            if (!trackStatus) {
              toast.error("Payment cancelled");
            }
          },
        },
        retry: {
          enabled: false,
        },
        prefill: {
          email: emailId,
        },
        theme: { color: "#059669" },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
          trackStatus = true;
        toast.error("Payment failed!");
        razor.close();
        console.error("Payment Failed:", response.error);
      });
      razor.open();
    } catch (error) {
      toast.error("An error occurred while initiating payment.");
      console.error("Payment Initiation Error:", error);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

     
     <Navbar className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" show={false} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 px-4 ">
    
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-8 text-center">
          Upgrade to Naulej Premium
        </h1>

      
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border border-emerald-100 relative overflow-hidden">
     
          <div className="text-left bg-emerald-50 rounded-xl p-5 mb-8">
            <h3 className="text-lg font-bold text-center text-emerald-700 mb-3">
              Premium Benefits
            </h3>
            <ul className="text-gray-700 text-sm font-bold space-y-2">
              <li>✅ Apply for jobs instantly with one click.</li>
              <li>✅ Your profile is sent directly to HR after applying.</li>
              <li>✅ Access to premium job openings .</li>
              <li>✅ AI-powered resume insights and smart recommendations.</li>
            </ul>
          </div>
          <p className="text-gray-500 font-semibold mb-6 leading-relaxed">
            Get direct access to top companies, apply instantly, and let your
            profile reach HR professionals directly. Unlock full job
            opportunities and AI-powered placement support.
          </p>

      
          <h3 className="text-4xl font-extrabold text-emerald-700 mb-2">
            ₹{price}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            One-time upgrade. Lifetime access.
          </p>

          <button
            onClick={handleBuyNow}
            className="bg-emerald-600 text-white font-semibold px-10 py-3 rounded-full hover:cursor-pointer hover:bg-emerald-700"
          >
            Buy Now & Unlock Premium
          </button>
        </div>

        
        <p className="mt-10 text-sm text-gray-500 text-center mb-4 max-w-md">
          Once upgraded, you’ll gain access to exclusive job openings and tools
          to enhance your hiring journey.
        </p>
      </div>
  
      <Footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
    </>
  );
}
