import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';
import { fetchCurrentUser } from './store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import FileManager from './components/FileManager';
import AdminPanel from './components/AdminPanel';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { user, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCurrentUser());
    }
    if (status === 'failed' && !user) {
      navigate('/login', { state: { from: location } });
    }
  }, [status, user, navigate, location, dispatch]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_administrator) {
    return <Navigate to="/files" replace />;
  }

  return children;
};

function AppContent() {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary transition-colors">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <FileManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f3f4f6' : '#1f2937',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
<AppContent />
      </ThemeProvider>
      
    </Provider>
  );
}