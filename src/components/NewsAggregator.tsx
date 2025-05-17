'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Sample news data - in a real app, this would come from an API
const newsItems = [
  {
    id: 1,
    title: 'Large Language Model Achieves Breakthrough in Mathematical Reasoning',
    source: 'AI Research Journal',
    date: '2024-05-15',
    impact: 'high',
    summary: 'A new LLM has demonstrated unprecedented mathematical reasoning capabilities, solving complex theorem proving tasks that were previously only solvable by expert mathematicians. This advance marks a significant step toward AGI\'s abstract reasoning goals.',
    url: '#',
    agiImpact: 3.2,
  },
  {
    id: 2,
    title: 'Multimodal AI System Demonstrates Advanced Causal Understanding',
    source: 'Tech Innovation Today',
    date: '2024-05-10',
    impact: 'high',
    summary: 'Researchers have developed a multimodal AI system that can understand causal relationships between events in videos and text, allowing it to make sophisticated predictions about physical and social outcomes in novel scenarios.',
    url: '#',
    agiImpact: 2.8,
  },
  {
    id: 3,
    title: 'Robot Learns Complex Physical Tasks Through Self-Supervised Exploration',
    source: 'Robotics Weekly',
    date: '2024-05-03',
    impact: 'medium',
    summary: 'A new robotic system has demonstrated the ability to learn complex manipulation tasks through self-supervised exploration, requiring minimal human intervention. The system combines large-scale reinforcement learning with physical world models.',
    url: '#',
    agiImpact: 1.7,
  },
  {
    id: 4,
    title: 'AI System Shows Improved Transfer Learning Across Multiple Domains',
    source: 'AI Frontiers',
    date: '2024-04-28',
    impact: 'medium',
    summary: 'Researchers have created an AI architecture that can more effectively transfer knowledge between different domains and tasks, showing human-competitive performance on tasks it wasn\'t explicitly trained for.',
    url: '#',
    agiImpact: 2.1,
  },
  {
    id: 5,
    title: 'New Neuromorphic Computing Platform Mimics Human Brain\'s Learning Efficiency',
    source: 'Computational Neuroscience Today',
    date: '2024-04-20',
    impact: 'medium',
    summary: 'A breakthrough in neuromorphic computing shows promising results for creating AI systems that learn with the efficiency of the human brain, potentially addressing one of the key limitations in current deep learning approaches.',
    url: '#',
    agiImpact: 1.5,
  },
  {
    id: 6,
    title: 'Open-Ended Learning Environment Allows AI to Develop Novel Problem-Solving Strategies',
    source: 'Emergent Intelligence Journal',
    date: '2024-04-12',
    impact: 'high',
    summary: 'A new open-ended learning environment has enabled AI agents to develop novel problem-solving strategies beyond their initial programming, showing signs of creative adaptation previously unseen in artificial systems.',
    url: '#',
    agiImpact: 2.6,
  },
];

const NewsAggregator = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredNews = filter === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.impact === filter);
  
  // Calculate the total AGI impact of recent breakthroughs
  const totalAgiImpact = newsItems.reduce((sum, item) => sum + item.agiImpact, 0);
  
  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Recent AI Breakthroughs</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Latest Research Updates</h3>
          
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'high' ? 'bg-accent text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('high')}
            >
              High Impact
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'medium' ? 'bg-secondary text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('medium')}
            >
              Medium Impact
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Cumulative AGI Impact:</span>
              <div className="text-2xl font-bold text-primary">{totalAgiImpact.toFixed(1)} points</div>
            </div>
            <div className="text-sm text-gray-600 max-w-xs text-right">
              This score represents the estimated cumulative impact of recent breakthroughs on AGI progress.
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-b pb-6"
            >
              <div className="flex justify-between mb-2">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  item.impact === 'high' 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  +{item.agiImpact.toFixed(1)} AGI points
                </span>
              </div>
              
              <div className="flex text-sm text-gray-600 mb-3">
                <span>{item.source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              
              <p className="text-gray-700 mb-3">
                {item.summary}
              </p>
              
              <a href={item.url} className="text-primary text-sm font-medium">
                Read full article →
              </a>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="btn btn-primary">
            Load More Research Updates
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsAggregator; 