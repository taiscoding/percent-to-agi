import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fetchAINews } from '../../utils/newsService';
import { saveArticle, getRecentArticles, voteOnArticle } from '../../utils/assessmentService';
import { agiScorer } from '../../utils/agiScorer';
import { auth } from '../../utils/firebase';
import { onAuthStateChange } from '../../utils/auth';

const EnhancedNewsAggregator = () => {
  // State for news articles
  const [newsArticles, setNewsArticles] = useState([]);
  const [userSubmittedArticles, setUserSubmittedArticles] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);
  
  // State for article submission
  const [articleTitle, setArticleTitle] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // State for user
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for displaying articles
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch news articles on component mount
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoadingNews(true);
      try {
        // Fetch news from API
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`News API error: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setNewsArticles(data.articles);
        } else {
          throw new Error(data.error || 'Failed to fetch news');
        }
        
        // Fetch user-submitted articles
        const userArticles = await getRecentArticles(20);
        if (userArticles.success) {
          setUserSubmittedArticles(userArticles.articles);
        }
      } catch (error) {
        console.error('Error loading news:', error);
        setNewsError(error.message);
        
        // Use mock data in development
        if (process.env.NODE_ENV === 'development') {
          setNewsArticles(getMockNewsArticles());
          setUserSubmittedArticles(getMockUserArticles());
        }
      } finally {
        setIsLoadingNews(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // Handle article submission
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    
    if (!articleTitle || !articleUrl || !articleContent) {
      alert('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Assess the article's AGI impact using GPT
      const assessmentResult = await agiScorer(articleContent);
      
      // Save the article with the assessment
      const userId = currentUser ? currentUser.uid : 'anonymous';
      const articleData = {
        title: articleTitle,
        url: articleUrl,
        content: articleContent,
        assessment: assessmentResult,
        submittedBy: userId,
        submitterName: currentUser?.displayName || 'Anonymous User',
        submissionDate: new Date().toISOString()
      };
      
      const saveResult = await saveArticle(articleData, userId);
      
      if (saveResult.success) {
        setSubmitSuccess(true);
        // Clear form
        setArticleTitle('');
        setArticleUrl('');
        setArticleContent('');
        
        // Add to displayed articles
        setUserSubmittedArticles(prev => [
          {
            id: saveResult.id,
            ...articleData
          },
          ...prev
        ]);
        
        // Switch to user articles tab
        setActiveTab('user');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to save article');
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Error submitting article: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle article assessment
  const handleAssessArticle = async (article) => {
    if (!article.content && !article.description) {
      alert('No content available to assess');
      return;
    }
    
    setSelectedArticle(article);
    setIsAssessing(true);
    
    try {
      // Use the article content if available, otherwise use the description
      const textToAssess = article.content || article.description;
      const result = await agiScorer(textToAssess);
      
      setAssessmentResult(result);
    } catch (error) {
      console.error('Error assessing article:', error);
      setAssessmentResult({ error: error.message });
    } finally {
      setIsAssessing(false);
    }
  };
  
  // Handle vote on article
  const handleVote = async (articleId, voteValue) => {
    if (!currentUser) {
      alert('Please sign in to vote');
      return;
    }
    
    try {
      const result = await voteOnArticle(articleId, currentUser.uid, voteValue);
      
      if (result.success) {
        // Update local state to reflect the vote
        setUserSubmittedArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { 
                  ...article, 
                  votes: article.votes + voteValue,
                  voters: [...(article.voters || []), currentUser.uid] 
                }
              : article
          )
        );
      } else {
        throw new Error(result.error || 'Failed to register vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting: ' + error.message);
    }
  };
  
  // Render article card
  const renderArticleCard = (article, index, type) => {
    const isUserArticle = type === 'user';
    const publishDate = isUserArticle 
      ? article.submissionDate 
      : article.publishedAt;
    
    const formattedDate = format(
      new Date(publishDate), 
      'MMM d, yyyy'
    );
    
    const hasVoted = isUserArticle && currentUser && 
      article.voters && article.voters.includes(currentUser.uid);
    
    return (
      <motion.div 
        key={article.id || index}
        className="card p-4 mb-4" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="flex items-start">
          {article.urlToImage && (
            <div className="flex-shrink-0 mr-4 w-24 h-24 overflow-hidden rounded">
              <img 
                src={article.urlToImage} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-1">{article.title}</h3>
            
            <div className="text-sm text-gray-500 mb-2">
              {isUserArticle ? (
                <span>Submitted by {article.submitterName} on {formattedDate}</span>
              ) : (
                <span>
                  {article.source?.name || 'Unknown Source'} • {formattedDate}
                </span>
              )}
            </div>
            
            <p className="text-sm mb-3">{article.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary mr-2"
                >
                  Read Full Article
                </a>
                
                <button
                  onClick={() => handleAssessArticle(article)}
                  className="btn btn-sm btn-secondary"
                >
                  Assess AGI Impact
                </button>
              </div>
              
              {isUserArticle && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(article.id, 1)}
                    disabled={hasVoted}
                    className={`p-1 rounded ${hasVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    title={hasVoted ? 'You already voted' : 'Upvote this article'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                    </svg>
                  </button>
                  
                  <span className="font-semibold">{article.votes || 0}</span>
                  
                  <button
                    onClick={() => handleVote(article.id, -1)}
                    disabled={hasVoted}
                    className={`p-1 rounded ${hasVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    title={hasVoted ? 'You already voted' : 'Downvote this article'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Render assessment modal
  const renderAssessmentModal = () => {
    if (!selectedArticle) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
              <button 
                onClick={() => {
                  setSelectedArticle(null);
                  setAssessmentResult(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isAssessing ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3">Analyzing AGI impact...</span>
              </div>
            ) : assessmentResult ? (
              <div>
                <h3 className="font-semibold mb-2">AGI Impact Assessment:</h3>
                
                {assessmentResult.error ? (
                  <div className="text-red-500 mb-4">
                    Error: {assessmentResult.error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(assessmentResult)
                        .filter(([key]) => ['Benchmark Performance', 'Transfer Learning', 'Reasoning Capabilities', 'Embodied Intelligence', 'Social Intelligence'].includes(key))
                        .map(([dimension, score]) => (
                          <div key={dimension} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium mb-1">{dimension}</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-semibold">{score}%</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Overall AGI Progress Impact:</h4>
                      <div className="text-lg">
                        {calculateOverallImpact(assessmentResult).toFixed(1)}%
                      </div>
                    </div>
                    
                    {/* If there are any additional comments in the assessment */}
                    {assessmentResult.comments && (
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold mb-2">Analysis:</h4>
                        <p>{assessmentResult.comments}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No assessment data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Calculate overall impact from dimensions
  const calculateOverallImpact = (assessment) => {
    if (!assessment) return 0;
    
    const dimensions = [
      'Benchmark Performance',
      'Transfer Learning',
      'Reasoning Capabilities',
      'Embodied Intelligence',
      'Social Intelligence'
    ];
    
    const weights = {
      'Benchmark Performance': 25,
      'Transfer Learning': 20,
      'Reasoning Capabilities': 25,
      'Embodied Intelligence': 15,
      'Social Intelligence': 15
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    dimensions.forEach(dim => {
      if (assessment[dim] !== undefined) {
        weightedSum += assessment[dim] * weights[dim];
        totalWeight += weights[dim];
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };
  
  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">AI Breakthrough News</h2>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'recent'
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark hover:bg-gray-100'
                } rounded-l-lg border border-gray-200`}
              >
                Recent News
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark hover:bg-gray-100'
                } rounded-r-lg border border-gray-200`}
              >
                Community Submissions
              </button>
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className="btn btn-primary"
              >
                Submit Article
              </button>
            </div>
          </div>
          
          {activeTab === 'submit' && (
            <div className="card p-6 mb-4">
              <h3 className="text-xl font-semibold mb-4">Submit an AI Breakthrough Article</h3>
              
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  Article submitted successfully! Your AGI impact assessment has been generated.
                </div>
              )}
              
              <form onSubmit={handleArticleSubmit}>
                <div className="mb-4">
                  <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    id="articleTitle"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="articleUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Article URL
                  </label>
                  <input
                    type="url"
                    id="articleUrl"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="articleContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Article Content or Summary
                  </label>
                  <textarea
                    id="articleContent"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Paste the article content or a detailed summary here. This text will be used to assess the article's impact on AGI progress."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Article'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div>
              {isLoadingNews ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-2">Loading latest AI news...</p>
                </div>
              ) : newsError ? (
                <div className="text-center text-red-500 py-10">
                  Error loading news: {newsError}
                </div>
              ) : (
                <div>
                  {newsArticles.length === 0 ? (
                    <p className="text-center py-10">No news articles found</p>
                  ) : (
                    newsArticles.map((article, index) => 
                      renderArticleCard(article, index, 'news')
                    )
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'user' && (
            <div>
              {isLoadingNews ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-2">Loading community submissions...</p>
                </div>
              ) : (
                <div>
                  {userSubmittedArticles.length === 0 ? (
                    <div className="text-center py-10">
                      <p>No community submissions yet</p>
                      <button
                        className="btn btn-outline-primary mt-4"
                        onClick={() => setActiveTab('submit')}
                      >
                        Be the first to submit an article
                      </button>
                    </div>
                  ) : (
                    userSubmittedArticles.map((article, index) => 
                      renderArticleCard(article, index, 'user')
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {selectedArticle && renderAssessmentModal()}
    </div>
  );
};

// Mock data for development
const getMockNewsArticles = () => {
  return [
    {
      title: 'OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities',
      description: 'The new language model demonstrates superior performance on mathematical and logical reasoning tasks, closing the gap to artificial general intelligence.',
      url: 'https://example.com/openai-gpt5',
      urlToImage: 'https://via.placeholder.com/600x400?text=GPT-5+Announcement',
      publishedAt: '2023-06-15T09:45:00Z',
      source: { name: 'AI Research Journal' },
      author: 'Dr. Sarah Chen',
      content: 'OpenAI has announced GPT-5, their latest language model with significant improvements in reasoning capabilities...'
    },
    {
      title: "DeepMind's New Multi-Modal System Shows Human-Level Transfer Learning",
      description: 'Researchers at DeepMind have developed a system that can apply knowledge gained in one domain to entirely different tasks.',
      url: 'https://example.com/deepmind-transfer-learning',
      urlToImage: 'https://via.placeholder.com/600x400?text=DeepMind+Transfer+Learning',
      publishedAt: '2023-06-12T14:30:00Z',
      source: { name: 'Tech Insights' },
      author: 'James Wilson',
      content: 'In a breakthrough for transfer learning, DeepMind has announced a new AI system capable of...'
    }
  ];
};

const getMockUserArticles = () => {
  return [
    {
      id: 'mock-article-1',
      title: 'Stanford Researchers Create Robot That Learns Physical Tasks from Watching Humans Once',
      description: 'A new embodied AI system can observe a human performing a physical task just once and then replicate it with high accuracy.',
      url: 'https://example.com/stanford-robot-learning',
      submitterName: 'AIEnthusiast',
      submissionDate: '2023-06-08T10:30:00Z',
      votes: 12,
      voters: [],
      assessment: {
        'Benchmark Performance': 65,
        'Transfer Learning': 80,
        'Reasoning Capabilities': 45,
        'Embodied Intelligence': 85,
        'Social Intelligence': 30
      }
    },
    {
      id: 'mock-article-2',
      title: 'New Benchmark Suite Aims to Measure Progress Toward AGI',
      description: 'A collaboration between major AI labs has produced a comprehensive benchmark suite for evaluating progress toward artificial general intelligence.',
      url: 'https://example.com/agi-benchmark',
      submitterName: 'ResearchFan',
      submissionDate: '2023-06-05T15:20:00Z',
      votes: 8,
      voters: [],
      assessment: {
        'Benchmark Performance': 90,
        'Transfer Learning': 60,
        'Reasoning Capabilities': 75,
        'Embodied Intelligence': 40,
        'Social Intelligence': 50
      }
    }
  ];
};

export default EnhancedNewsAggregator; 