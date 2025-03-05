import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Remove the Ant Design message import since we'll use our own UI
import Header from './Header';

export function VerifyPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('pending'); // pending, success, error, already-used
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setStatus('error');
      setStatusMessage('No token provided');
      return;
    }

    const verifyToken = async () => {
      try {
        console.log("Verifying token:", token);
        
        const response = await fetch(
          `http://localhost/devslog/server/verify_password.php?token=${encodeURIComponent(token)}`,
          { credentials: 'include' }
        );

        console.log("Response status:", response.status);
        
        // Handle potential non-JSON response
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse response as JSON:", text);
          setVerifying(false);
          setStatus('error');
          setStatusMessage('Invalid server response');
          return;
        }
        
        console.log("Response data:", data);
        
        setVerifying(false);

        if (data.success) {
          setStatus('success');
          setStatusMessage(data.message);
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate(data.redirect || '/signin');
          }, 3000);
        } else {
          // Special case for "Token already used"
          if (data.message && data.message.includes('already used')) {
            setStatus('already-used');
            setStatusMessage('This password reset link has been used. Your password was changed successfully.');
          } else {
            setStatus('error');
            setStatusMessage(data.message || 'Verification failed');
          }
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setVerifying(false);
        setStatus('error');
        setStatusMessage('An unexpected error occurred');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Password Change Verification</h1>
          
          {verifying ? (
            <div className="flex flex-col items-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p>Verifying your request...</p>
            </div>
          ) : (
            <div>
              {status === 'success' && (
                <div className="bg-green-100 p-4 rounded">
                  <p className="text-green-700">Your password has been updated successfully!</p>
                  <p className="text-gray-600 mt-2">You will be redirected to the sign-in page shortly.</p>
                </div>
              )}
              
              {status === 'already-used' && (
                <div className="bg-blue-100 p-4 rounded">
                  <p className="text-blue-700">Password already updated</p>
                  <p className="text-gray-600 mt-2">{statusMessage}</p>
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-100 p-4 rounded">
                  <p className="text-red-700">Failed to verify your password change request.</p>
                  <p className="text-gray-600 mt-2">{statusMessage}</p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/signin')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}