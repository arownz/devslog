import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DevlogHome from './components/DevlogHome';
import { SignUpForm } from './components/signup/SignUpForm';
import { SignInForm } from './components/signin/SignInForm';
import { AdminSignIn } from './components/admin/AdminSignIn';
import About from './components/about/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DevlogHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;