import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products'
// fetch all products
export const getCategories = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/products/categories/');
        return response.data
    }catch(err){
        console.log("Error fecthing category ", err)
        throw err
    }
}

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};