'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample expert opinions data
const expertQuotes = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'AI Research Director, TechFuture Institute',
    quote: 'We\'re seeing exponential progress in language understanding and reasoning capabilities. I believe we\'re approximately 35-40% of the way to AGI, with the most challenging aspects of consciousness and general physical world understanding still largely unsolved.',
    image: '/experts/sarah.jpg',
    estimatedPercentage: 37,
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    title: 'Computational Neuroscience, Stanford University',
    quote: 'The gap between current AI and human cognition is still substantial. We\'ve made impressive strides in narrow domains, but the integration of different cognitive capabilities and true transfer learning remains elusive. I\'d put us at about 30% of the journey.',
    image: '/experts/michael.jpg',
    estimatedPercentage: 30,
  },
  {
    id: 3,
    name: 'Dr. Aisha Patel',
    title: 'Lead AI Ethicist, Global AI Consortium',
    quote: 'From a capabilities perspective, we\'re closer to AGI than many realize—perhaps 50-60% there. The remaining challenges aren\'t just technical but conceptual: we need new frameworks for understanding how to integrate disparate AI abilities into a coherent whole.',
    image: '/experts/aisha.jpg',
    estimatedPercentage: 55,
  },
  {
    id: 4,
    name: 'Dr. James Rodriguez',
    title: 'Chief Scientist, Quantum AI Labs',
    quote: 'I\'m optimistic about our trajectory. Current large models exhibit emergent abilities that surprise even their creators. With proper scaling and architectural innovations, I believe we\'re about 45% of the way there, with a reasonable chance of reaching AGI within two decades.',
    image: '/experts/james.jpg',
    estimatedPercentage: 45,
  },
  {
    id: 5,
    name: 'Prof. Emma Wilson',
    title: 'Cognitive Systems Research, MIT',
    quote: 'The harder we push toward AGI, the more we realize how much we don\'t understand about human intelligence. I\'d estimate we\'re around 25% of the way there, with fundamental breakthroughs in causal reasoning and embodied cognition still needed.',
    image: '/experts/emma.jpg',
    estimatedPercentage: 25,
  },
  {
    id: 6,
    name: 'Dr. Hiroshi Tanaka',
    title: 'Robotics & AI Integration, Tokyo Institute of Technology',
    quote: 'The embodiment problem—connecting AI to the physical world—is significantly underestimated. Pure computational approaches might reach 70-80% of AGI capabilities, but the final steps involving physical world grounding may be the most difficult. Overall, I\'d say we\'re at about 40%.',
    image: '/experts/hiroshi.jpg',
    estimatedPercentage: 40,
  },
];

const ExpertOpinions = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Auto-rotate through experts every 10 seconds if autoplay is enabled
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % expertQuotes.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  const activeExpert = expertQuotes[activeIndex];
  
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
  };
  
  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + expertQuotes.length) % expertQuotes.length);
    setAutoplay(false);
  };
  
  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % expertQuotes.length);
    setAutoplay(false);
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Expert Opinions</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold mb-6">What the Experts Say</h3>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={() => setAutoplay(!autoplay)}
            className={`p-2 rounded-full ${autoplay ? 'bg-primary text-white' : 'bg-gray-200'}`}
            title={autoplay ? "Pause autoplay" : "Enable autoplay"}
          >
            {autoplay ? "⏸" : "▶️"}
          </button>
        </div>
        
        {/* Expert carousel */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExpert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-gray-50 rounded-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-3xl overflow-hidden">
                    {/* In a real app, this would be an actual image */}
                    👤
                  </div>
                </div>
                
                <div className="md:w-3/4">
                  <blockquote className="text-lg italic mb-4">
                    "{activeExpert.quote}"
                  </blockquote>
                  
                  <div className="mt-4">
                    <div className="font-semibold">{activeExpert.name}</div>
                    <div className="text-sm text-gray-600">{activeExpert.title}</div>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <span className="text-sm font-medium mr-3">Their AGI estimate:</span>
                    <div className="bg-gray-200 h-2 flex-grow rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${activeExpert.estimatedPercentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 font-bold text-primary">{activeExpert.estimatedPercentage}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10"
          >
            ←
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10"
          >
            →
          </button>
        </div>
        
        {/* Indicator dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {expertQuotes.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            These opinions represent individual perspectives from experts in the field and do not constitute a scientific consensus.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpertOpinions; 