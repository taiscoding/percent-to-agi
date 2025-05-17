import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signIn, signUp, signOut, resetPassword, onAuthStateChange } from '../../utils/auth';
import { getUserAssessments } from '../../utils/assessmentService';

const UserAuth = () => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('login'); // login, register, profile, assessments
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  
  // User data
  const [userAssessments, setUserAssessments] = useState([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
      
      if (user) {
        setActiveView('profile');
        loadUserAssessments(user.uid);
      } else {
        setActiveView('login');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Load user's saved assessments
  const loadUserAssessments = async (userId) => {
    if (!userId) return;
    
    setIsLoadingAssessments(true);
    try {
      const result = await getUserAssessments(userId);
      if (result.success) {
        setUserAssessments(result.assessments);
      } else {
        console.error('Failed to load assessments:', result.error);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setIsLoadingAssessments(false);
    }
  };
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        setAuthSuccess('Logged in successfully!');
        setEmail('');
        setPassword('');
      } else {
        setAuthError(result.error || 'Login failed');
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);
    
    if (!displayName) {
      setAuthError('Display name is required');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signUp(email, password, displayName);
      if (result.success) {
        setAuthSuccess('Account created successfully!');
        setEmail('');
        setPassword('');
        setDisplayName('');
      } else {
        setAuthError(result.error || 'Registration failed');
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setActiveView('login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);
    
    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setAuthSuccess('Password reset link sent to your email');
        setResetEmail('');
      } else {
        setAuthError(result.error || 'Password reset failed');
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render login form
  const renderLoginForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-4">Login</h3>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setActiveView('reset')}
            >
              Forgot Password?
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => setActiveView('register')}
            >
              Register here
            </button>
          </p>
        </div>
      </motion.div>
    );
  };
  
  // Render registration form
  const renderRegisterForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-4">Create Account</h3>
        
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="regEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="regPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => setActiveView('login')}
            >
              Login here
            </button>
          </p>
        </div>
      </motion.div>
    );
  };
  
  // Render password reset form
  const renderPasswordResetForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-4">Reset Password</h3>
        
        <form onSubmit={handlePasswordReset}>
          <div className="mb-6">
            <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setActiveView('login')}
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    );
  };
  
  // Render user profile
  const renderUserProfile = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Your Profile</h3>
          
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'profile'
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              } rounded-l-lg border border-gray-200`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveView('assessments')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'assessments'
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              } rounded-r-lg border border-gray-200`}
            >
              Assessments
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
              </span>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold">{currentUser?.displayName || 'User'}</h4>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger"
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </motion.div>
    );
  };
  
  // Render user assessments
  const renderUserAssessments = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Your AGI Assessments</h3>
          
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'profile'
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              } rounded-l-lg border border-gray-200`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveView('assessments')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'assessments'
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              } rounded-r-lg border border-gray-200`}
            >
              Assessments
            </button>
          </div>
        </div>
        
        {isLoadingAssessments ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">Loading your assessments...</p>
          </div>
        ) : (
          <div>
            {userAssessments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="mb-4">You haven't saved any assessments yet</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // Navigate to methodology section
                    const methodologySection = document.getElementById('methodology-section');
                    if (methodologySection) {
                      methodologySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Create Your First Assessment
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {userAssessments.map((assessment) => (
                  <div 
                    key={assessment.id} 
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h4 className="font-semibold">{new Date(assessment.createdAt).toLocaleDateString()}</h4>
                    </div>
                    <div className="p-4">
                      <p className="text-2xl font-bold text-center mb-4">{assessment.overallPercentage}%</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(assessment.factorScores || {}).map(([factor, score]) => (
                          <div key={factor} className="flex justify-between">
                            <span>{factor}:</span>
                            <span className="font-semibold">{score}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-right">
                        <button
                          className="text-primary hover:underline text-sm"
                          onClick={() => {
                            // Navigate to methodology section and load this assessment
                            const methodologySection = document.getElementById('methodology-section');
                            if (methodologySection) {
                              methodologySection.scrollIntoView({ behavior: 'smooth' });
                              // Here you would normally trigger loading this assessment in the methodology component
                            }
                          }}
                        >
                          View & Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };
  
  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Account</h2>
      
      <div className="max-w-md mx-auto">
        {/* Display errors and success messages */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}
        
        {authSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {authSuccess}
          </div>
        )}
        
        <div className="card p-6">
          {!isLoggedIn ? (
            <>
              {activeView === 'login' && renderLoginForm()}
              {activeView === 'register' && renderRegisterForm()}
              {activeView === 'reset' && renderPasswordResetForm()}
            </>
          ) : (
            <>
              {activeView === 'profile' && renderUserProfile()}
              {activeView === 'assessments' && renderUserAssessments()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuth; 