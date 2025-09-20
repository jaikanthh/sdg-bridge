import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ngo': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/25';
      case 'startup': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/25';
      case 'government': return 'bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-lg shadow-purple-500/25';
      default: return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg shadow-gray-500/25';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <img 
                  src="/favicon.png" 
                  alt="SDG Bridge Logo" 
                  className="h-8 lg:h-10 w-8 lg:w-10 object-contain group-hover:rotate-12 transition-transform duration-300"
                  onError={(e) => {
                    // Try alternative logo path
                    if (e.target.src.includes('favicon.png')) {
                      e.target.src = '/logo.jpg';
                    } else {
                      // If both fail, show a fallback icon
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                {/* Fallback SVG icon */}
                <svg 
                  className="h-8 lg:h-10 w-8 lg:w-10 text-blue-600 hidden group-hover:rotate-12 transition-transform duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  style={{display: 'none'}}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">SDG Bridge</span>
                <span className="sm:hidden">SDG</span>
              </div>
            </Link>
            
            {currentUser && (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4 ml-6 lg:ml-8">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center space-x-1.5 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md'
                  }`}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/projects"
                  className={`inline-flex items-center space-x-1.5 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive('/projects')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md'
                  }`}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Projects</span>
                </Link>
                <Link
                  to="/post-project"
                  className={`inline-flex items-center space-x-1.5 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive('/post-project')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md'
                  }`}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Post Project</span>
                </Link>
                <Link
                  to="/communications"
                  className={`inline-flex items-center space-x-1.5 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive('/communications')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md'
                  }`}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Requests</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {!currentUser && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md hover:scale-105 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </Link>
                <Link
                  to="/projects"
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60 hover:backdrop-blur-sm hover:text-gray-800 hover:shadow-md hover:scale-105 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden lg:inline">Browse Projects</span>
                  <span className="lg:hidden">Projects</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </Link>
              </div>
            )}
            
            {currentUser && (
              <>
                {userProfile?.role && (
                  <span className={`hidden sm:inline-block px-2.5 py-1 text-xs font-bold rounded-full transform hover:scale-105 transition-all duration-300 ${getRoleColor(userProfile.role)}`}>
                    {userProfile.role === 'ngo' ? 'NGO' : 
                     userProfile.role === 'startup' ? 'STARTUP' : 
                     userProfile.role === 'government' ? 'GOVERNMENT' : 
                     userProfile.role === 'fundraisers' ? 'FUNDRAISERS' :
                     userProfile.role.toUpperCase()}
                  </span>
                )}
                
                <div className="hidden md:flex items-center space-x-2 bg-white/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30 shadow-lg">
                  {currentUser?.photoURL && (
                    <img
                      className="h-7 w-7 rounded-full ring-2 ring-white/50 hover:ring-white transition-all duration-300"
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {currentUser?.displayName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-red-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden lg:inline font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
            
            {/* Mobile menu button */}
            {currentUser && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {currentUser && isMobileMenuOpen && (
        <div className="md:hidden bg-white/50 backdrop-blur-lg border-t border-white/20 animate-in slide-in-from-top duration-300">
          <div className="pt-3 pb-4 space-y-1 px-4 sm:px-6">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                isActive('/projects')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Projects</span>
            </Link>
            <Link
              to="/post-project"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                isActive('/post-project')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Post Project</span>
            </Link>
            <Link
              to="/communications"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                isActive('/communications')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Requests</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;