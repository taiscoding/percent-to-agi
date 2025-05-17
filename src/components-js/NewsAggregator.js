import React from 'react';
import { motion } from 'framer-motion';

const NewsAggregator = () => {
  const newsItems = [
    {
      id: 1,
      title: "OpenAI Announces GPT-5 with Enhanced Reasoning Capabilities",
      summary: "OpenAI's latest model shows unprecedented abilities in complex problem-solving and contextual understanding, achieving human-level performance on 98% of benchmarks.",
      source: "AI News Today",
      date: "May 16, 2025",
      category: "Large Language Models",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      title: "DeepMind's AlphaFold 3 Solves Protein Interactions with 99.7% Accuracy",
      summary: "The newest iteration of AlphaFold can now predict complex protein-protein interactions with near-perfect accuracy, revolutionizing drug discovery and biomedical research.",
      source: "Science Daily",
      date: "May 12, 2025",
      category: "Scientific AI",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      title: "Neural Interface Breakthrough Allows Direct Brain-Computer Communication",
      summary: "Researchers at MIT have developed a non-invasive neural interface that enables bidirectional communication between humans and computers without physical input devices.",
      source: "Tech Chronicle",
      date: "May 7, 2025",
      category: "Neural Interfaces",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 4,
      title: "Autonomous AI System Makes Original Scientific Discovery in Materials Science",
      summary: "An AI system developed by researchers at Stanford has independently discovered a new class of materials with extraordinary properties, without human guidance.",
      source: "Innovation Weekly",
      date: "April 29, 2025",
      category: "Scientific AI",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 5,
      title: "Multimodal AI Achieves Breakthrough in Understanding Context Across Senses",
      summary: "A new multimodal system from Google AI can seamlessly integrate visual, auditory, and textual information to understand complex scenarios in ways never before possible.",
      source: "AI Insider",
      date: "April 22, 2025",
      category: "Multimodal AI",
      image: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Recent AI Breakthroughs</h2>
      <div className="max-w-4xl mx-auto">
        {newsItems.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card mb-6 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 p-4 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
              <div className="md:w-3/4 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-white bg-primary rounded-full px-3 py-1">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-3">{item.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Source: {item.source}</span>
                  <button className="btn btn-primary text-sm">Read More</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="text-center mt-8">
          <button className="btn btn-secondary">View More Breakthroughs</button>
        </div>
      </div>
    </div>
  );
};

export default NewsAggregator; 