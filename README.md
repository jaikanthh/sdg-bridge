# SDG Bridge

A platform connecting NGOs, Startups, and Government bodies to collaborate on Sustainable Development Goals (SDGs).

## Features

- **User Authentication**: Google login with role-based access (NGO, Startup, Government)
- **Project Posting**: Create projects with SDG categorization, location, and collaboration needs
- **Project Discovery**: Browse, search, and filter projects by SDG and location
- **Collaboration Requests**: Request to collaborate on projects
- **Dashboard**: View statistics and recent activity
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend & Database**: Firebase (Authentication + Firestore)
- **Routing**: React Router DOM
- **Hosting**: Ready for Vercel or Firebase Hosting

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd "SRM AP"

# Install dependencies
npm install
```

### 2. Firebase Setup

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

### 3. Configure Firebase

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

### 4. Firestore Security Rules

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

### 5. Run the Application

```bash
# Start development server
npm start
```

The application will open at `http://localhost:3000`

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be deployed and you'll get a URL

### Option 2: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Usage

1. **Sign Up/Login**: Use Google authentication
2. **Select Role**: Choose your organization type (NGO, Startup, Government)
3. **Post Projects**: Create new SDG projects with details
4. **Browse Projects**: Discover projects and filter by SDG/location
5. **Collaborate**: Send collaboration requests to project owners
6. **Dashboard**: Monitor your activity and platform statistics

## Project Structure

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your hackathon or educational purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Built for hackathons with ❤️ - Ready to demo and deploy!**