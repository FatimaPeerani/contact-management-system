import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacts" element={
              <PrivateRoute><Contacts /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
};

export default App;