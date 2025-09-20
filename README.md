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

Set up these security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects are readable by authenticated users
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
    
    // Collaboration requests
    match /collaborations/{collabId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5️⃣ Run the Application

```bash
# Start development server
npm start

# Open browser to http://localhost:3000
```

## 🚀 Deployment

### ⚡ Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### 🔥 Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 📖 Usage

- 🔐 **Sign in** with your Google account to get started
- 👥 **Select your role** (NGO, Startup, or Government) during first login
- 📝 **Create projects** with detailed descriptions and SDG alignments
- 🔍 **Browse projects** from other organizations using filters
- 🤝 **Send collaboration requests** to organizations with matching goals
- 📊 **Track progress** through your personalized dashboard

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Login.js         # Authentication
│   ├── Navbar.js        # Navigation
│   ├── PostProject.js   # Project creation
│   ├── ProjectList.js   # Project browsing
│   ├── RoleSelection.js # User role selection
│   ├── Communications.js # Messaging system
│   └── Welcome.js       # Landing page
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication state
├── firebase.js          # Firebase configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🤝 Contributing

We welcome contributions from developers passionate about sustainable development! 🌱

### 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### 📋 Development Guidelines

- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling consistency
- Write clear, descriptive commit messages
- Test your changes thoroughly before submitting
- Update documentation for new features

### 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License allows you to freely use, modify, and distribute this software for both personal and commercial purposes, provided you include the original copyright notice.

## 🆘 Support

Need help? We're here for you! 💪

- 📧 **Email**: support@sdgbridge.org
- 💬 **Discord**: [Join our community](https://discord.gg/sdgbridge)
- 📖 **Documentation**: [Full docs](https://docs.sdgbridge.org)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jaikanthh/sdg-bridge/issues)

## 🙏 Acknowledgments

- **United Nations** for the Sustainable Development Goals framework
- **Firebase** for providing robust backend infrastructure
- **React Community** for the amazing ecosystem
- **Tailwind CSS** for the utility-first approach
- **All Contributors** who help make this project better

---

**🌍 Built with passion for sustainable development | Ready to make an impact! 🚀**

*Star ⭐ this repository if you found it helpful!*
