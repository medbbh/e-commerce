import { useCart } from "../context/CartContext";

export default function Payment() {
  // Destructure cart and updateItemQuantity from context
  const { cart, updateItemQuantity } = useCart();

  // Calculate the total price from the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Increase quantity by 1
  const handleIncrease = (cartId, currentQty, countInStock = Infinity) => {
    if (currentQty < countInStock) {
      updateItemQuantity(cartId, currentQty + 1);
    } else {
      alert("Cannot exceed stock limit!");
    }
  };

  // Decrease quantity by 1
  const handleDecrease = (cartId, currentQty) => {
    if (currentQty > 1) {
      updateItemQuantity(cartId, currentQty - 1);
    } else {
      alert("Quantity cannot be less than 1!");
    }
  };

  // If cart is empty, show a message
  if (!cart || cart.length === 0) {
    return <p>Your cart is empty. Please add items first.</p>;
  }

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id} className="border rounded-lg p-3 mb-4 shadow-sm flex items-center space-x-4">
          {/* Product Image */}
          <img
            src={item.images?.[0]?.image || "/placeholder.png"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1 min-w-0">
            <h5 className="text-lg font-semibold">{item.name}</h5>
            <p className="text-sm text-gray-600">{item.description}</p>

            {/* Quantity Buttons */}
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => handleDecrease(item.cart_id, item.quantity)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.cart_id, item.quantity, item.count_in_stock)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Product Price */}
          <div className="text-lg font-bold text-blue-600">{item.price} MRO</div>
        </div>
      ))}

      {/* Subtotal */}
      <div className="flex justify-between items-center border-t pt-4">
        <h5 className="text-lg font-semibold">Subtotal</h5>
        <span className="text-xl font-bold text-red-600">
          {calculateTotalPrice()} MRO
        </span>
      </div>
    </div>
  );
}
