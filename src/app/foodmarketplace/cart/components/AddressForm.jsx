import React, { useState, useEffect } from "react";

export default function AddressForm({ onAddressSubmit, onCancel, baseUrl, userAddress, isEdit }) {
  const [formData, setFormData] = useState({
    customerAddressId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    road: "",
    landmark: "",
    mobile: "",
    defaultAddress: true,
    label: "Home",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Prefill form with userAddress in edit mode
  useEffect(() => {
    if (isEdit && userAddress) {
      console.log("Prefilling form with userAddress:", userAddress); // Debug
      setFormData({
        customerAddressId: userAddress.id || userAddress.customerAddressId || "",
        name: userAddress.name || "",
        addressLine1: userAddress.addressLine1 || "",
        addressLine2: userAddress.addressLine2 || "",
        road: userAddress.road || "",
        landmark: userAddress.landmark || "",
        mobile: userAddress.mobile || "",
        defaultAddress: userAddress.defaultAddress || false,
        label: userAddress.label || "Home",
        latitude: userAddress.latitude || "",
        longitude: userAddress.longitude || "",
      });
    }
  }, [isEdit, userAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, defaultAddress: e.target.checked }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setLoadingLocation(false);
        setError(null);
      },
      (err) => {
        setError("Unable to fetch location. Please enter coordinates manually.");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.addressLine1 || (!isEdit && (!formData.latitude || !formData.longitude))) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isEdit && !formData.customerAddressId) {
      setError("Invalid address ID. Please try again.");
      console.error("Missing customerAddressId in edit mode:", formData);
      return;
    }

    try {
      let token=""
      const guesToken = localStorage.getItem("token");
      const userToken= localStorage.getItem("userToken")
      if(!userToken){
        token=guesToken
      } else{
        token=userToken
      }
      if (!token) {
        throw new Error("Please log in to save address.");
      }

      const url = isEdit ? `${baseUrl}/user/customerAddress/edit` : `${baseUrl}/user/customerAddress/add`;
      const payload = isEdit
        ? {
            customerAddressId: formData.customerAddressId,
            name: formData.name,
            addressLine1: formData.addressLine1,
            landmark: formData.landmark,
            defaultAddress: formData.defaultAddress,
          }
        : {
            name: formData.name,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            road: formData.road,
            landmark: formData.landmark,
            mobile: formData.mobile,
            defaultAddress: formData.defaultAddress,
            label: formData.label,
            latitude: formData.latitude,
            longitude: formData.longitude,
          };

      console.log("Submitting payload to", url, ":", payload); // Debug

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "add"} address.`);
      }

      const data = await response.json();
      onAddressSubmit(data.data);
      setError(null);
    } catch (err) {
      setError(err.message || `Failed to ${isEdit ? "update" : "add"} address.`);
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {isEdit ? "Edit Delivery Address" : "Add Delivery Address"}
      </h2>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-1.5 mb-2">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label className="text-sm text-gray-600 mb-0.5 block">Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-0.5 block">Address Line 1 *</label>
          <input
            type="text"
            name="addressLine1"
            placeholder="Street name and number"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
            required
          />
        </div>
        {!isEdit && (
          <>
            <div>
              <label className="text-sm text-gray-600 mb-0.5 block">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-0.5 block">Road</label>
              <input
                type="text"
                name="road"
                placeholder="Road name (optional)"
                value={formData.road}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-0.5">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile number (optional)"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-0.5 block">Address Label</label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-600 mb-0.5 block">Latitude *</label>
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
                  step="any"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-0.5 block">Longitude *</label>
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
                  step="any"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loadingLocation}
              className={`w-full p-2 rounded-lg text-white text-sm flex items-center justify-center transition duration-200 ${
                loadingLocation
                  ? "bg-blue-400 opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingLocation ? (
                <span className="inline-flex items-center">
                  <div className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-r-transparent mr-2"></div>
                  Fetching Location...
                </span>
              ) : (
                "Use Current Location"
              )}
            </button>
          </>
        )}
        <div>
          <label className="text-sm text-gray-600 mb-0.5 block">Landmark</label>
          <input
            type="text"
            name="landmark"
            placeholder="Nearby landmark (optional)"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200"
          />
        </div>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.defaultAddress}
            onChange={handleCheckboxChange}
            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-300"
          />
          <span className="text-sm text-gray-600">Set as Default Address</span>
        </label>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 p-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition duration-200"
          >
            {isEdit ? "Update Address" : "Save Address"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 p-2 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}