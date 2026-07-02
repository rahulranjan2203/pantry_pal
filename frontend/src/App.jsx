import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import PageLayout from './components/PageLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleGoHome = () => {
    setShowLogin(false);
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <PageLayout type="auth">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-100">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      {isAuthenticated ? (
        <PageLayout type="dashboard">
          <Dashboard onLogout={handleLogout} onGoHome={handleGoHome} />
        </PageLayout>
      ) : showLogin ? (
        <PageLayout type="auth">
          <Login onLoginSuccess={handleLogin} onGoHome={handleGoHome} />
        </PageLayout>
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
    </>
  );
}

export default App;