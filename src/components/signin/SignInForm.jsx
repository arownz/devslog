import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function SignInForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost/devslog/server/user_auth.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, action: 'login' }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/user-dashboard');
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
      }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 bg-green-600 p-12 text-white flex flex-col justify-center">
                            <h2 className="text-4xl font-bold mb-6">Welcome to Devslog</h2>
                            <p className="mb-8">Sign in to continue sharing your knowledge with our community!</p>
                            <div className="mb-8">
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/000/518/198/non_2x/woman-working-with-computer-bright-colorful-vector-illustration.jpg"
                                    alt="Sign in illustration"
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
                            <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link to="/ForgotPassword" className="text-sm text-green-600 hover:text-green-500">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Sign In
                                </button>
                            </form>
                            <p className="mt-6 text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                                    Sign up here
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

