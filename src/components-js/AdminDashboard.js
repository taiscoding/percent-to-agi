import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../../utils/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { getCurrentUserWithProfile } from '../../utils/auth';

const AdminDashboard = () => {
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scoring');
  
  // Data states
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [scoringParams, setScoringParams] = useState({
    dimensionWeights: {
      'Benchmark Performance': 25,
      'Transfer Learning': 20,
      'Reasoning Capabilities': 25,
      'Embodied Intelligence': 15,
      'Social Intelligence': 15
    },
    dimensionBaselines: {
      'Benchmark Performance': 65,
      'Transfer Learning': 40,
      'Reasoning Capabilities': 30,
      'Embodied Intelligence': 20,
      'Social Intelligence': 25
    }
  });
  
  // Engagement metrics
  const [engagementMetrics, setEngagementMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAssessments: 0,
    totalArticles: 0,
    averageScore: 0
  });
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  
  // Check if current user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUserWithProfile();
        
        if (currentUser && currentUser.profile && currentUser.profile.role === 'admin') {
          setIsAdmin(true);
          fetchAdminData();
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, []);
  
  // Fetch all admin data
  const fetchAdminData = async () => {
    try {
      await Promise.all([
        fetchArticles(),
        fetchUsers(),
        fetchScoringParams(),
        fetchEngagementMetrics()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setActionError('Failed to load some admin data. Please try refreshing the page.');
    }
  };
  
  // Fetch articles
  const fetchArticles = async () => {
    try {
      const q = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const articlesList = [];
      
      snapshot.forEach(doc => {
        articlesList.push({ id: doc.id, ...doc.data() });
      });
      
      setArticles(articlesList);
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  };
  
  // Fetch users
  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('lastLogin', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const usersList = [];
      
      snapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  
  // Fetch scoring parameters
  const fetchScoringParams = async () => {
    try {
      const docRef = doc(db, 'config', 'scoring');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setScoringParams(docSnap.data());
      } else {
        // If document doesn't exist, create it with default values
        await setDoc(docRef, scoringParams);
      }
    } catch (error) {
      console.error('Error fetching scoring parameters:', error);
      throw error;
    }
  };
  
  // Fetch engagement metrics
  const fetchEngagementMetrics = async () => {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Get active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsersQuery = query(
        collection(db, 'users'),
        where('lastLogin', '>=', thirtyDaysAgo)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;
      
      // Get total assessments
      const assessmentsSnapshot = await getDocs(collection(db, 'assessments'));
      const totalAssessments = assessmentsSnapshot.size;
      
      // Get total articles
      const articlesSnapshot = await getDocs(collection(db, 'articles'));
      const totalArticles = articlesSnapshot.size;
      
      // Calculate average score
      let scoreSum = 0;
      assessmentsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.overallPercentage) {
          scoreSum += parseFloat(data.overallPercentage);
        }
      });
      
      const averageScore = totalAssessments > 0 
        ? (scoreSum / totalAssessments).toFixed(1) 
        : 0;
      
      setEngagementMetrics({
        totalUsers,
        activeUsers,
        totalAssessments,
        totalArticles,
        averageScore
      });
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      throw error;
    }
  };
  
  // Handle saving scoring parameters
  const handleSaveScoringParams = async () => {
    setIsSaving(true);
    setActionSuccess(null);
    setActionError(null);
    
    try {
      const docRef = doc(db, 'config', 'scoring');
      await updateDoc(docRef, scoringParams);
      
      setActionSuccess('Scoring parameters updated successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating scoring parameters:', error);
      setActionError('Failed to update scoring parameters: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle weight change
  const handleWeightChange = (dimension, value) => {
    setScoringParams(prev => ({
      ...prev,
      dimensionWeights: {
        ...prev.dimensionWeights,
        [dimension]: parseInt(value)
      }
    }));
  };
  
  // Handle baseline change
  const handleBaselineChange = (dimension, value) => {
    setScoringParams(prev => ({
      ...prev,
      dimensionBaselines: {
        ...prev.dimensionBaselines,
        [dimension]: parseInt(value)
      }
    }));
  };
  
  // Handle featuring an article
  const handleFeatureArticle = async (articleId, featured) => {
    setActionSuccess(null);
    setActionError(null);
    
    try {
      const docRef = doc(db, 'articles', articleId);
      await updateDoc(docRef, { featured });
      
      // Update local state
      setArticles(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { ...article, featured } 
            : article
        )
      );
      
      setActionSuccess(`Article ${featured ? 'featured' : 'unfeatured'} successfully`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      console.error('Error featuring article:', error);
      setActionError('Failed to update article: ' + error.message);
    }
  };
  
  // Handle deleting an article
  const handleDeleteArticle = async (articleId) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    
    setActionSuccess(null);
    setActionError(null);
    
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      
      // Update local state
      setArticles(prev => prev.filter(article => article.id !== articleId));
      
      setActionSuccess('Article deleted successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting article:', error);
      setActionError('Failed to delete article: ' + error.message);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render unauthorized state
  if (!isAdmin) {
    return (
      <div className="mt-16 mb-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded inline-block">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      
      {/* Success & Error Messages */}
      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {actionSuccess}
        </div>
      )}
      
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {actionError}
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex overflow-x-auto space-x-2">
          <button
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'metrics'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('metrics')}
          >
            Engagement Metrics
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'scoring'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('scoring')}
          >
            Scoring System
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'articles'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t-lg ${
              activeTab === 'users'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white p-6 border rounded-lg">
        {/* Engagement Metrics Tab */}
        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">Engagement Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Total Users</div>
                <div className="text-3xl font-bold">{engagementMetrics.totalUsers}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {engagementMetrics.activeUsers} active in last 30 days
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Total Assessments</div>
                <div className="text-3xl font-bold">{engagementMetrics.totalAssessments}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Avg score: {engagementMetrics.averageScore}%
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Total Articles</div>
                <div className="text-3xl font-bold">{engagementMetrics.totalArticles}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Submitted by users
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                className="btn btn-primary"
                onClick={fetchEngagementMetrics}
              >
                Refresh Metrics
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Scoring System Tab */}
        {activeTab === 'scoring' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">Scoring System Parameters</h3>
            
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Dimension Weights</h4>
              <p className="text-sm text-gray-600 mb-4">
                Adjust the weight of each dimension in the overall AGI percentage calculation.
                Total should equal 100%.
              </p>
              
              <div className="space-y-4">
                {Object.entries(scoringParams.dimensionWeights).map(([dimension, weight]) => (
                  <div key={dimension} className="flex items-center">
                    <label className="w-48">{dimension}:</label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={weight}
                      onChange={(e) => handleWeightChange(dimension, e.target.value)}
                      className="w-48 mr-3"
                    />
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={weight}
                      onChange={(e) => handleWeightChange(dimension, e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <span className="ml-1">%</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-sm">
                Total: {Object.values(scoringParams.dimensionWeights).reduce((sum, val) => sum + val, 0)}%
                {Object.values(scoringParams.dimensionWeights).reduce((sum, val) => sum + val, 0) !== 100 && (
                  <span className="text-red-500 ml-2">Should equal 100%</span>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Current Baselines</h4>
              <p className="text-sm text-gray-600 mb-4">
                Set the current base score for each dimension (0-100%). These will be the default values shown to users.
              </p>
              
              <div className="space-y-4">
                {Object.entries(scoringParams.dimensionBaselines).map(([dimension, baseline]) => (
                  <div key={dimension} className="flex items-center">
                    <label className="w-48">{dimension}:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={baseline}
                      onChange={(e) => handleBaselineChange(dimension, e.target.value)}
                      className="w-48 mr-3"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={baseline}
                      onChange={(e) => handleBaselineChange(dimension, e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <span className="ml-1">%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <button
                className="btn btn-primary"
                onClick={handleSaveScoringParams}
                disabled={
                  isSaving || 
                  Object.values(scoringParams.dimensionWeights).reduce((sum, val) => sum + val, 0) !== 100
                }
              >
                {isSaving ? 'Saving...' : 'Save Parameters'}
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">Manage Articles</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">
                        No articles found
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id}>
                        <td className="py-3 px-3">
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {article.title}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {article.submitterName || 'Anonymous'}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {article.votes || 0}
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {article.createdAt ? new Date(article.createdAt.toDate?.() || article.createdAt).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="py-3 px-3 text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleFeatureArticle(article.id, !article.featured)}
                            className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                              article.featured
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {article.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="inline-block px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">User Management</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 px-3">
                          <div className="font-medium text-gray-900">
                            {user.displayName || 'No name'}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="py-3 px-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin.toDate?.() || user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 