import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DevlogHome />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/posts/*" element={<PostDetailsPage />} />
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
