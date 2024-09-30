import axios from 'axios';

const customaxios = axios.create({
    baseUrl : 'http://localhost:8000/api',
    headers: {
        'Content-Type' : 'application/json',
    },
})

// fetch all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/products/');
        return response.data
    }catch(err){
        console.log("Error fecthing products ", err)
        throw err
    }
}