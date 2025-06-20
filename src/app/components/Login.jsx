'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'; 
import { fetchCartItems } from '../../cartSlice'; 

const LoginComponent = ({
  redirectPath,
  deviceId,
  deviceToken,
  showCredentialsLogin = false,
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('guest');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const router = useRouter();
  const dispatch = useDispatch(); 

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const DOMAIN_ID = 'dcff79f1-5032-439a-8f3b-4d40da2ec7a5';

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/guest-login`, {
        domainId: DOMAIN_ID,
        deviceId,
        deviceToken,
      });

      alert('Guest login successful!');
      console.log('Guest login token:', response.data.data.token);
      const token = response.data.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('domainId', DOMAIN_ID);
        localStorage.setItem('deviceId', deviceId);
        localStorage.setItem('deviceToken', deviceToken);
      }
      console.log('Token set into local storage successfully');

      // Merge guest cart with server cart
      try {
        await dispatch(fetchCartItems()).unwrap();
        console.log('Cart merged successfully after guest login');
      } catch (cartError) {
        console.error('Failed to merge cart after guest login:', cartError);
        // Optionally show a non-blocking notification
        // setError('Cart merge failed, but login was successful.');
      }

      router.push(redirectPath);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Guest login failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Form data:', formData);
    const { identifier, password } = formData;

    try {
      const response = await axios.post(`${BASE_URL}/user/auth/customer-login`, {
        domainId: DOMAIN_ID,
        identifier,
        password,
      });

      alert('Login successful!');
      console.log('Credentials login token:', response.data.data.token);
      const token = response.data.data.token;
      const customerId=response.data.data.customer.id
      if (typeof window !== 'undefined') {
        localStorage.setItem('usertoken', token); // Changed from 'usertoken' to 'token'
        localStorage.setItem('domainId', DOMAIN_ID);
        localStorage.setItem('customerId', customerId);

      }
      console.log('Credentials login successful, token set into local storage');

      // Merge guest cart with server cart
      try {
        await dispatch(fetchCartItems()).unwrap();
        console.log('Cart merged successfully after credentials login');
      } catch (cartError) {
        console.error('Failed to merge cart after credentials login:', cartError);
        // Optionally show a non-blocking notification
        // setError('Cart merge failed, but login was successful.');
      }

      router.push(redirectPath);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Invalid credentials. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {loginMode === 'guest' ? 'Guest Login' : 'Login with Credentials'}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        {loginMode === 'guest' ? (
          <>
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Guest Login'}
            </button>
            {showCredentialsLogin && (
              <button
                onClick={() => setLoginMode('credentials')}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Login with Credentials
              </button>
            )}
          </>
        ) : (
          <>
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Identifier (Email/Phone/Employee Code)
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Email, Phone, or Employee Code"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setLoginMode('guest')}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Continue as Guest
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;