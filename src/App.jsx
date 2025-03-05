import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeProvider'; // Updated import
import DevlogHome from './components/guest/DevlogHome';
import Posts from './components/guest/AllForumPosts';
import About from './components/guest/About';
import { SignUpForm } from './components/user/SignUpForm';
import { SignInForm } from './components/user/SignInForm';
import { UserDashboard } from './components/user/UserDashboard';
import { UserProfile } from './components/user/UserProfile';
import PostDetailsPage from './components/post/PostDetailsPage';
import { AdminSignIn } from './components/admin/AdminSignIn';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VerificationSuccess } from './components/VerificationSuccess';
import SearchResults from './components/SearchResults';
import { VerifyPassword } from './components/VerifyPassword'; // New import
import { ForgotPassword } from './components/user/ForgotPassword';
import { ResetPassword } from './components/user/ResetPassword';

// Import the dark mode CSS
import './styles/darkMode.css';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<DevlogHome />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:postId" element={<PostDetailsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/user-dashboard/*" element={<UserDashboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/admin-signin" element={<AdminSignIn />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/verify-email" element={<VerificationSuccess />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/verify-password" element={<VerifyPassword />} /> {/* New route */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
