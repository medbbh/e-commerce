import React, { useState, useEffect } from "react";
import { fetchAddress, createAddress, updateAddress } from "../services/adressApi"; // ✅ Ensure correct API import
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AddressInfo({ setDeliveryInfo }) {
  const [addressInfo, setAddressInfo] = useState({
    phone: "",
    wtsp: "",
    city: "",
    street: "",
    current_location: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [gpsLocation, setGpsLocation] = useState(null);

  useEffect(() => {
    fetchAddressInfo();
  }, []);

  const fetchAddressInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAddress();  // ✅ Fetch stored address from backend
      if (response.data.length > 0) {
        const firstAddress = response.data[0];
        setAddressInfo(firstAddress);
        setIsNewAddress(false);
        setDeliveryInfo(formatAddress(firstAddress)); // ✅ Pass address to Stepper
      } else {
        setAddressInfo({
          phone: "",
          wtsp: "",
          city: "",
          street: "",
          current_location: "",
        });
        setIsNewAddress(true);
      }
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching address info:", error);
      setError("❌ Failed to fetch address information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Format address into a readable string
  const formatAddress = (addr) => {
    return [
      addr.street || "",
      addr.city || "",
      addr.current_location || "",
      `Phone: ${addr.phone || ""}`,
      `WhatsApp: ${addr.wtsp || ""}`,
    ]
      .filter(Boolean)
      .join(" | ");
  };

  // ✅ Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);

        setGpsLocation({ latitude, longitude, address });

        setAddressInfo((prev) => ({
          ...prev,
          current_location: address,
        }));
      },
      (error) => {
        console.error("❌ Error getting location:", error);
        alert("❌ Failed to get location. Please enable location services.");
      }
    );
  };

  // ✅ Reverse Geocoding (Lat/Lng → Address)
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name || `Lat: ${latitude}, Lng: ${longitude}`;
    } catch (error) {
      console.error("❌ Error getting address:", error);
      return `Lat: ${latitude}, Lng: ${longitude}`;
    }
  };

  // ✅ Save or Update Address
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (isNewAddress) {
        response = await createAddress(addressInfo);
      } else {
        response = await updateAddress(addressInfo, addressInfo.id);
      }

      setAddressInfo(response.data);
      setIsNewAddress(false);
      setError(null);

      setDeliveryInfo(formatAddress(response.data)); // ✅ Pass updated address to Stepper
      console.log("✅ Address saved successfully:", response.data);
    } catch (error) {
      console.error("❌ Error saving address info:", error);
      setError("❌ Failed to save address information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        {isNewAddress ? "Add New Address Information" : "Update Address Information"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <input
            name="phone"
            value={addressInfo.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            type="tel"
          />
        </div>

        {/* Use Current Location */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useCurrentLocation"
            checked={useCurrentLocation}
            onChange={(e) => {
              setUseCurrentLocation(e.target.checked);
              if (e.target.checked) {
                getCurrentLocation();
              } else {
                setGpsLocation(null);
                setAddressInfo((prev) => ({ ...prev, current_location: "" }));
              }
            }}
            className="h-5 w-5 text-blue-600"
          />
          <label htmlFor="useCurrentLocation" className="text-sm font-medium text-gray-700">
            Use Current Location
          </label>
        </div>

        {/* City and Street Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
            <input
              name="city"
              value={addressInfo.city || ""}
              onChange={handleChange}
              placeholder="City"
              disabled={useCurrentLocation}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Street</label>
            <input
              name="street"
              value={addressInfo.street || ""}
              onChange={handleChange}
              placeholder="Street"
              disabled={useCurrentLocation}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
        </div>

        {/* GPS Map */}
        {useCurrentLocation && gpsLocation && (
          <MapContainer center={[gpsLocation.latitude, gpsLocation.longitude]} zoom={13} className="h-64 w-full rounded-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[gpsLocation.latitude, gpsLocation.longitude]}>
              <Popup>{gpsLocation.address}</Popup>
            </Marker>
          </MapContainer>
        )}

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
          {isNewAddress ? "Add Address" : "Update Address"}
        </button>
      </form>
    </div>
  );
}
