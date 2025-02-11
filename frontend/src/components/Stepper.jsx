import React, { useState, useEffect } from "react";
import { MapPin, ShoppingCart, CreditCard } from "lucide-react";
import AddressInfo from "./AdressInfo";
import OrderSummary from "./OrderSummary";
import Payment from "./Payment";
import { fetchAddress } from "../services/adressApi";
import { useCart } from "../context/CartContext";

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [error, setError] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    if (currentStep === 1) {
      async function getAddress() {
        try {
          const res = await fetchAddress();
          if (res.data && res.data.length > 0) {
            setDeliveryInfo(res.data[0]);
          }
        } catch (error) {
          setError("Failed to fetch delivery information");
        }
      }
      getAddress();
    }
  }, [currentStep]);

  const steps = [
    { step: 1, label: "Delivery Info", icon: <MapPin /> },
    { step: 2, label: "Order Summary", icon: <ShoppingCart /> },
    { step: 3, label: "Payment", icon: <CreditCard /> },
  ];

  const nextStep = () => {
    if (currentStep === 1 && (!deliveryInfo || !deliveryInfo.phone)) {
      setError("Please complete delivery information");
      return;
    }
    if (currentStep === 2 && (!cart || cart.length === 0)) {
      setError("Your cart is empty");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    setError(null);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  return (
    <div className=" bg-white flex justify-center m-12">
      <div className="max-w-1/2 lg:w-4/5 bg-white shadow-lg">
        
        {/* --- Horizontal Step Indicator with Animated Lines & Circles --- */}
        <div className="px-6 pt-6">
          <div className="flex items-center">
            {steps.map((item, idx) => {
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              const isLastStep = idx === steps.length - 1;

              // Circle & label classes for each step state
              let circleColor = "bg-gray-300 text-gray-500"; // future steps
              let scaleClass = "";
              if (isCompleted) {
                circleColor = "bg-green-500 text-white";
              }
              if (isActive) {
                circleColor = "bg-[#374151] text-white";
                scaleClass = "scale-110";
              }

              return (
                <React.Fragment key={item.step}>
                  {/* Step Circle + Label */}
                  <div className="flex flex-col items-center flex-none">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 ease-in-out
                        ${circleColor} ${scaleClass}
                      `}
                    >
                      {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    </div>
                    <span
                      className={`text-sm font-semibold mt-2 transition-colors duration-300 ${
                        isCompleted || isActive ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Animated Line (except after last step) */}
                  {!isLastStep && (
                    <div
                      className={`
                        flex-auto h-0.5 mx-2 transition-all duration-300 ease-in-out 
                        ${isCompleted ? "bg-green-500" : isActive ? "bg-[#374151]" : "bg-gray-300"}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="px-6 py-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Step-Specific Components */}
          {currentStep === 1 && (
            <AddressInfo
              deliveryInfo={deliveryInfo}
              setDeliveryInfo={setDeliveryInfo}
              onError={setError}
            />
          )}
          {currentStep === 2 && <OrderSummary />}
          {currentStep === 3 && <Payment />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-[#374151] text-white rounded-lg hover:bg-black transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  