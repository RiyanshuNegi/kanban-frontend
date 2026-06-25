import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute'; // Import this
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Locked down route */}
            <Route 
              path="/board" 
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}