import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const { currentUser } = useAuth();

  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out;
      }
      
      .animate-fade-in {
        animation: fade-in 1s ease-out;
      }
      
      .animation-delay-300 {
        animation-delay: 0.3s;
        animation-fill-mode: both;
      }
      
      .animation-delay-500 {
        animation-delay: 0.5s;
        animation-fill-mode: both;
      }
      
      .animation-delay-700 {
        animation-delay: 0.7s;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-ping animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-pulse animation-delay-3000"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-bounce animation-delay-5000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-ping animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in-up">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full mb-6 shadow-2xl animate-float p-4 border border-white/20">
              <img 
                src="/favicon.png" 
                alt="SDG Bridge Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up animation-delay-300 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SDG Bridge
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-gray-600 mb-8 animate-fade-in-up animation-delay-500 tracking-wide">
            Connecting for Sustainable Impact
          </p>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
            Connect NGOs, startups, and government agencies working on UN Sustainable Development Goals. 
            Collaborate, share resources, and create meaningful change together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-700">
            <Link
              to="/projects"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Explore Projects
                <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            {!currentUser && (
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative flex items-center">
                  Join the Community
                  <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-32 bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SDG Bridge</span> Works
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Connecting organizations for sustainable development through innovation and collaboration</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200 hover:bg-white/80 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">Discover Projects</h3>
              <p className="text-gray-600 leading-relaxed">Browse projects aligned with UN Sustainable Development Goals from organizations worldwide and find your perfect collaboration match.</p>
            </div>
            
            <div className="group text-center p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200 hover:bg-white/80 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">Collaborate</h3>
              <p className="text-gray-600 leading-relaxed">Connect with like-minded organizations and request collaboration on impactful projects that drive meaningful change.</p>
            </div>
            
            <div className="group text-center p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-200 hover:bg-white/80 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">Create Impact</h3>
              <p className="text-gray-600 leading-relaxed">Work together to achieve the UN Sustainable Development Goals and create lasting positive change for communities worldwide.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SDG Section */}
      <div className="relative py-32 bg-gradient-to-b from-gray-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              UN <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Sustainable Development</span> Goals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Projects aligned with the 17 SDGs for a better world and sustainable future</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { num: 1, title: "No Poverty", color: "from-red-500 to-red-600" },
              { num: 2, title: "Zero Hunger", color: "from-yellow-500 to-yellow-600" },
              { num: 3, title: "Good Health", color: "from-green-500 to-green-600" },
              { num: 4, title: "Quality Education", color: "from-red-600 to-red-700" },
              { num: 5, title: "Gender Equality", color: "from-orange-500 to-orange-600" },
              { num: 6, title: "Clean Water", color: "from-blue-400 to-blue-500" },
              { num: 7, title: "Clean Energy", color: "from-yellow-400 to-yellow-500" },
              { num: 8, title: "Economic Growth", color: "from-red-400 to-red-500" },
              { num: 9, title: "Innovation", color: "from-orange-600 to-orange-700" },
              { num: 10, title: "Reduced Inequality", color: "from-pink-500 to-pink-600" },
              { num: 11, title: "Sustainable Cities", color: "from-yellow-600 to-yellow-700" },
              { num: 12, title: "Responsible Consumption", color: "from-yellow-700 to-yellow-800" },
              { num: 13, title: "Climate Action", color: "from-green-600 to-green-700" },
              { num: 14, title: "Life Below Water", color: "from-blue-500 to-blue-600" },
              { num: 15, title: "Life on Land", color: "from-green-700 to-green-800" },
              { num: 16, title: "Peace & Justice", color: "from-blue-600 to-blue-700" },
              { num: 17, title: "Partnerships", color: "from-blue-700 to-blue-800" }
            ].map((sdg, index) => (
              <div 
                key={sdg.num} 
                className={`group bg-gradient-to-br ${sdg.color} text-white p-6 rounded-2xl text-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">{sdg.num}</div>
                <div className="text-sm font-medium leading-tight">{sdg.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Make an <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Impact</span>?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of organizations working towards sustainable development and create meaningful change together
            </p>
            {!currentUser && (
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-purple-900 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Get Started Today
                  <svg className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SDG Bridge
              </h3>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connecting organizations for sustainable impact and meaningful change
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link 
                to="/projects" 
                className="group text-blue-200 hover:text-white transition-all duration-300 text-lg font-medium flex items-center"
              >
                <span>Explore Projects</span>
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {!currentUser && (
                <Link 
                  to="/login" 
                  className="group text-blue-200 hover:text-white transition-all duration-300 text-lg font-medium flex items-center"
                >
                  <span>Join Us</span>
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-blue-200 text-sm">
                © 2024 SDG Bridge. Building a sustainable future together.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;