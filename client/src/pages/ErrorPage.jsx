import { NavLink, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();
    
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Route Error:', error);
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-[#46052D] mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Page Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">
                            {error.statusText || error.message || 'An unexpected error occurred'}
                        </p>
                    </div>
                )}
                
                <NavLink 
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-[#46052D] text-white font-medium rounded-lg hover:bg-[#2d0319] transition duration-200"
                >
                    Go Back to Home
                </NavLink>
            </div>
        </div>
    );
};