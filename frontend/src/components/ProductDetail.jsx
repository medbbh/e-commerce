import { useEffect, useState } from "react";
import Navbar from "./Navbar"
import { useParams } from 'react-router-dom';
import { getProduct } from "../services/productApi";
import { X, ShoppingCart, Star } from 'lucide-react';
import { CartAPI } from "../services/cartApi";
import ProductReviews from "./ProductReviews";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const fetchProduct = async (productId) => {
            try {
                const data = await getProduct(productId);
                setMainImage(data.images[0].image);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                showAlert("Error fetching product details. Please try again.", "error");
            }
        };

        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const addToCart = async (productId, quantity) => {
        setIsAddingToCart(true);
        try {
            const cartItems = await CartAPI.getCart();
            const productExists = cartItems.some(item => item.product === productId);
            if (productExists) {
                showAlert('Product is already in your cart.', 'info');
            } else {
                await CartAPI.addItem(productId, quantity);
                showAlert('Product added to cart successfully!', 'success');
            }
        } catch (error) {
            console.error('Error while adding item to cart', error);
            showAlert('Failed to add product to cart. Please try again.', 'error');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
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
                    {alert.show && (
                        <div className={`mb-4 p-4 rounded-md ${
                            alert.type === 'error' ? 'bg-red-100 text-red-700' :
                            alert.type === 'success' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {alert.message}
                        </div>
                    )}
                    
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
                                    {/* <span className="text-gray-500 line-through">$399.99</span> */}
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

                                <div className="mb-6">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            id="quantity" 
                                            name="quantity" 
                                            min="1" 
                                            max={product.count_in_stock}
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                                        />
                                        <span className="ml-2 text-sm text-gray-500">
                                            {product.count_in_stock} available
                                        </span>
                                    </div>
                                    {quantity === product.count_in_stock && (
                                        <p className="text-yellow-600 text-sm mt-1">Maximum quantity reached</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => addToCart(product.id, quantity)}
                                    disabled={isAddingToCart}
                                    className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 flex items-center justify-center ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {isAddingToCart ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding to Cart...
                                        </span>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2" size={20} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <ProductReviews productId={id} />
                </div>
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-4xl">
                        <img 
                            src={mainImage} 
                            alt={product.name}
                            className="w-full h-auto max-h-[90vh] object-contain"
                        />
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition duration-150"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;