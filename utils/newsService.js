import NewsAPI from 'newsapi';
import { format, subDays } from 'date-fns';

// Initialize NewsAPI with your API key
const newsapi = process.env.NEXT_PUBLIC_NEWS_API_KEY ? new NewsAPI(process.env.NEXT_PUBLIC_NEWS_API_KEY) : null;

/**
 * Fetch recent AI-related news articles
 * @param {number} days - Number of days back to search (default: 30)
 * @param {number} pageSize - Number of articles to return (default: 10)
 * @returns {Promise<Object>} - Object containing articles and status
 */
export const fetchAINews = async (days = 30, pageSize = 10) => {
  try {
    // Check if News API key is configured
    if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      console.warn('News API key is missing. Returning mock data.');
      return { 
        success: true, 
        articles: getMockNewsArticles(),
        totalResults: getMockNewsArticles().length,
        isMock: true
      };
    }

    const today = new Date();
    const fromDate = subDays(today, days);
    
    const formattedToday = format(today, 'yyyy-MM-dd');
    const formattedFromDate = format(fromDate, 'yyyy-MM-dd');
    
    // Define AI and AGI related search terms
    const searchTerms = [
      '"artificial general intelligence"',
      '"AGI development"',
      '"deep learning breakthrough"',
      '"neural network advance"',
      '"AI research milestone"',
      '"machine learning progress"',
      '"reinforcement learning breakthrough"',
      '"large language model"',
      '"transformative AI"',
      '"AI capabilities"'
    ];
    
    // Create a combined query string with OR operator
    const query = searchTerms.join(' OR ');
    
    const response = await newsapi.v2.everything({
      q: query,
      from: formattedFromDate,
      to: formattedToday,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: pageSize,
      page: 1
    });
    
    if (response.status === 'ok') {
      // Process and filter articles to ensure relevance
      const filteredArticles = response.articles.filter(article => 
        article.title && 
        article.description && 
        article.url && 
        article.urlToImage
      );
      
      return { 
        success: true, 
        articles: filteredArticles,
        totalResults: response.totalResults
      };
    } else {
      throw new Error('Failed to fetch news: ' + response.status);
    }
  } catch (error) {
    console.error('Error fetching AI news:', error);
    
    // Return mock data if in development environment or API fails
    if (process.env.NODE_ENV === 'development' || error.message.includes('401')) {
      return { 
        success: true, 
        articles: getMockNewsArticles(),
        totalResults: getMockNewsArticles().length,
        isMock: true
      };
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Generate mock news articles for development
 * @returns {Array} - Array of mock news articles
 */
const getMockNewsArticles = () => {
  return [
    {
      source: {
        id: null,
        name: 'AI Research Journal'
      },
      author: 'Dr. Sarah Chen',
      title: 'OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities',
      description: 'The new language model demonstrates superior performance on mathematical and logical reasoning tasks, closing the gap to artificial general intelligence.',
      url: 'https://example.com/openai-gpt5',
      urlToImage: 'https://via.placeholder.com/600x400?text=GPT-5+Announcement',
      publishedAt: '2023-06-15T09:45:00Z',
      content: 'OpenAI has announced GPT-5, their latest language model with significant improvements in reasoning capabilities...'
    },
    {
      source: {
        id: null,
        name: 'Tech Insights'
      },
      author: 'James Wilson',
      title: "DeepMind's New Multi-Modal System Shows Human-Level Transfer Learning",
      description: 'Researchers at DeepMind have developed a system that can apply knowledge gained in one domain to entirely different tasks.',
      url: 'https://example.com/deepmind-transfer-learning',
      urlToImage: 'https://via.placeholder.com/600x400?text=DeepMind+Transfer+Learning',
      publishedAt: '2023-06-12T14:30:00Z',
      content: 'In a breakthrough for transfer learning, DeepMind has announced a new AI system capable of...'
    },
    {
      source: {
        id: null,
        name: 'AI Progress Report'
      },
      author: 'Maria Rodriguez',
      title: 'Stanford Researchers Create Robot That Learns Physical Tasks from Watching Humans Once',
      description: 'A new embodied AI system can observe a human performing a physical task just once and then replicate it with high accuracy.',
      url: 'https://example.com/stanford-robot-learning',
      urlToImage: 'https://via.placeholder.com/600x400?text=Robot+Learning',
      publishedAt: '2023-06-10T11:15:00Z',
      content: "Stanford's Robotics Lab has demonstrated a new robot capable of one-shot imitation learning..."
    },
    {
      source: {
        id: null,
        name: 'Future of Intelligence'
      },
      author: 'Dr. Michael Chang',
      title: 'New Benchmark Suite Aims to Measure Progress Toward AGI',
      description: 'A collaboration between major AI labs has produced a comprehensive benchmark suite for evaluating progress toward artificial general intelligence.',
      url: 'https://example.com/agi-benchmark',
      urlToImage: 'https://via.placeholder.com/600x400?text=AGI+Benchmark',
      publishedAt: '2023-06-08T16:20:00Z',
      content: 'Researchers from leading AI labs have collaborated to create a new benchmark suite specifically designed to measure...'
    },
    {
      source: {
        id: null,
        name: 'AI Ethics Institute'
      },
      author: 'Emma Johnson',
      title: 'Researchers Develop AI with Improved Social Intelligence',
      description: 'A new model demonstrates advanced understanding of human emotions and social dynamics, a key component for AGI development.',
      url: 'https://example.com/social-intelligence-ai',
      urlToImage: 'https://via.placeholder.com/600x400?text=Social+Intelligence+AI',
      publishedAt: '2023-06-05T08:50:00Z',
      content: 'A team of researchers has developed an AI system with significantly improved social intelligence...'
    }
  ];
}; 