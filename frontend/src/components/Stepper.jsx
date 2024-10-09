import { useState } from "react";
import AdressInfo from "./AdressInfo";
import Payment from "./Payment";
import { CartAPI } from "../services/cartApi";
import { OderAPI } from "../services/orderApi";

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { step: 1, label: 'Delivery information', description: 'Step 1' },
    { step: 2, label: 'Check your order', description: 'Step 2' },
  ];

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return <AdressInfo />;
      case 2:
        return <Payment />;
      default:
        return null;
    }
  };

  const handleFinalStep = async () => {
    try {
        await OderAPI.addOrder();
        console.log('order passed successfully')
      }catch (error) {
        console.log('error while adding item to cart',error)
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
      {/* Stepper Navigation */}
      <ol className="flex flex-col md:flex-row items-start md:items-center w-full space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8">
        {steps.map(({ step, label, description }) => (
          <li key={step} className="flex-1 w-full md:w-auto">
            <a
              className={`flex flex-row md:flex-col items-center border-l-2 md:border-l-0 md:border-t-2 border-solid pl-4 md:pl-0 pt-0 md:pt-4 font-medium
              ${step === currentStep ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}
              onClick={() => goToStep(step)}
              href="#"
            >
              <span className={`text-sm lg:text-base mr-2 md:mr-0 ${step <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                {description}
              </span>
              <h4 className={`text-base lg:text-lg ${step === currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </h4>
            </a>
          </li>
        ))}
      </ol>

      {/* Render form content based on current step */}
      <div className="mt-8 p-4 border rounded-lg">
        {renderForm()}
      </div>

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
          {currentStep === steps.length ? 'Confirm the order' : 'Next'}
        </button>
      </div>
    </div>
  );
}