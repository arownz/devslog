import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({
    type: "", // 'success', 'error', 'loading', 'validating'
    message: ""
  });
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    // Verify token validity when component mounts
    if (!token) {
      setStatus({
        type: "error",
        message: "Invalid or missing reset token"
      });
      return;
    }

    // Verify token with the server
    const verifyToken = async () => {
      setStatus({
        type: "validating",
        message: "Verifying your reset token..."
      });

      try {
        const response = await fetch(`http://localhost/devslog/server/validate_reset_token.php?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (!data.success) {
          setStatus({
            type: "error",
            message: data.message || "Invalid or expired token"
          });
        } else {
          setStatus({
            type: "",
            message: ""
          });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setStatus({
          type: "error",
          message: "Failed to verify reset token"
        });
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match"
      });
      return;
    }

    setStatus({
      type: "loading",
      message: "Updating your password..."
    });

    try {
      const response = await fetch('http://localhost/devslog/server/reset_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: data.message || "Password has been updated successfully!"
        });
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to update password"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again."
      });
    }
  };

  if (status.type === "validating") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-12 mt-16">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <h2 className="text-xl font-semibold">Verifying your request</h2>
              <p className="text-gray-500 mt-2">Please wait while we validate your reset token...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12 mt-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
              <p className="text-gray-600">Please enter your new password below.</p>
            </div>

            {status.type === "success" ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p>{status.message}</p>
                <p className="mt-2 text-sm">Redirecting to sign in page...</p>
              </div>
            ) : status.type === "error" ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{status.message}</p>
                {(status.message === "Invalid or missing reset token" || 
                  status.message === "Invalid or expired token") && (
                  <div className="mt-4 text-center">
                    <Link 
                      to="/forgot-password" 
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Request New Reset Link
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                    required
                    disabled={status.type === "loading"}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute right-2 top-8 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                    required
                    disabled={status.type === "loading"}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-8 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    status.type === "loading" ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {status.type === "loading" ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}