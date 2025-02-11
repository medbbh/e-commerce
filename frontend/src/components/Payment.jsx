import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { PaymentAPI } from '../services/paymentApi';
import { OrderAPI } from '../services/orderApi';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const navigate = useNavigate();
   
  useEffect(() => {
    async function createIntent() {
      try {
        const res = await PaymentAPI.createPaymentIntent();
        setClientSecret(res.data.clientSecret);
        setPaymentId(res.data.paymentId);
      } catch (error) {
        setErrorMessage("Payment initialization failed");
      }
    }
    createIntent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setProcessing(true);
    const cardElement = elements.getElement(CardElement);
    
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });
    
    if (payload.error) {
      setErrorMessage(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      try {
        await OrderAPI.finalizeOrder(paymentId);
        setSucceeded(true);
        navigate('/orders');
      } catch (error) {
        setErrorMessage("Order finalization failed");
      }
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto rounded-2xl p-8">
      <div className="text-center mb-8">
        <CreditCard className="mx-auto w-16 h-16 text-[#1f2937] mb-4" />
        <h2 className="text-3xl font-bold text-[#1f2937]">Payment Details</h2>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center">
          <AlertTriangle className="text-red-500 mr-4 w-8 h-8" />
          <span className="text-red-800 font-medium">{errorMessage}</span>
        </div>
      )}

      {succeeded ? (
        <div className="text-center">
          <CheckCircle className="mx-auto w-24 h-24 text-green-500 mb-6" />
          <h3 className="text-2xl font-bold text-green-800 mb-4">Payment Successful!</h3>
          <p className="text-gray-600">Your order has been confirmed and processed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <CardElement 
              options={{ 
                style: { 
                  base: { 
                    fontSize: '18px',
                    color: '#1f2937',
                    '::placeholder': { color: '#9ca3af' }
                  } 
                },
                hidePostalCode: true 
              }} 
            />
          </div>
          <button 
            type="submit" 
            disabled={!stripe || processing || !clientSecret}
            className="w-full py-4 bg-[#1f2937] text-white rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-50"
          >
            {processing ? "Processing Payment..." : "Pay Now"}
          </button>
        </form>
      )}
    </div>
  );
}