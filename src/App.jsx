import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DevlogHome from './components/DevlogHome';
import Blogs from './components/post/Posts';
import About from './components/about/About';
import { SignUpForm } from './components/user/SignUpForm';
import { SignInForm } from './components/user/SignInForm';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminSignIn } from './components/admin/AdminSignIn';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DevlogHome />} />
          <Route path="/posts" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
