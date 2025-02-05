import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import { getProduct } from "../services/productApi";
import { X, ShoppingCart, Star, Trash2 } from 'lucide-react';
import ProductReviews from "./ProductReviews";
import { useCart } from "../context/CartContext";  // ✅ Import Cart Context

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { cart, addToCart, updateItemQuantity, deleteItem, showAlert } = useCart();  // ✅ Use Cart Context

    useEffect(() => {
        const fetchProduct = async (productId) => {
            try {
                const data = await getProduct(productId);
                setMainImage(data.images[0].image);
                setProduct(data);
            } catch (error) {
                console.error("❌ Error fetching product:", error);
                showAlert("❌ Error fetching product details. Please try again.", "error");
            }
        };

        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ✅ Check if the product is already in the cart
    const cartItem = cart.find(item => item.id === product?.id);

    // ✅ Handle Add to Cart or Update Quantity
    const handleAddToCart = () => {
        if (cartItem) {
            updateItemQuantity(cartItem.cart_id, quantity); // ✅ Update quantity directly
            showAlert(`✅ Quantity updated to ${quantity}!`, "success");
        } else {
            addToCart(product.id, quantity);  // ✅ Add new item if not in cart
            showAlert("✅ Product added to cart!", "success");
        }
    };

    // ✅ Handle Quantity Input Change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= product.count_in_stock) {
            setQuantity(value);
            if (cartItem) updateItemQuantity(cartItem.cart_id, value); // ✅ Auto update cart
        }
    };

    // ✅ Handle Removing Product from Cart
    const handleRemoveFromCart = () => {
        if (cartItem) {
            deleteItem(cartItem.cart_id); // ✅ Remove item from cart
            showAlert("❌ Product removed from cart!", "warning");
        }
    };

    if (!product) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap -mx-4">
                        {/* Product Images */}
                        <div className="w-full lg:w-1/2 px-4 mb-8">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-96 object-cover cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={openModal}
                                />
                            </div>
                            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer transition duration-300 ${
                                            image.image === mainImage ? 'border-2 border-blue-500' : 'opacity-60 hover:opacity-100'
                                        }`}
                                        onClick={() => setMainImage(image.image)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
                                <div className="mb-4 flex items-center">
                                    <span className="text-2xl font-bold text-blue-600 mr-2">{product.price} <span className="text-sm font-normal">MRU</span></span>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            size={20}
                                            fill={index < Math.round(product.average_rating) ? "gold" : "none"}
                                            stroke={index < Math.round(product.average_rating) ? "gold" : "currentColor"}
                                            className="text-yellow-400"
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm">{product.average_rating} ({product.num_of_reviews} reviews)</span>
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                                {/* Quantity Input */}
                                <div className="mb-6">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            id="quantity" 
                                            name="quantity" 
                                            min="1" 
                                            max={product.count_in_stock}
                                            value={cartItem ? cartItem.quantity : quantity} // ✅ Show correct quantity
                                            onChange={handleQuantityChange}
                                            className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                                        />
                                        <span className="ml-2 text-sm text-gray-500">
                                            {product.count_in_stock} available
                                        </span>
                                    </div>
                                </div>

                                {/* Add or Remove from Cart Button */}
                                {cartItem ? (
                                    <button
                                        onClick={handleRemoveFromCart}
                                        className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 flex items-center justify-center"
                                    >
                                        <Trash2 className="mr-2" size={20} />
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 flex items-center justify-center"
                                    >
                                        <ShoppingCart className="mr-2" size={20} />
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <ProductReviews productId={id} />
                </div>
            </div>
        </>
    );
}

export default ProductDetail;
