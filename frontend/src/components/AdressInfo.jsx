import React, { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker assets using ES module syntax:
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon using the imported assets:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function AddressInfo({ deliveryInfo, setDeliveryInfo, onError }) {
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    street: "",
    wtsp: "",
    current_location: "",
  });
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.city || !formData.street) {
      onError("Please fill in all required fields");
      return;
    }

    const updatedInfo = { 
      ...formData, 
      current_location: location 
        ? `${location.lat}, ${location.lng}` 
        : formData.current_location 
    };
    
    setDeliveryInfo(updatedInfo);
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setShowMap(true);
        },
        (error) => {
          onError("Unable to retrieve location: " + error.message);
        }
      );
    } else {
      onError("Geolocation is not supported by this browser");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1f2937] flex items-center">
        <MapPin className="mr-3 text-[#1f2937]" /> Delivery Information
      </h2>

      {showMap && (
        <div className="h-96 w-full border-2 border-gray-200 rounded-lg overflow-hidden">
          <MapContainer 
            center={location || [0, 0]} 
            zoom={13} 
            style={{height: '100%', width: '100%'}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker 
              onLocationSelect={(loc) => {
                setFormData(prev => ({
                  ...prev,
                  current_location: `${loc.lat}, ${loc.lng}`
                }));
              }} 
            />
          </MapContainer>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f2937]"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f2937]"
          required
        />
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street Address"
          className="col-span-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f2937]"
          required
        />
        <div className="col-span-2 flex items-center space-x-4">
          <button 
            type="button"
            onClick={handleGetCurrentLocation}
            className="flex-grow bg-[#1f2937] text-white p-3 rounded-lg hover:bg-[#374151] transition flex items-center justify-center"
          >
            <Navigation className="mr-2" /> Get Current Location
          </button>
        </div>
        <button 
          type="submit" 
          className="col-span-2 bg-[#1f2937] text-white p-3 rounded-lg hover:bg-[#374151] transition"
        >
          Save Delivery Information
        </button>
      </form>
    </div>
  );
}