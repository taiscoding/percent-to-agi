import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SocialSharing = ({ percentage }) => {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [localSubmissions, setLocalSubmissions] = useState([]);
  const [averageEstimate, setAverageEstimate] = useState(null);

  useEffect(() => {
    // Generate share link when percentage changes
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?estimate=${percentage}`;
    setShareLink(link);

    // Check URL for shared estimate on initial load
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlEstimate = urlParams.get('estimate');
      if (urlEstimate) {
        // You could use this to initialize a state or highlight something
        console.log('Shared estimate detected:', urlEstimate);
      }
    }

    // Load existing submissions from localStorage
    const savedSubmissions = localStorage.getItem('agiSubmissions');
    if (savedSubmissions) {
      const parsedSubmissions = JSON.parse(savedSubmissions);
      setLocalSubmissions(parsedSubmissions);
      
      // Calculate average
      if (parsedSubmissions.length > 0) {
        const sum = parsedSubmissions.reduce((acc, sub) => acc + parseFloat(sub.estimate), 0);
        setAverageEstimate((sum / parsedSubmissions.length).toFixed(1));
      }
    }
  }, [percentage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    const newSubmission = {
      username: username.trim(),
      estimate: percentage,
      timestamp: new Date().toISOString()
    };

    // Add to local state
    const updatedSubmissions = [...localSubmissions, newSubmission];
    setLocalSubmissions(updatedSubmissions);
    
    // Save to localStorage (in a real app, this would be a server API call)
    localStorage.setItem('agiSubmissions', JSON.stringify(updatedSubmissions));
    
    // Calculate new average
    const sum = updatedSubmissions.reduce((acc, sub) => acc + parseFloat(sub.estimate), 0);
    setAverageEstimate((sum / updatedSubmissions.length).toFixed(1));
    
    setSubmitted(true);
    setUsername('');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Share the Progress</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-4xl mx-auto p-6"
      >
        <div className="text-center mb-6">
          <p className="text-lg font-medium">
            Current AGI percentage: <span className="text-primary">{percentage}%</span>
          </p>
        </div>
        
        {/* Share Link Generator */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Share This Estimate</h3>
          <div className="flex">
            <input 
              type="text" 
              value={shareLink} 
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
            />
            <button 
              onClick={copyShareLink}
              className="bg-secondary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
            >
              {showCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Share this link with others to show them your AGI estimate.
          </p>
        </div>
        
        {/* Community Leaderboard */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Community Estimates</h3>
          
          {averageEstimate ? (
            <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
              <p className="text-sm text-gray-600">Community Average</p>
              <p className="text-3xl font-bold text-primary">{averageEstimate}%</p>
              <p className="text-sm text-gray-500">Based on {localSubmissions.length} submission{localSubmissions.length !== 1 ? 's' : ''}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">No submissions yet. Be the first!</p>
          )}
          
          {localSubmissions.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-medium text-sm grid grid-cols-3">
                <div>User</div>
                <div className="text-center">Estimate</div>
                <div className="text-right">Submitted</div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {localSubmissions.slice().reverse().map((sub, index) => (
                  <div 
                    key={index} 
                    className="px-4 py-2 border-t border-gray-200 grid grid-cols-3 text-sm"
                  >
                    <div className="font-medium truncate">{sub.username}</div>
                    <div className="text-center">{sub.estimate}%</div>
                    <div className="text-right text-gray-500">
                      {new Date(sub.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Submission Form */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Submit Your Estimate</h3>
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md"
            >
              <p>Thanks for submitting your estimate! Your contribution has been added to our community data.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-2 text-sm underline"
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Your Name or Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter a username to submit your estimate"
                  required
                />
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  You're submitting an estimate of <strong>{percentage}%</strong> progress to AGI.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Submit My Estimate
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SocialSharing; 