import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import Header from './Header';

export function VerifyPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('pending'); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setStatus('error');
      setErrorMessage('No token provided');
      return;
    }

    const verifyToken = async () => {
      try {
        console.log("Verifying token:", token);
        
        const response = await fetch(
          `http://localhost/devslog/server/check_reset_token.php?token=${encodeURIComponent(token)}`,
          { credentials: 'include' }
        );
        
        const data = await response.json();
        
        setVerifying(false);

        if (data.success) {
          // If token is valid but doesn't have a password yet, show the form
          setStatus('needs_password');
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setVerifying(false);
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (values) => {
    if (!token) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost/devslog/server/verify_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token: token,
          new_password: values.password 
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error setting new password:', error);
      setStatus('error');
      setErrorMessage('Failed to set new password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
          
          {verifying ? (
            <div className="flex flex-col items-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p>Verifying your request...</p>
            </div>
          ) : (
            <div>
              {status === 'needs_password' && (
                <div>
                  <p className="mb-4 text-gray-700">Please enter your new password:</p>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please enter your new password' },
                        { min: 8, message: 'Password must be at least 8 characters' }
                      ]}
                    >
                      <Input.Password placeholder="New password" />
                    </Form.Item>
                    
                    <Form.Item
                      name="confirmPassword"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your new password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Confirm new password" />
                    </Form.Item>
                    
                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={submitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Set New Password
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
              
              {status === 'success' && (
                <div className="bg-green-100 p-4 rounded">
                  <p className="text-green-700">Your password has been updated successfully!</p>
                  <p className="text-gray-600 mt-2">You will be redirected to the sign-in page shortly.</p>
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-100 p-4 rounded">
                  <p className="text-red-700">Failed to reset your password.</p>
                  <p className="text-gray-600 mt-2">{errorMessage}</p>
                </div>
              )}
              
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/signin')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go to Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}