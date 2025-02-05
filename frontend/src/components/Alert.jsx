import { useCart } from "../context/CartContext";

export default function AlertComponent() {
  const { alert } = useCart(); 

  if (!alert.show) return null;

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white z-50 transition-opacity duration-500 ${
        alert.type === "success" ? "bg-green-500" :
        alert.type === "error" ? "bg-red-500" :
        alert.type === "warning" ? "bg-yellow-500" :
        "bg-blue-500"
      }`}
    >
      {alert.message}
    </div>
  );
}
