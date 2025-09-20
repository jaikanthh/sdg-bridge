import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function RoleSelection() {
  const { updateUserRole, currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'ngo',
      title: 'NGO',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Non-profit organization working on sustainable development',
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'startup',
      title: 'Startup',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Innovation-driven company creating sustainable solutions',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'fundraisers',
      title: 'Fundraisers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Organizations and individuals focused on raising funds for sustainable development',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'government',
      title: 'Government',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Government agency or public sector organization',
      color: 'from-red-400 to-orange-500'
    }
  ];

  const handleRoleSubmit = async () => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      await updateUserRole(selectedRole);
      navigate('/');
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl w-full space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-xl animate-bounce">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Welcome to SDG Bridge
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 font-medium px-2">
            Hi <span className="text-blue-600 font-semibold">{currentUser?.displayName}</span>! Please select your organization type to get started.
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center flex items-center justify-center">
            <span className="mr-2 sm:mr-3">🎯</span>
            What type of organization do you represent?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {roles.map((role, index) => (
              <div
                key={role.id}
                className={`group p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  selectedRole === role.id
                    ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm shadow-xl scale-105'
                    : 'border-white/40 bg-white/30 backdrop-blur-sm hover:bg-white/40 hover:border-white/60'
                }`}
                onClick={() => setSelectedRole(role.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className={`text-3xl sm:text-4xl p-2 sm:p-3 rounded-full transition-all duration-300 ${
                    selectedRole === role.id 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transform scale-110' 
                      : 'bg-white/40 group-hover:bg-white/60 group-hover:scale-110'
                  }`}>
                    <div className="text-white">
                      {role.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                      selectedRole === role.id 
                        ? 'text-blue-700' 
                        : 'text-gray-800 group-hover:text-blue-600'
                    }`}>
                      {role.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mt-1 transition-colors duration-300 ${
                      selectedRole === role.id 
                        ? 'text-blue-600' 
                        : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {role.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-3 transition-all duration-300 flex items-center justify-center ${
                      selectedRole === role.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-500 shadow-lg'
                        : 'border-gray-400 group-hover:border-blue-400 group-hover:scale-110'
                    }`}>
                      {selectedRole === role.id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleRoleSubmit}
            disabled={!selectedRole || loading}
            className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform flex items-center justify-center space-x-2 sm:space-x-3 ${
              selectedRole && !loading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl'
                : 'bg-gray-300/50 text-gray-500 cursor-not-allowed backdrop-blur-sm'
            } disabled:opacity-50 disabled:transform-none`}
          >
            <span className="flex items-center space-x-2">
              {loading ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : selectedRole ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              <span className="text-sm sm:text-base">
                {loading ? 'Setting up your profile...' : 
                 selectedRole ? 'Continue to Dashboard' : 'Select a role first'}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;