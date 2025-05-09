import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const komunitas = localStorage.getItem('komunitas');
        
        if (token && komunitas) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          setUser(JSON.parse(komunitas));
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/komunitas/login', credentials);
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('komunitas', JSON.stringify(response.data.komunitas));
    api.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
    setUser(response.data.komunitas);
    return response.data;
  };

  const register = async (data) => {
    const response = await api.post('/auth/komunitas/register', data);
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('komunitas', JSON.stringify(response.data.komunitas));
    api.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
    setUser(response.data.komunitas);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('komunitas');
      delete api.defaults.headers.Authorization;
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Pastikan Anda mengekspor useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};