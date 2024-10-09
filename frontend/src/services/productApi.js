import axios from 'axios';

const customaxios = axios.create({
    baseUrl : 'http://localhost:8000/api',
    headers: {
        'Content-Type' : 'application/json',
    },
})

const API_URL = 'http://localhost:8000/api'


export const getAllProducts = async (categoryId = null) => {
    try {
        const url = categoryId 
            ? `${API_URL}/products/?category_id=${categoryId}`
            : `${API_URL}/products/`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};