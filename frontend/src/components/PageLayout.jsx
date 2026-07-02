import React from 'react';

const PageLayout = ({ children, type = 'dashboard' }) => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop)'
        }}
      />
      <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-sm" />
      
      {/* Content Container */}
      <div className="relative z-10">
        {type === 'auth' ? (
          // Centered layout for Login/Register
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        ) : (
          // Dashboard layout
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLayout;