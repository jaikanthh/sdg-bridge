import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function PostProject() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sdg: '',
    location: '',
    helpNeeded: [],
    contactEmail: userProfile?.email || '',
    phoneNumber: '',
    budget: '',
    timeline: ''
  });

  const sdgOptions = [
    { value: 1, label: '1. No Poverty' },
    { value: 2, label: '2. Zero Hunger' },
    { value: 3, label: '3. Good Health and Well-being' },
    { value: 4, label: '4. Quality Education' },
    { value: 5, label: '5. Gender Equality' },
    { value: 6, label: '6. Clean Water and Sanitation' },
    { value: 7, label: '7. Affordable and Clean Energy' },
    { value: 8, label: '8. Decent Work and Economic Growth' },
    { value: 9, label: '9. Industry, Innovation and Infrastructure' },
    { value: 10, label: '10. Reduced Inequality' },
    { value: 11, label: '11. Sustainable Cities and Communities' },
    { value: 12, label: '12. Responsible Consumption and Production' },
    { value: 13, label: '13. Climate Action' },
    { value: 14, label: '14. Life Below Water' },
    { value: 15, label: '15. Life on Land' },
    { value: 16, label: '16. Peace and Justice Strong Institutions' },
    { value: 17, label: '17. Partnerships to achieve the Goal' }
  ];

  const helpTypes = [
    { id: 'funding', label: 'Funding' },
    { id: 'volunteers', label: 'Volunteers' },
    { id: 'technology', label: 'Technology' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'partnerships', label: 'Partnerships' },
    { id: 'resources', label: 'Resources' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHelpNeededChange = (helpType) => {
    setFormData(prev => ({
      ...prev,
      helpNeeded: prev.helpNeeded.includes(helpType)
        ? prev.helpNeeded.filter(type => type !== helpType)
        : [...prev.helpNeeded, helpType]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.sdg || !formData.location || formData.helpNeeded.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const projectData = {
        ...formData,
        sdg: parseInt(formData.sdg),
        createdBy: userProfile.uid,
        createdByName: userProfile.displayName,
        createdByRole: userProfile.role,
        createdAt: new Date().toISOString(),
        status: 'active',
        collaborationRequests: []
      };

      await addDoc(collection(db, 'projects'), projectData);
      
      alert('Project posted successfully!');
      navigate('/projects');
    } catch (error) {
      console.error('Error posting project:', error);
      alert('Error posting project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 animate-bounce">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
          Post Your Project
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Share your SDG project and connect with potential collaborators
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Project Title */}
          <div className="lg:col-span-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">📝</span> Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="Enter your project title"
              required
            />
          </div>

          {/* SDG Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
              Related SDG *
            </label>
            <select
              name="sdg"
              value={formData.sdg}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              required
            >
              <option value="">Select an SDG</option>
              {sdgOptions.map((sdg) => (
                <option key={sdg.value} value={sdg.value}>
                  {sdg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="🌎 City, State, Country"
              required
            />
          </div>

          {/* Project Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">📄</span> Project Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40 resize-none"
              placeholder="Describe your project, its goals, and impact..."
              required
            />
          </div>

          {/* Help Needed */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              🤝 Type of Help Needed * (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {helpTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2.5 sm:p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 group">
                  <input
                    type="checkbox"
                    checked={formData.helpNeeded.includes(type.id)}
                    onChange={() => handleHelpNeededChange(type.id)}
                    className="w-4 h-4 rounded border-white/40 text-blue-600 focus:ring-blue-500/50 bg-white/30 backdrop-blur-sm"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">📧</span> Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="your@email.com"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">📱</span> Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="📞 +1 (555) 123-4567"
            />
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              Budget Range (Optional)
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="💵 e.g., $10,000 - $50,000"
            />
          </div>

          {/* Timeline */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="timeline" className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">⏰</span> Project Timeline (Optional)
            </label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/40"
              placeholder="📅 e.g., 6 months, Starting January 2024"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-sm sm:text-base text-gray-700 font-semibold hover:bg-white/30 hover:text-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>❌</span>
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            <span>{loading ? 'Posting...' : 'Post Project'}</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default PostProject;