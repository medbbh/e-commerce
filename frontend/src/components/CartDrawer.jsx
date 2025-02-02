import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartDrawer({ showDrawer, setShowDrawer, cartItems, deleteItem, updateItemQuantity }) {

  const increaseQuantity = async (cartId, quantity, count_in_stock) => {
    if (quantity < count_in_stock) {
      const newQuantity = quantity + 1;
      await updateItemQuantity(cartId, newQuantity);
    } else {
      console.log("Quantity can't exceed stock limit");
    }
  };
  
  const decreaseQuantity = async (cartId, quantity) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      await updateItemQuantity(cartId, newQuantity);
    } else {
      console.log("Quantity can't be less than 1");
    }
  };
  
  // Calculate the total price dynamically
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div
      className={`relative z-10 ${showDrawer ? "block" : "hidden"}`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto relative w-screen max-w-md">
              <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                <button
                  onClick={() => setShowDrawer(false)}
                  type="button"
                  className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="absolute -inset-2.5"></span>
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <h2 className="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">
                    Your Cart
                  </h2>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {cartItems.length > 0 ? (
                    <section className="py-8 px-4 max-w-3xl mx-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-3 mb-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.images[0].image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-semibold truncate">{item.name}</h5>
                              <p className="text-sm text-gray-600 truncate">{item.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center space-x-2">
                                  <button onClick={() => decreaseQuantity(item.cart_id,item.quantity)} className="text-gray-500 hover:text-gray-700">-</button>
                                  <span className="text-sm font-medium">{item.quantity}</span>
                                  <button onClick={() => increaseQuantity(item.cart_id,item.quantity,item.count_in_stock)} className="text-gray-500 hover:text-gray-700">+</button>
                                </div>
                                <span className="text-lg font-bold text-blue-600">
                                  {item.price} MRO
                                </span>
                              </div>
                            </div>
                            <button onClick={() => deleteItem(item.cart_id)} className="text-red-500 hover:text-red-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Subtotal */}
                      <div className="flex justify-between items-center border-t pt-4 mb-4">
                        <h5 className="text-lg font-semibold">Subtotal</h5>
                        <span className="text-xl font-bold text-blue-600">{calculateTotalPrice()} MRO</span>
                      </div>

                      {/* Checkout */}
                      <p className="text-center text-sm text-gray-600 mb-3">
                        Shipping and taxes calculated at checkout
                      </p>
                      <Link to="/pass-orders" className="block w-full text-center bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
                        Checkout
                      </Link>

                    </section>
                  ) : (
                    <p>Your cart is empty</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
