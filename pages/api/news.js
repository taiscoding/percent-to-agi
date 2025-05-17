import { fetchAINews } from '../../utils/newsService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract query parameters with defaults
    const days = parseInt(req.query.days) || 30;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Fetch news articles
    const newsData = await fetchAINews(days, pageSize);
    
    if (newsData.success) {
      return res.status(200).json(newsData);
    } else {
      return res.status(500).json({ error: newsData.error });
    }
  } catch (error) {
    console.error('Error in news API:', error);
    return res.status(500).json({ error: 'Error fetching news articles' });
  }
} 