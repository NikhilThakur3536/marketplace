'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAINID = process.env.NEXT_PUBLIC_DOMAIN_ID;
  const DEVICEID = process.env.NEXT_PUBLIC_DEVICE_ID;
  const DEVICETOKEN = process.env.NEXT_PUBLIC_DEVICE_TOKEN
  console.log(DOMAINID)

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/guest-login`, {
        domainId: DOMAINID,
        deviceId: DEVICEID,
        deviceToken:DEVICETOKEN
      });

      alert('Guest login successful!');
      console.log(response.data.data.token)
      const token=response.data.data.token
      localStorage.setItem('token',token)
      localStorage.setItem('domainId',DOMAINID)
      localStorage.setItem('deviceId',DEVICEID)
      localStorage.setItem('deviceToken',DEVICETOKEN)
      console.log("token set into the local storage successfully")
      router.push('/foodmarketplace');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Guest login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Guest Login</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Guest Login'}
        </button>
      </div>
    </div>
  );
}