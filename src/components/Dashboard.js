import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCollaborations: 0,
    sdgsCovered: 0,
    myProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
      
      @keyframes scale-in {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out;
      }
      
      .animate-fade-in {
        animation: fade-in 1s ease-out;
      }
      
      .animate-scale-in {
        animation: scale-in 0.6s ease-out;
      }
      
      .animation-delay-200 {
        animation-delay: 0.2s;
        animation-fill-mode: both;
      }
      
      .animation-delay-400 {
        animation-delay: 0.4s;
        animation-fill-mode: both;
      }
      
      .animation-delay-600 {
        animation-delay: 0.6s;
        animation-fill-mode: both;
      }
      
      .animation-delay-800 {
        animation-delay: 0.8s;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sdgList = [
    'No Poverty', 'Zero Hunger', 'Good Health and Well-being', 'Quality Education',
    'Gender Equality', 'Clean Water and Sanitation', 'Affordable and Clean Energy',
    'Decent Work and Economic Growth', 'Industry, Innovation and Infrastructure',
    'Reduced Inequality', 'Sustainable Cities and Communities', 'Responsible Consumption and Production',
    'Climate Action', 'Life Below Water', 'Life on Land', 'Peace and Justice Strong Institutions',
    'Partnerships to achieve the Goal'
  ];

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch my projects
      const myProjectsQuery = query(
        collection(db, 'projects'),
        where('createdBy', '==', currentUser.uid)
      );
      const myProjectsSnapshot = await getDocs(myProjectsQuery);
      
      // Calculate total collaborations
      let totalCollaborations = 0;
      projects.forEach(project => {
        if (project.collaborationRequests) {
          totalCollaborations += project.collaborationRequests.length;
        }
      });
      
      // Calculate unique SDGs covered
      const uniqueSDGs = new Set(projects.map(project => project.sdg).filter(sdg => sdg));
      
      setStats({
        totalProjects: projects.length,
        totalCollaborations,
        sdgsCovered: uniqueSDGs.size,
        myProjects: myProjectsSnapshot.docs.length
      });
      
      // Get recent projects (last 5)
      const sortedProjects = projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentProjects(sortedProjects);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSDGColor = (sdgNumber) => {
    const colors = [
      'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
      'bg-orange-500', 'bg-blue-400', 'bg-yellow-400', 'bg-red-700',
      'bg-orange-600', 'bg-pink-500', 'bg-yellow-600', 'bg-orange-700',
      'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600', 'bg-blue-700'
    ];
    return colors[sdgNumber - 1] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-12 bg-white/30 backdrop-blur-sm rounded-2xl w-1/3 mb-8 border border-white/20"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20"></div>
              <div className="h-64 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-4 sm:-bottom-8 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back, {userProfile?.displayName || currentUser?.displayName || 'User'}! 👋
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Ready to make an impact? Here's your dashboard overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0">
          <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Projects</p>
              </div>
            </div>
            {/* Progress bar for Total Projects */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalProjects / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalCollaborations}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Collaborations</p>
              </div>
            </div>
            {/* Progress bar for Collaborations */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.totalCollaborations / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.sdgsCovered}/17</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">SDGs Covered</p>
              </div>
            </div>
            {/* Progress bar for SDGs Covered */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(stats.sdgsCovered / 17) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.myProjects}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">My Projects</p>
              </div>
            </div>
            {/* Progress bar for My Projects */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((stats.myProjects / Math.max(stats.totalProjects, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
          <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-200 hover:bg-white transition-all duration-500 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/post-project"
                className="group block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Post New Project</span>
                </div>
              </Link>
              <Link
                to="/projects"
                className="group block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-center border border-gray-200 hover:border-gray-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Browse All Projects</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-200 hover:bg-white transition-all duration-500 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Recent Projects</h2>
              <Link 
                to="/projects" 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-xs sm:text-sm"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={project.id} className={`group flex items-center space-x-4 p-4 bg-gray-50 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-scale-in`} style={{animationDelay: `${index * 100}ms`}}>
                    <div className={`w-4 h-4 rounded-full ${getSDGColor(project.sdg)} shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        SDG {project.sdg}: {sdgList[project.sdg - 1]}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">No projects yet. Be the first to post one!</p>
              </div>
            )}
          </div>
        </div>
    </div>
    </div>
  );
}

export default Dashboard;