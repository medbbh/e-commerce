import React, { useState, useEffect } from 'react';
import { fetchAddress, createAddress, updateAddress } from '../services/adressApi';

export default function AddressInfo() {
  
  const [addressInfo, setAddressInfo] = useState({
    phone: '',
    wtsp: '',
    city: '',
    street: '',
    current_location: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

  useEffect(() => {
    fetchAddressInfo();
  }, []);

  const fetchAddressInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAddress();  // Fetches address array from API
      if (response.data && response.data.length > 0) {
        // Assuming you want to handle the first address in the array
        const firstAddress = response.data[0]; 
        setAddressInfo(firstAddress);  // Populate the form with the first address
        setIsNewAddress(false);
      } else {
        // If no address exists, set form to empty for a new address
        setAddressInfo({
          phone: '',
          wtsp: '',
          city: '',
          street: '',
          current_location: ''
        });
        setIsNewAddress(true);
      }
      setError(null);
    } catch (error) {
      setError('Failed to fetch address information. Please try again.');
      console.error('Error fetching address info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (isNewAddress) {
        response = await createAddress(addressInfo);  // Create a new address
      } else {
        response = await updateAddress(addressInfo,addressInfo.id);  // Update the existing address
      }
      setAddressInfo(response.data);  // Update the state with the returned data
      setIsNewAddress(false);
      setError(null);
    } catch (error) {
      setError('Failed to save address information. Please try again.');
      console.error('Error saving address info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddressInfo(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        {isNewAddress ? 'Add New Address Information' : 'Update Address Information'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input 
            name="phone"
            value={addressInfo.phone || ''}
            onChange={handleChange}
            placeholder="Phone" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="phone" 
            type="tel" 
          />
        </div>
        
        {/* WhatsApp */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wtsp">
            WhatsApp
          </label>
          <input 
            name="wtsp"
            value={addressInfo.wtsp || ''}
            onChange={handleChange}
            placeholder="WhatsApp" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="wtsp" 
            type="tel"
          />
        </div>
        
        {/* City and Street */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <input 
              name="city"
              value={addressInfo.city || ''}
              onChange={handleChange}
              placeholder="City" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="city"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
              Street
            </label>
            <input 
              name="street"
              value={addressInfo.street || ''}
              onChange={handleChange}
              placeholder="Street" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="street"
            />
          </div>
        </div>

        {/* Current Location */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_location">
            Current Location
          </label>
          <input 
            name="current_location"
            value={addressInfo.current_location || ''}
            onChange={handleChange}
            placeholder="Current Location" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="current_location"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isNewAddress ? 'Add Address' : 'Update Address')}
          </button>
        </div>
      </form>
    </div>
  );
}
