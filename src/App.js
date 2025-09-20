import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import PostProject from './components/PostProject';
import Communications from './components/Communications';
import './index.css';

function ProtectedRoute({ children }) {
  const { currentUser, userProfile } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!userProfile?.role) {
    return <Navigate to="/role-selection" />;
  }
  
  return children;
}

function AppContent() {
  const { currentUser, userProfile } = useAuth();
  const currentPath = window.location.pathname;

  // Show navbar for authenticated users, on the projects page, or on the welcome page, but not on login page
  const showNavbar = ((currentUser && userProfile?.role) || currentPath === '/projects' || currentPath === '/') && currentPath !== '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route 
          path="/" 
          element={
            currentUser && userProfile?.role ? 
            <Navigate to="/dashboard" /> : 
            <Welcome />
          } 
        />
        <Route 
          path="/login" 
          element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/role-selection" 
          element={
            currentUser && !userProfile?.role ? 
            <RoleSelection /> : 
            <Navigate to={currentUser ? "/dashboard" : "/login"} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={<ProjectList />} 
        />
        <Route 
          path="/post-project" 
          element={
            <ProtectedRoute>
              <PostProject />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/communications" 
          element={
            <ProtectedRoute>
              <Communications />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;