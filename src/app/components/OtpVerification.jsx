'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const VerifyOtp = ({ urlpath }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://marketplaceapp.infoware.xyz';

  useEffect(() => {
    // Safely access localStorage only in the browser
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('email') || '' : '';
    const storedOtp = typeof window !== 'undefined' ? localStorage.getItem('otp') || '' : '';
    setFormData((prev) => ({
      ...prev,
      email: storedEmail,
      otp: storedOtp,
    }));
  }, []); // Empty dependency array since both email and otp are from localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/verifyOtp`, {
        email: formData.email,
        otp: formData.otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess(true);
      alert('OTP verified successfully!');
      console.log('Verification response:', response.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('otpVerified', 'true');
        localStorage.removeItem('otp');
      }
      router.push(urlpath);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'OTP verification failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">OTP verified successfully!</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              placeholder="Email"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;