import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartAPI } from '../services/cartApi';
import { getAllProducts } from '../services/productApi';
import { getAllCategories } from '../services/categoryApi'; 
import ProductCard from '../components/ProductCart';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { categoryId: initialCategoryId, categoryName: initialCategoryName } = location.state || {};
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || '');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (err) {
                console.log('error loading categories ', err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts(selectedCategoryId || null);
                setProducts(data);
            } catch (err) {
                console.log('error loading products ', err);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    useEffect(() => {
        if (products.length > 0) {
            fetchCartItems();
        }
    }, [products]);

    const fetchCartItems = async () => {
        try {
            const data = await CartAPI.getCart();
            const cartItems = data.map(cartItem => {
                const product = products.find(prod => prod.id === cartItem.product);
                return {
                    ...product,
                    cart_id: cartItem.id,
                    quantity: cartItem.quantity,
                };
            });
            setCart(cartItems);
            console.log("cart details:", cartItems);
        } catch (err) {
            console.log('Error loading cart items:', err);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const cartItems = await CartAPI.getCart();
            const productExists = cartItems.some(item => item.product === productId);
            if (productExists) {
                console.log('product already in cart');
            } else {
                await CartAPI.addItem(productId, quantity);
                fetchCartItems();
                console.log('product added to cart');
            }
        } catch (error) {
            console.log('error while adding item to cart', error);
        }
    };

    const handleCategoryChange = (e) => {
        const newCategoryId = e.target.value;
        setSelectedCategoryId(newCategoryId);
        const selectedCategory = categories.find(cat => cat.id.toString() === newCategoryId);
        navigate('/products', { state: { categoryId: newCategoryId, categoryName: selectedCategory ? selectedCategory.name : 'All Products' }, replace: true });
    };

    return (
        <>
            <Navbar />

            <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12 min-h-screen px-5">
                <div className="flex justify-between items-center">
                    <h1 className="mx-5 text-lg font-medium">
                        {initialCategoryName || (selectedCategoryId ? categories.find(cat => cat.id.toString() === selectedCategoryId)?.name : 'All Products')}
                    </h1>
                    
                    <div className="relative inline-block max-w-xs me-4">
                        <select 
                            className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            value={selectedCategoryId}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        
                    </div>
                </div>

                <div className="container mx-auto px-4 my-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <ProductCard products={products} addToCart={addToCart} />
                    </div>
                </div>
            </section>
        </>
    );
}