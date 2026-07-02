import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../services/api';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ChefHat, Home } from 'lucide-react';

const Login = ({ onLoginSuccess, onGoHome }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegistering) {
        await registerUser(username, email, password);
        toast.success("Registration successful! Please login.");
        setIsRegistering(false);
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        const data = await loginUser(username, email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('userEmail', email); // Store email for notifications
        toast.success("Login successful! Welcome back.");
        onLoginSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Home Button */}
      <button
        onClick={onGoHome}
        className="absolute top-8 left-8 z-10 flex items-center gap-2 text-teal-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
      >
        <Home size={18} />
        <span className="text-sm font-medium">Home</span>
      </button>
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ChefHat className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Pantry Pal</h1>
            <p className="text-teal-100 text-sm font-medium">
              {isRegistering ? "Create your account" : "Welcome back!"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-400/30 p-4 mb-6 rounded-xl backdrop-blur-sm">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-200 font-medium">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-100 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-teal-200"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
              </div>
            </div>

            {/* Email Field - For both Login and Registration */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-teal-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-teal-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-teal-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-300 hover:text-teal-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isRegistering ? "Create Account" : "Sign In"}
                </>
              )}
            </button>
          </form>

          {/* Toggle Section */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 backdrop-blur-sm text-teal-100 font-medium rounded-full">
                  {isRegistering ? "Already have an account?" : "Don't have an account?"}
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg('');
                setUsername('');
                setEmail('');
                setPassword('');
              }}
              className="mt-4 text-teal-300 hover:text-teal-100 font-semibold transition-colors duration-200 hover:underline"
            >
              {isRegistering ? "Sign in instead" : "Create new account"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-sm text-teal-200">
          Secure • Fast • Reliable
        </p>
      </div>
      </div>
    </>
  );
};

export default Login;