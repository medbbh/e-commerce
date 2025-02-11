import React from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

export default function OrderSummary() {
  const { cart, updateItemQuantity, removeItem } = useCart();

  const calculateTotalPrice = () => 
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
        <Trash2 className="w-24 h-24 mb-4 text-[#1f2937]" />
        <p className="text-2xl">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1f2937] mb-6">Order Summary</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.images?.[0]?.image || "/placeholder.png"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md mr-6"
            />
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-[#1f2937]">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="text-[#1f2937] font-bold">{item.price} MRO</div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => updateItemQuantity(item.cart_id, item.quantity - 1)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-5 h-5 text-[#1f2937]" />
              </button>
              <span className="font-semibold text-lg">{item.quantity}</span>
              <button 
                onClick={() => updateItemQuantity(item.cart_id, item.quantity + 1)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              >
                <Plus className="w-5 h-5 text-[#1f2937]" />
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.cart_id)}
              className="ml-6 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-6 rounded-lg flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#1f2937]">Total</h3>
        <div className="text-3xl font-bold text-[#1f2937]">
          {calculateTotalPrice()} MRO
        </div>
      </div>
    </div>
  );
}