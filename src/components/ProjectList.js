import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';

function ProjectList() {
  const { userProfile } = useAuth();

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
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      .animate-fade-in { animation: fade-in 0.8s ease-out; }
      .animate-scale-in { animation: scale-in 0.5s ease-out; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animation-delay-200 { animation-delay: 0.2s; }
      .animation-delay-400 { animation-delay: 0.4s; }
      .animation-delay-600 { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSDG, setSelectedSDG] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [requestingCollaboration, setRequestingCollaboration] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState({});

  const sdgList = [
    'No Poverty', 'Zero Hunger', 'Good Health and Well-being', 'Quality Education',
    'Gender Equality', 'Clean Water and Sanitation', 'Affordable and Clean Energy',
    'Decent Work and Economic Growth', 'Industry, Innovation and Infrastructure',
    'Reduced Inequality', 'Sustainable Cities and Communities', 'Responsible Consumption and Production',
    'Climate Action', 'Life Below Water', 'Life on Land', 'Peace and Justice Strong Institutions',
    'Partnerships to achieve the Goal'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedSDG, selectedLocation]);

  const fetchProjects = async () => {
    try {
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date (newest first)
      const sortedProjects = projectsData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // SDG filter
    if (selectedSDG) {
      filtered = filtered.filter(project => project.sdg === parseInt(selectedSDG));
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(project =>
        project.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleCollaborationRequest = async (projectId) => {
    try {
      setRequestingCollaboration(prev => ({ ...prev, [projectId]: true }));
      
      const collaborationRequest = {
        userId: userProfile.uid,
        userName: userProfile.displayName,
        userRole: userProfile.role,
        userEmail: userProfile.email,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };

      await updateDoc(doc(db, 'projects', projectId), {
        collaborationRequests: arrayUnion(collaborationRequest)
      });

      // Update local state
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            collaborationRequests: [...(project.collaborationRequests || []), collaborationRequest]
          };
        }
        return project;
      }));

      alert('Collaboration request sent successfully!');
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      alert('Error sending collaboration request. Please try again.');
    } finally {
      setRequestingCollaboration(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const hasRequestedCollaboration = (project) => {
    return project.collaborationRequests?.some(request => request.userId === userProfile.uid);
  };

  const isOwnProject = (project) => {
    return project.createdBy === userProfile?.uid;
  };

  const handleEditProject = (project) => {
    setEditingProject(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      location: project.location,
      sdg: project.sdg,
      helpNeeded: project.helpNeeded || []
    });
  };

  const handleSaveEdit = async (projectId) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        sdg: parseInt(editForm.sdg),
        helpNeeded: editForm.helpNeeded,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...editForm, sdg: parseInt(editForm.sdg), updatedAt: new Date().toISOString() }
          : project
      ));

      setEditingProject(null);
      setEditForm({});
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditForm({});
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(prev => ({ ...prev, [projectId]: true }));
      await deleteDoc(doc(db, 'projects', projectId));
      
      // Update local state
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setDeleting(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleHelpNeededChange = (help, checked) => {
    setEditForm(prev => ({
      ...prev,
      helpNeeded: checked 
        ? [...prev.helpNeeded, help]
        : prev.helpNeeded.filter(h => h !== help)
    }));
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ngo': return 'bg-green-100 text-green-800';
      case 'startup': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ngo': return 'NGO';
      case 'startup': return 'Startup';
      case 'government': return 'Government';
      case 'fundraisers': return 'Fundraisers';
      default: return 'Individual';
    }
  };

  const uniqueLocations = [...new Set(projects.map(p => p.location))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-12 bg-white/30 backdrop-blur-sm rounded-2xl w-1/3 mb-4 border border-white/20"></div>
            <div className="h-6 bg-white/20 backdrop-blur-sm rounded-xl w-1/2 mb-12 border border-white/20"></div>
            
            {/* Filter skeleton */}
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/3"></div>
                    <div className="h-10 bg-white/10 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Project cards skeleton */}
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                        <div className="h-4 bg-white/20 rounded w-1/4"></div>
                        <div className="h-6 bg-white/20 rounded-full w-16"></div>
                      </div>
                      <div className="h-6 bg-white/30 rounded w-3/4 mb-3"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-white/20 rounded w-full"></div>
                        <div className="h-4 bg-white/20 rounded w-5/6"></div>
                        <div className="h-4 bg-white/20 rounded w-4/6"></div>
                      </div>
                      <div className="flex space-x-2 mb-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-6 bg-white/20 rounded-full w-16"></div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:ml-6 lg:flex-shrink-0">
                      <div className="h-10 bg-white/20 rounded-xl w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 animate-bounce">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
            Discover Projects
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Find and collaborate on SDG projects that match your interests and expertise
          </p>
        </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in animation-delay-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
              🔍 Search Projects
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
              placeholder="Search projects..."
            />
          </div>

          {/* SDG Filter */}
          <div className="space-y-2">
            <label htmlFor="sdg-filter" className="block text-sm font-semibold text-gray-700">
              SDG Goals
            </label>
            <select
              id="sdg-filter"
              value={selectedSDG}
              onChange={(e) => setSelectedSDG(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
            >
              <option value="">All SDGs</option>
              {sdgList.map((sdg, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}. {sdg}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label htmlFor="location-filter" className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSDG('');
                setSelectedLocation('');
              }}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="hidden sm:inline">Clear Filters</span><span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 px-4 py-3 inline-block animate-fade-in animation-delay-500">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredProjects.length}</span> of <span className="text-purple-600 font-bold">{projects.length}</span> projects
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={`bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white p-4 sm:p-6 animate-scale-in`} style={{animationDelay: `${index * 100}ms`}}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${getSDGColor(project.sdg)} shadow-lg animate-pulse`}></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                      <span className="hidden sm:inline">SDG {project.sdg}: {sdgList[project.sdg - 1]}</span>
                      <span className="sm:hidden">SDG {project.sdg}</span>
                    </span>
                    <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${getRoleColor(project.createdByRole)} shadow-lg`}>
                      {project.createdByRole?.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200">
                      <span className="mr-1">📍</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200">
                      <span className="mr-1">👤</span>
                      <span className="font-medium">
                        <span className="hidden sm:inline">By </span>{project.createdByName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {project.helpNeeded?.map((help) => (
                      <span
                        key={help}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                      >
                        {help.charAt(0).toUpperCase() + help.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="lg:ml-8 lg:flex-shrink-0">
                  {userProfile && isOwnProject(project) ? (
                    <div className="text-center space-y-2 sm:space-y-3">
                      <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                        Your Project
                      </span>
                      <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-3">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={deleting[project.id]}
                          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {deleting[project.id] ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      {project.collaborationRequests?.length > 0 && (
                        <p className="text-xs text-gray-600 mt-2 sm:mt-3 bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200">
                          {project.collaborationRequests.length} collaboration request(s)
                        </p>
                      )}
                    </div>
                  ) : userProfile && hasRequestedCollaboration(project) ? (
                    <span className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                      Request Sent
                    </span>
                  ) : userProfile ? (
                    <button
                      onClick={() => handleCollaborationRequest(project.id)}
                      disabled={requestingCollaboration[project.id]}
                      className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs sm:text-sm lg:text-base font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {requestingCollaboration[project.id] ? 'Sending...' : 
                        <span>
                          <span className="hidden sm:inline">Request Collaboration</span>
                          <span className="sm:hidden">Request</span>
                        </span>
                      }
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                        <span className="hidden sm:inline">Login to Collaborate</span><span className="sm:hidden">Login</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl p-12 max-w-md mx-auto animate-fade-in">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No projects found</h3>
            <p className="text-gray-600 leading-relaxed">
              Try adjusting your search criteria or clear the filters to discover amazing projects.
            </p>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Project</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your project"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project location"
                  />
                </div>

                {/* SDG */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related SDG
                  </label>
                  <select
                    value={editForm.sdg}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sdg: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sdgList.map((sdg, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}. {sdg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Help Needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Help Needed
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['funding', 'volunteers', 'expertise', 'resources', 'partnerships', 'technology'].map((help) => (
                      <label key={help} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.helpNeeded?.includes(help)}
                          onChange={(e) => handleHelpNeededChange(help, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{help}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit(editingProject)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default ProjectList;