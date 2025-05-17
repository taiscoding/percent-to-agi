import { db } from '../../utils/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Try to fetch timeline events from Firestore
      const timelineRef = collection(db, 'timeline');
      const q = query(timelineRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      // If we have events in Firestore, return them
      if (!querySnapshot.empty) {
        const events = [];
        querySnapshot.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() });
        });
        return res.status(200).json({ events });
      }
      
      // Otherwise return our fallback data
      const fallbackEvents = [
        {
          id: "1",
          title: "Dartmouth Workshop",
          date: "1956-08-31",
          description: "The Dartmouth Summer Research Project on Artificial Intelligence coined the term 'artificial intelligence'.",
          category: "Foundational",
          impact: 10,
          references: ["https://en.wikipedia.org/wiki/Dartmouth_Workshop"],
          media: "https://upload.wikimedia.org/wikipedia/en/b/b5/Dartmouth_workshop.jpg"
        },
        {
          id: "2",
          title: "Perceptron",
          date: "1958-01-01",
          description: "Frank Rosenblatt develops the perceptron, the first machine learning algorithm.",
          category: "Algorithm",
          impact: 8,
          references: ["https://en.wikipedia.org/wiki/Perceptron"],
          media: null
        },
        {
          id: "3",
          title: "IBM Deep Blue Defeats Kasparov",
          date: "1997-05-11",
          description: "IBM's Deep Blue defeats world chess champion Garry Kasparov, marking the first time a computer defeated a world chess champion.",
          category: "Milestone",
          impact: 7,
          references: ["https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)"],
          media: "https://upload.wikimedia.org/wikipedia/commons/b/be/Deep_Blue.jpg"
        },
        {
          id: "4",
          title: "ImageNet and AlexNet",
          date: "2012-09-30",
          description: "AlexNet wins the ImageNet competition, reducing error rates significantly and sparking the deep learning revolution.",
          category: "Milestone",
          impact: 9,
          references: ["https://papers.nips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf"],
          media: null
        },
        {
          id: "5",
          title: "DeepMind's AlphaGo Defeats Lee Sedol",
          date: "2016-03-15",
          description: "Google DeepMind's AlphaGo defeats world champion Lee Sedol in the complex board game Go, a milestone many thought was decades away.",
          category: "Milestone",
          impact: 9,
          references: ["https://deepmind.com/research/case-studies/alphago-the-story-so-far"],
          media: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/AlphaGo_versus_Lee_Sedol.jpg/1200px-AlphaGo_versus_Lee_Sedol.jpg"
        },
        {
          id: "6",
          title: "Transformer Architecture",
          date: "2017-06-12",
          description: "Google introduces the Transformer architecture in 'Attention Is All You Need', revolutionizing natural language processing.",
          category: "Algorithm",
          impact: 10,
          references: ["https://arxiv.org/abs/1706.03762"],
          media: null
        },
        {
          id: "7",
          title: "GPT-3 Release",
          date: "2020-06-11",
          description: "OpenAI releases GPT-3, demonstrating unprecedented language capabilities and few-shot learning.",
          category: "Model",
          impact: 9,
          references: ["https://arxiv.org/abs/2005.14165"],
          media: null
        },
        {
          id: "8",
          title: "DALL-E",
          date: "2021-01-05",
          description: "OpenAI introduces DALL-E, generating images from text descriptions and showing strong multimodal capabilities.",
          category: "Model",
          impact: 8,
          references: ["https://openai.com/blog/dall-e/"],
          media: "https://openai.com/content/images/2021/01/dall-e-teaser.jpg"
        },
        {
          id: "9",
          title: "AlphaFold 2",
          date: "2021-07-15",
          description: "DeepMind's AlphaFold 2 solves the protein folding problem, a major breakthrough in computational biology.",
          category: "Scientific",
          impact: 10,
          references: ["https://www.nature.com/articles/s41586-021-03819-2"],
          media: null
        },
        {
          id: "10",
          title: "ChatGPT Launch",
          date: "2022-11-30",
          description: "OpenAI releases ChatGPT, bringing conversational AI to the mainstream and reaching 100 million users within months.",
          category: "Product",
          impact: 9,
          references: ["https://openai.com/blog/chatgpt"],
          media: null
        },
        {
          id: "11",
          title: "GPT-4 Release",
          date: "2023-03-14",
          description: "OpenAI releases GPT-4 with improved reasoning, reduced hallucinations, and multimodal capabilities.",
          category: "Model",
          impact: 9,
          references: ["https://openai.com/research/gpt-4"],
          media: null
        },
        {
          id: "12",
          title: "Claude 3 Release",
          date: "2024-03-04",
          description: "Anthropic releases Claude 3 model family, with improved reasoning and safety capabilities.",
          category: "Model",
          impact: 8,
          references: ["https://www.anthropic.com/news/claude-3-family"],
          media: null
        }
      ];
      
      return res.status(200).json({ events: fallbackEvents });
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      return res.status(500).json({ error: 'Failed to fetch timeline events' });
    }
  } else {
    // Handle POST requests to add new timeline events (if authenticated)
    if (req.method === 'POST') {
      // Add authentication check here
      
      return res.status(405).json({ error: 'Method not allowed - authentication required' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 