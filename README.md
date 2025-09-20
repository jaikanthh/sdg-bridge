# 🌍 SDG Bridge

**Connecting Organizations for Sustainable Impact**

SDG Bridge is a comprehensive platform that brings together NGOs, Startups, and Government bodies to collaborate on projects aligned with the United Nations Sustainable Development Goals (SDGs). Our mission is to accelerate progress towards a sustainable future by facilitating meaningful partnerships and resource sharing.

## 🚀 Live Demo

[View Live Application](https://your-app-url.vercel.app) *(Update with your deployed URL)*

## 📸 Screenshots

*Add screenshots of your application here to showcase the UI*

## ✨ Features

### 🔐 Authentication & User Management
- **Google OAuth Integration**: Secure login with Google accounts
- **Role-Based Access**: Distinct interfaces for NGOs, Startups, and Government bodies
- **User Profiles**: Comprehensive organization profiles with contact information

### 📋 Project Management
- **Project Creation**: Intuitive form with SDG categorization and location mapping
- **Rich Project Details**: Description, budget ranges, collaboration requirements
- **Project Discovery**: Advanced search and filtering by SDG goals and geographic location
- **Real-time Updates**: Live project status and collaboration tracking

### 🤝 Collaboration Features
- **Partnership Requests**: Send and manage collaboration requests
- **Request Management**: Accept, decline, or negotiate partnership terms
- **Communication Hub**: Centralized messaging for project discussions

### 📊 Analytics & Insights
- **Interactive Dashboard**: Real-time statistics and project metrics
- **Progress Tracking**: Monitor SDG impact and collaboration success
- **Activity Feed**: Recent platform activity and updates

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Accessibility**: WCAG compliant design for inclusive access

## 🛠️ Tech Stack

### Frontend
- **⚛️ React.js** - Modern JavaScript library for building user interfaces
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **🧭 React Router DOM** - Declarative routing for React applications
- **🔥 Firebase SDK** - Real-time database and authentication integration

### Backend & Database
- **🔐 Firebase Authentication** - Secure Google OAuth implementation
- **📊 Cloud Firestore** - NoSQL document database for real-time data
- **☁️ Firebase Functions** - Serverless backend logic (ready for scaling)

### Development & Deployment
- **📦 npm** - Package management and dependency handling
- **🚀 Vercel** - Optimized deployment platform for React applications
- **🔥 Firebase Hosting** - Alternative hosting solution with CDN
- **📱 Progressive Web App** - PWA-ready for mobile installation

## 🚀 Setup Instructions

### 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### 1️⃣ Clone and Install Dependencies

```bash
# Navigate to project directory
cd "SRM AP"

# Install dependencies
npm install
```

### 2️⃣ Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Add your domain to authorized domains
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon
   - Copy the config object

### 3️⃣ Configure Firebase

Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4️⃣ Firestore Security Rules

In Firebase Console > Firestore Database > Rules, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone authenticated can read projects
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow update: if request.auth != null;
    }
  }
}
```

### 5️⃣ Run the Application

```bash
# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 🚀 Deployment

### Option 1: Vercel (Recommended) ⚡

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be deployed and you'll get a URL

### Option 2: Firebase Hosting 🔥

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 📖 Usage

1. **🔐 Sign Up/Login**: Use Google authentication
2. **👥 Select Role**: Choose your organization type (NGO, Startup, Government)
3. **📝 Post Projects**: Create new SDG projects with details
4. **🔍 Browse Projects**: Discover projects and filter by SDG/location
5. **🤝 Collaborate**: Send collaboration requests to project owners
6. **📊 Dashboard**: Monitor your activity and platform statistics

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.js       # Main dashboard with statistics
│   ├── Login.js          # Google authentication
│   ├── Navbar.js         # Navigation component
│   ├── PostProject.js    # Project creation form
│   ├── ProjectList.js    # Project browsing and filtering
│   └── RoleSelection.js  # User role selection
├── contexts/
│   └── AuthContext.js    # Authentication state management
├── App.js               # Main app component with routing
├── firebase.js          # Firebase configuration
├── index.css           # Tailwind CSS styles
└── index.js            # App entry point
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. ✨ Make your changes
4. 🧪 Test thoroughly
5. 📤 Submit a pull request

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain consistent code formatting
- Write meaningful commit messages
- Test your changes across different screen sizes
- Ensure Firebase security rules are properly configured

## 📄 License

MIT License - feel free to use this project for your hackathon, educational purposes, or commercial applications.

## 🆘 Support

- 🐛 **Bug Reports**: Create an issue with detailed reproduction steps
- 💡 **Feature Requests**: Open an issue with your enhancement ideas
- 📧 **Contact**: Reach out to the development team for urgent matters
- 📚 **Documentation**: Check our wiki for additional guides

## 🌟 Acknowledgments

- United Nations for the SDG framework
- Firebase team for the excellent backend services
- React and Tailwind CSS communities
- All contributors and testers

---

**🌍 Built with passion for sustainable development | Ready to make an impact! 🚀**

*Star ⭐ this repository if you found it helpful!*