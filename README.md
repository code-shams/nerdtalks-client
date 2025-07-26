# Nerdtalks - Community Forum Platform

A modern, responsive community forum designed for passionate discussions about coding, tech, books, games, anime, and more. Nerdtalks provides a platform where nerds can freely share their interests, connect with like-minded individuals, and build meaningful connections while discussing their favorite topics.

## 🌐 Live Demo

-   **Frontend**: [https://nerdtalks-sh.web.app/](https://nerdtalks-sh.web.app/)
-   **Backend API**: [https://nerdtalks-server.vercel.app/](https://nerdtalks-server.vercel.app/)

## ✨ Key Features

### User Experience

-   **Post Creation & Management**: Users can create, edit, and manage their posts with rich content
-   **Interactive Voting System**: Upvote and downvote posts to highlight quality content
-   **Comment System**: Engage in discussions with nested comments and replies
-   **Content Reporting**: Users can report inappropriate comments for moderation
-   **Search & Filter**: Find posts by tags and sort by popularity or date
-   **Membership System**: Upgrade to premium membership for enhanced features and badges

### Community Features

-   **Badge System**: Earn bronze badges on signup and gold badges through membership
-   **User Profiles**: Personalized dashboards to manage posts and profile information
-   **Announcements**: Stay updated with platform announcements and notifications
-   **Tag-based Organization**: Content organized by categories (anime, coding, games, etc.)

### Payment Integration

-   **Stripe Payment Gateway**: Secure membership upgrades with integrated payment processing
-   **Membership Tiers**: Free users limited to 5 posts, members get unlimited posting

### Admin Panel

-   **User Management**: Comprehensive admin tools to manage registered users
-   **Content Moderation**: Review and handle reported comments and inappropriate content
-   **Announcement System**: Create and broadcast important announcements to all users
-   **Site Analytics**: Monitor platform statistics and user engagement metrics

### Technical Features

-   **Real-time Updates**: Live notification system for announcements and interactions
-   **Pagination**: Optimized content loading with 5 posts per page on homepage
-   **Mobile-First Design**: Fully responsive across desktop, tablet, and mobile devices
-   **Dark Mode Interface**: Clean, modern dark theme inspired by professional platforms

## 🛠️ Tech Stack

### Frontend Technologies

-   **React** - Modern JavaScript library for building user interfaces
-   **Tailwind CSS** - Utility-first CSS framework for rapid styling
-   **React Router** - Declarative routing for React applications
-   **TanStack Query** - Powerful data synchronization for React
-   **React Hook Form** - Performant forms with easy validation

### Authentication & Security

-   **Firebase Auth** - Secure user authentication with social login options
-   **JWT Tokens** - JSON Web Tokens for secure API communication
-   **Firebase Admin SDK** - Server-side authentication verification

### State Management & API

-   **Axios** - HTTP client for API requests with custom interceptors
-   **Custom Hooks** - Reusable logic for data fetching and state management

### Payment Processing

-   **Stripe** - Secure payment gateway for membership subscriptions

### Deployment

-   **Firebase Hosting** - Fast, secure web hosting for the client application

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn package manager
-   Firebase project setup
-   Access to the backend API

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nerdtalks-client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:

    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_SERVER_URL=your_backend_server_url
    VITE_IMGBB_API=your_imgbb_api_key
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
nerdtalks-client/
├── public/            # Static public assets
├── src/               # Source code
│   ├── assets/        # Images, icons, and static files
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── firebase/      # Firebase configuration and setup
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components and main views
│   ├── routes/        # Routing configuration
│   ├── shared/        # Shared utilities and constants
│   ├── index.css      # Global styles
│   └── main.jsx       # Application entry point
├── utils/             # Utility functions and helpers
├── .firebaserc        # Firebase project configuration
├── .gitignore         # Git ignore rules
├── eslint.config.js   # ESLint configuration
├── firebase.json      # Firebase hosting configuration
├── index.html         # HTML template
├── package.json       # Project dependencies and scripts
├── package-lock.json  # Dependency lock file
├── README.md          # Project documentation
└── vite.config.js     # Vite configuration
```

## 🔐 Authentication Flow

The application uses a hybrid authentication system combining Firebase Auth with custom JWT implementation:

1. **Frontend**: Firebase Auth handles user registration, login, and social authentication
2. **Token Management**: Custom Axios instance automatically attaches Firebase access tokens
3. **Backend Verification**: Firebase Admin SDK verifies tokens server-side
4. **Database Integration**: User data stored in MongoDB alongside Firebase authentication

## 🎨 Design Philosophy

Nerdtalks follows a clean, modern design approach with focus on:

-   **Dark Mode Only**: Optimized for reduced eye strain during long reading sessions
-   **Typography-First**: Emphasis on readability and content hierarchy
-   **Minimal Color Palette**: Subtle accents that don't distract from content
-   **Mobile-First**: Responsive design ensuring great experience across all devices

## 🤝 Contributing

We welcome contributions to make Nerdtalks even better! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Maksudur Rahman**

-   GitHub: [@code-shams](https://github.com/code-shams)
-   LinkedIn: [code-shams](https://linkedin.com/in/code-shams)
-   Portfolio: [https://code-shams.vercel.app](https://code-shams.vercel.app)

---

_Built with ☕ for the nerd community_
