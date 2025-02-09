import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from './Header';

export function VerificationSuccess() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState({ 
        loading: true, 
        success: false, 
        message: '',
        alreadyVerified: false 
    });
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token && isMounted) {
                setStatus({ 
                    loading: false, 
                    success: false, 
                    message: 'No verification token found' 
                });
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost/devslog/server/verify_email.php?token=${token}`,
                    { credentials: 'include' }
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Verification response:', data);

                if (isMounted) {
                    setStatus({
                        loading: false,
                        success: data.success,
                        message: data.message,
                        alreadyVerified: data.alreadyVerified
                    });

                    if (data.success) {
                        // Add a small delay before redirect
                        setTimeout(() => {
                            if (isMounted) {
                                navigate('/signin');
                            }
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Verification error:', error);
                if (isMounted) {
                    setStatus({
                        loading: false,
                        success: false,
                        message: 'Verification failed. Please try again.'
                    });
                }
            }
        };

        verifyEmail();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Header />
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mt-16">
                {status.loading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p>Verifying your email...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className={`text-2xl font-bold ${status.success ? 'text-green-600' : 'text-red-600'} mb-4`}>
                            {status.success ? 'Email Verified!' : 'Verification Failed'}
                        </h1>
                        <p className="mb-4">{status.message}</p>
                        {status.success ? (
                            <>
                                <div className="mb-4 text-green-600">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">
                                    {status.alreadyVerified 
                                        ? 'Your email is already verified. Redirecting to login...'
                                        : 'Redirecting to login page in 3 seconds...'}
                                </p>
                            </>
                        ) : (
                            <Link
                                to="/signin"
                                className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                                Go to Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}