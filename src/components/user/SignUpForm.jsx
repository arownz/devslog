import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import zxcvbn from 'zxcvbn'; // Password strength checker

export function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
    hasLower: false
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        action: 'register'
      };
      delete dataToSend.confirmPassword;

      const response = await fetch('http://localhost/devslog/server/user_auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert("Registration successful! Please check your email to verify your account.");
        navigate('/signin');
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error.message}. Please try again.`);
    }
  };

  const validatePassword = (password) => {
    const strength = zxcvbn(password);
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      score: strength.score
    };
  };

  const handleChange = (e) => {
    if (e.target.name === 'profile_image') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (e.target.name === 'password') {
        setPasswordValidation(validatePassword(e.target.value));
      }
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12 mt-16"> {/* Added mt-16 */}
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-green-600 p-12 text-white flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">Welcome to Devslog</h2>
              <p className="mb-8">Join our community of developers and start sharing your knowledge today!</p>
              <div className="mb-8">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/000/518/208/original/man-working-with-computer-bright-colorful-vector-illustration.jpg"
                  alt="Sign up illustration"
                  className="w-full h-auto rounded-3xl shadow-lg"
                />
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                ← Back to Home
              </button>
            </div>
            <div className="md:w-1/2 p-12">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Create an Account</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile_image" className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
                    Choose Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profile_image"
                    name="profile_image"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="password-requirements mt-2">
                    <p className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      ✓ At least 8 characters
                    </p>
                    <p className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      ✓ Contains a number
                    </p>
                    <p className={`text-sm ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                      ✓ Contains a special character
                    </p>
                    <p className={`text-sm ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                      ✓ Contains an uppercase letter
                    </p>
                    <p className={`text-sm ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                      ✓ Contains a lowercase letter
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Account
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
