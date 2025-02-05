import { useState, useEffect } from "react";
import AddressInfo from "./AdressInfo";
import Payment from "./Payment";
import { OrderAPI } from "../services/orderApi";
import { useCart } from "../context/CartContext";
import { fetchAddress } from "../services/adressApi";  // ✅ Fetch delivery info
import { useNavigate } from "react-router-dom";  // ✅ Import this at the top

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState(null); // Store the delivery info
  const { cart } = useCart(); // Get cart from context
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();  // ✅ Add this inside the Stepper function

  const steps = [
    { step: 1, label: "Delivery Information", description: "Step 1" },
    { step: 2, label: "Check Your Order", description: "Step 2" },
  ];

  // ✅ Fetch `DeliveryInfo` when reaching the order confirmation step
  useEffect(() => {
    if (currentStep === 2) {
      fetchDeliveryInfo();
    }
  }, [currentStep]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const fetchDeliveryInfo = async () => {
    try {
      const response = await fetchAddress();  // ✅ Fetch delivery info from backend
      if (response.data.length > 0) {
        setDeliveryInfo(response.data[0]);  // ✅ Store first address
      } else {
        showAlert('Please add your delivery information before placing an order.', 'error');

        setCurrentStep(1);  // 🚨 Redirect back to step 1 if no delivery info exists
      }
    } catch (error) {
      console.error("❌ Error fetching delivery info:", error);
      showAlert('Failed to load delivery information.', 'error');
      setCurrentStep(1);
    }
  };

  const handleFinalStep = async () => {
    try {
      if (!deliveryInfo) {
        showAlert('Please enter your delivery information before placing an order.', 'error');
        return;
      }

      if (cart.length === 0) {
        showAlert('Your cart is empty. Add some items before placing an order.', 'error');

        return;
      }

      await OrderAPI.addOrder(); // ✅ No need to send address
      console.log("✅ Order placed successfully!");
      showAlert('Order placed successfully!', 'success');
      navigate("/orders");

    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error);
      showAlert("Failed to place order", 'error');
      
    }
  };

  const handleNextStep = () => {
    if (currentStep === steps.length) {
      handleFinalStep();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 p-4 md:p-8 lg:p-20 mx-auto">
    {alert.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
          alert.type === 'error' ? 'bg-red-100 text-red-700' :
          alert.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {alert.message}
        </div>
      )}
      {/* Stepper Navigation */}
      <ol className="flex flex-col md:flex-row items-start md:items-center w-full space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8">
        {steps.map(({ step, label, description }) => (
          <li key={step} className="flex-1 w-full md:w-auto">
            <a
              className={`flex flex-row md:flex-col items-center border-l-2 md:border-l-0 md:border-t-2 border-solid pl-4 md:pl-0 pt-0 md:pt-4 font-medium
              ${step === currentStep ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400"}`}
              onClick={() => setCurrentStep(step)}
              href="#"
            >
              <span className={`text-sm lg:text-base mr-2 md:mr-0 ${step <= currentStep ? "text-blue-600" : "text-gray-400"}`}>
                {description}
              </span>
              <h4 className={`text-base lg:text-lg ${step === currentStep ? "text-gray-900" : "text-gray-400"}`}>
                {label}
              </h4>
            </a>
          </li>
        ))}
      </ol>

      {/* Render form content based on current step */}
      <div className="mt-8 p-4 border rounded-lg">
        {currentStep === 1 ? <AddressInfo setDeliveryInfo={setDeliveryInfo}/> : <Payment />}
      </div>

      {/* ✅ Show Delivery Info on Order Confirmation Step */}
      {currentStep === 2 && deliveryInfo && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">📍 Delivery Information</h3>
          <p><strong>Phone:</strong> {deliveryInfo.phone}</p>
          {deliveryInfo.wtsp && <p><strong>WhatsApp:</strong> {deliveryInfo.wtsp}</p>}
          <p><strong>City:</strong> {deliveryInfo.city}</p>
          <p><strong>Street:</strong> {deliveryInfo.street}</p>
          {deliveryInfo.current_location && <p><strong>Location:</strong> {deliveryInfo.current_location}</p>}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          disabled={currentStep === 1}
          className="bg-gray-300 text-gray-600 py-2 px-4 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          Previous
        </button>
        <button
          onClick={handleNextStep}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          {currentStep === steps.length ? "Confirm the order" : "Next"}
        </button>
      </div>
    </div>
  );
}
