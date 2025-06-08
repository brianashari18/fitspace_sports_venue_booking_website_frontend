import {useEffect, useRef, useState} from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import L from 'leaflet';

const AddVenueForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        street: "",
        province: "Jawa Barat",
        city_or_regency: "",
        district: "",
        postal_code: "",
        latitude: null,
        longitude: null,
    });

    const MapComponent = ({ latitude, longitude, setFormData }) => {
        const mapRef = useRef(null);
        const [markerPosition, setMarkerPosition] = useState({ lat: latitude, lng: longitude });

        useEffect(() => {
            if (mapRef.current && !mapRef.current._leaflet_id) {
                const map = L.map(mapRef.current).setView([latitude, longitude], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                const marker = L.marker([latitude, longitude]).addTo(map).bindPopup('Venue Location');

                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;

                    setMarkerPosition({ lat, lng });

                    marker.setLatLng([lat, lng]);
                    marker.setPopupContent(`New Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();

                    setFormData((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                    }));
                });

                return () => {
                    if (map) {
                        map.remove();
                    }
                };
            }
        }, [latitude, longitude]); // Only run the effect on initial load or when latitude/longitude props change

        return <div ref={mapRef} className="w-full h-full" />;
    };


    const [errors, setErrors] = useState({}); // State for validation errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on input change
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation logic
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.province.trim()) newErrors.province = "Province is required";
        if (!formData.city_or_regency.trim()) newErrors.city_or_regency = "City or Regency is required";
        if (!formData.district.trim()) newErrors.district = "District is required";
        if (!formData.postal_code.trim()) newErrors.postal_code = "Postal code is required";
        if (formData.latitude === null || formData.longitude === null)
            newErrors.location = "Location must be selected on the map";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); // Set errors if validation fails
            return;
        }

        onSubmit(formData); // Submit data if validation passes
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
                <div className="flex items-center">
                    <button
                        onClick={onCancel}
                        className="text-xl text-gray-600 hover:text-gray-800"
                    >
                        <IoArrowBackOutline />
                    </button>
                    <h2 className="text-2xl font-bold ml-4">Add Venue</h2>
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto p-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                >
                    Done
                </button>
            </div>

            {/* Detail Venue */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Name venue
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter venue name"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Street Name
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Enter street name"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Province
                        </label>
                        <input
                            type="text"
                            name="province"
                            value="Jawa Barat"
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        {errors.province && (
                            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            City or Regency
                        </label>
                        <select
                            name="city_or_regency"
                            value={formData.city_or_regency}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="">Select City or Regency</option>
                            <option value="Bandung">Bandung</option>
                            <option value="Kabupaten Bandung">Kabupaten Bandung</option>
                            <option value="Kabupaten Bandung Barat">Kabupaten Bandung Barat</option>
                        </select>
                        {errors.city_or_regency && (
                            <p className="text-red-500 text-sm mt-1">{errors.city_or_regency}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            District
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Enter district"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {errors.district && (
                            <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            placeholder="Enter postal code"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {errors.postal_code && (
                            <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Location on Map</h3>
                <div className="h-64 w-full bg-gray-300 rounded-lg">
                    <MapComponent latitude={formData.latitude || -6.200000} longitude={formData.longitude || 106.816666} setFormData={setFormData}/>
                </div>
                {errors.location && (
                    <p className="text-red-500 text-sm mt-2">{errors.location}</p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                    Latitude: {formData.latitude?.toFixed(4) || "N/A"}, Longitude:
                    {formData.longitude?.toFixed(4) || "N/A"}
                </p>
            </div>
        </div>
    );
};

export default AddVenueForm;

