import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

function Communications() {
  const { userProfile } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [updatingRequest, setUpdatingRequest] = useState({});

  useEffect(() => {
    if (userProfile?.uid) {
      fetchRequests();
    }
  }, [userProfile]);

  const fetchRequests = async () => {
    try {
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Find requests sent by current user
      const sent = [];
      projectsData.forEach(project => {
        if (project.collaborationRequests) {
          project.collaborationRequests.forEach(request => {
            if (request.userId === userProfile.uid) {
              sent.push({
                ...request,
                projectId: project.id,
                projectTitle: project.title,
                projectOwner: project.createdByName,
                projectOwnerRole: project.createdByRole
              });
            }
          });
        }
      });

      // Find requests received by current user (for their projects)
      const received = [];
      projectsData.forEach(project => {
        if (project.createdBy === userProfile.uid && project.collaborationRequests) {
          project.collaborationRequests.forEach(request => {
            received.push({
              ...request,
              projectId: project.id,
              projectTitle: project.title
            });
          });
        }
      });

      setSentRequests(sent.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
      setReceivedRequests(received.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (projectId, request, action) => {
    const requestKey = `${projectId}-${request.userId}`;
    try {
      setUpdatingRequest(prev => ({ ...prev, [requestKey]: true }));

      // Get the current project data
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const currentProject = projectsSnapshot.docs.find(doc => doc.id === projectId);
      
      if (!currentProject) {
        throw new Error('Project not found');
      }

      const currentRequests = currentProject.data().collaborationRequests || [];
      
      // Update the specific request in the array
      const updatedRequests = currentRequests.map(req => 
        req.userId === request.userId 
          ? { ...req, status: action }
          : req
      );
      
      // Update the entire array at once
      await updateDoc(doc(db, 'projects', projectId), {
        collaborationRequests: updatedRequests
      });

      // Update local state
      setReceivedRequests(prev => 
        prev.map(req => 
          req.projectId === projectId && req.userId === request.userId
            ? { ...req, status: action }
            : req
        )
      );

      alert(`Request ${action} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Error ${action}ing request. Please try again.`);
    } finally {
      setUpdatingRequest(prev => ({ ...prev, [requestKey]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ngo': return 'bg-green-100 text-green-800';
      case 'startup': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-white/95 backdrop-blur-sm rounded-xl w-1/4 mb-8 border border-gray-200"></div>
            <div className="grid gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200"></div>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Requests Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your collaboration requests and build meaningful partnerships
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-gray-200 shadow-lg">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('received')}
                className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'received'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                  <span>Received Requests</span>
                  {receivedRequests.length > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === 'received' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {receivedRequests.filter(req => req.status === 'pending').length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'sent'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Sent Requests</span>
                  {sentRequests.length > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === 'sent' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {sentRequests.length}
                    </span>
                  )}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Received Requests Tab */}
        {activeTab === 'received' && (
          <div className="space-y-6">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request, index) => {
                const requestKey = `${request.projectId}-${request.userId}`;
                return (
                  <div 
                    key={requestKey} 
                    className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {request.projectTitle}
                            </h3>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm border ${
                            request.status === 'accepted' 
                              ? 'bg-green-100/80 text-green-700 border-green-200' 
                              : request.status === 'rejected'
                              ? 'bg-red-100/80 text-red-700 border-red-200'
                              : 'bg-yellow-100/80 text-yellow-700 border-yellow-200'
                          }`}>
                            {request.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                      
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                            <span className="text-blue-500">👤</span>
                            <span className="font-medium text-gray-800">{request.userName}</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              request.userRole === 'ngo' 
                                ? 'bg-green-100 text-green-700' 
                                : request.userRole === 'startup'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {request.userRole?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                            <span className="text-purple-500">📧</span>
                            <span className="text-gray-800">{request.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                            <span className="text-orange-500">📅</span>
                            <span className="text-gray-800">{new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="lg:ml-6 lg:flex-shrink-0">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleRequestResponse(request.projectId, request, 'accepted')}
                              disabled={updatingRequest[requestKey]}
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                            >
                              <span className="flex items-center space-x-2">
                                <span>{updatingRequest[requestKey] ? '⏳' : '✅'}</span>
                                <span>{updatingRequest[requestKey] ? 'Accepting...' : 'Accept'}</span>
                              </span>
                            </button>
                            <button
                              onClick={() => handleRequestResponse(request.projectId, request, 'rejected')}
                              disabled={updatingRequest[requestKey]}
                              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                            >
                              <span className="flex items-center space-x-2">
                                <span>{updatingRequest[requestKey] ? '⏳' : '❌'}</span>
                                <span>{updatingRequest[requestKey] ? 'Rejecting...' : 'Reject'}</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    No requests yet
                  </h3>
                  <p className="text-gray-600">
                    When others want to collaborate on your projects, their requests will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-6">
            {sentRequests.length > 0 ? (
              sentRequests.map((request, index) => {
                const requestKey = `${request.projectId}-${request.userId}`;
                return (
                  <div 
                    key={requestKey} 
                    className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {request.projectTitle}
                            </h3>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm border ${
                            request.status === 'accepted' 
                              ? 'bg-green-100/80 text-green-700 border-green-200' 
                              : request.status === 'rejected'
                              ? 'bg-red-100/80 text-red-700 border-red-200'
                              : 'bg-yellow-100/80 text-yellow-700 border-yellow-200'
                          }`}>
                            {request.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                      
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                            <span className="text-blue-500">👤</span>
                            <span className="font-medium text-gray-800">Project by {request.projectOwner}</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              request.projectOwnerRole === 'ngo' 
                                ? 'bg-green-100 text-green-700' 
                                : request.projectOwnerRole === 'startup'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {request.projectOwnerRole?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                            <span className="text-orange-500">📅</span>
                            <span className="text-gray-800">Sent {new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:ml-6 lg:flex-shrink-0">
                        <div className="text-center">
                          {request.status === 'accepted' && (
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
                              <span className="flex items-center space-x-2">
                                <span>✅</span>
                                <span>Request Accepted</span>
                              </span>
                            </div>
                          )}
                          {request.status === 'rejected' && (
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
                              <span className="flex items-center space-x-2">
                                <span>❌</span>
                                <span>Request Rejected</span>
                              </span>
                            </div>
                          )}
                          {(!request.status || request.status === 'pending') && (
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg animate-pulse">
                              <span className="flex items-center space-x-2">
                                <span>⏳</span>
                                <span>Awaiting Response</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                </div>
              );
            })
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    No sent requests
                  </h3>
                  <p className="text-gray-600">
                    Start collaborating by requesting to join projects that interest you
                  </p>
                </div>
              </div>
            )}
        </div>
      )}
      </div>
    </div>
  );
}

export default Communications;