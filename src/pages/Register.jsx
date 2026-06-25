import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', formData);
      const { token, data } = response.data;
      login(token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12 p-8 border-4 border-gray-900 bg-white shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]">
      <h2 className="text-3xl font-black uppercase border-b-4 border-gray-900 pb-2 mb-6">
        Register User
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-900 text-red-900 font-bold font-mono text-sm">
          ERROR: {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4 font-mono">
        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100"
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100"
            required 
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border-2 border-gray-900 p-2 focus:outline-none focus:bg-gray-100"
            required minLength="6"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold mb-1 uppercase text-sm">Access Level (Role)</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="border-2 border-gray-900 p-2 bg-white focus:outline-none cursor-pointer"
          >
            <option value="user">Standard User</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 bg-gray-900 text-white font-bold uppercase py-3 border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center font-mono text-sm">
        <span className="text-gray-600">ALREADY REGISTERED? </span>
        <Link to="/login" className="font-bold hover:underline">
          LOGIN HERE
        </Link>
      </div>
    </div>
  );
}