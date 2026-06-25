import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send request to your backend
      const response = await api.post('/auth/login', { email, password });
      
      // Extract token and user data from the response structure you built
      const { token, data } = response.data;
      
      // Pass to global context (which also redirects to /board)
      login(token, data.user);
    } catch (err) {
      // Safely grab the error message from the backend ApiError utility
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12 p-8 border-4 border-gray-900 bg-white shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]">
      <h2 className="text-3xl font-black uppercase border-b-4 border-gray-900 pb-2 mb-6">
        System Login
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-900 text-red-900 font-bold font-mono text-sm">
          ERROR: {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4 font-mono">
        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100"
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 bg-gray-900 text-white font-bold uppercase py-3 border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center font-mono text-sm">
        <span className="text-gray-600">NO ACCOUNT? </span>
        <Link to="/register" className="font-bold hover:underline">
          REGISTER NEW USER
        </Link>
      </div>
    </div>
  );
}