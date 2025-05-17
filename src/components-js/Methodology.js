import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { agiScorer } from '../../utils/agiScorer';

const factors = [
  {
    name: 'Benchmark Performance',
    description: 'How AI systems perform on standardized benchmarks compared to humans',
    defaultWeight: 25,
    current: 65,
    tooltip: 'Measures how well AI systems perform on tasks like language processing, image recognition, and problem-solving compared to human capabilities.'
  },
  {
    name: 'Transfer Learning',
    description: 'Ability to apply knowledge from one domain to another',
    defaultWeight: 20,
    current: 40,
    tooltip: 'Evaluates an AI system\'s ability to use knowledge gained in one context to solve problems in different contexts, a key aspect of general intelligence.'
  },
  {
    name: 'Reasoning Capabilities',
    description: 'Abstract reasoning, planning, and causal understanding',
    defaultWeight: 25,
    current: 30,
    tooltip: 'Assesses how well AI can understand cause and effect, engage in logical reasoning, and make plans that achieve specific goals.'
  },
  {
    name: 'Embodied Intelligence',
    description: 'Physical interaction and understanding of the real world',
    defaultWeight: 15,
    current: 20,
    tooltip: 'Measures the ability of AI to understand and interact with the physical world, including robotics and sensor interpretation.'
  },
  {
    name: 'Social Intelligence',
    description: 'Understanding human emotions, intentions, and social dynamics',
    defaultWeight: 15,
    current: 25,
    tooltip: 'Evaluates AI\'s ability to recognize emotions, understand social cues, and engage in appropriate social interactions.'
  },
];

const presets = [
  {
    name: 'Balanced',
    weights: {
      'Benchmark Performance': 25,
      'Transfer Learning': 20,
      'Reasoning Capabilities': 25,
      'Embodied Intelligence': 15,
      'Social Intelligence': 15
    }
  },
  {
    name: 'Research Focus',
    weights: {
      'Benchmark Performance': 35,
      'Transfer Learning': 30,
      'Reasoning Capabilities': 20,
      'Embodied Intelligence': 5,
      'Social Intelligence': 10
    }
  },
  {
    name: 'Practical Applications',
    weights: {
      'Benchmark Performance': 30,
      'Transfer Learning': 15,
      'Reasoning Capabilities': 20,
      'Embodied Intelligence': 25,
      'Social Intelligence': 10
    }
  },
  {
    name: 'Human-like AGI',
    weights: {
      'Benchmark Performance': 15,
      'Transfer Learning': 20,
      'Reasoning Capabilities': 20,
      'Embodied Intelligence': 20,
      'Social Intelligence': 25
    }
  }
];

const Methodology = ({ onPercentageChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [customWeights, setCustomWeights] = useState(
    Object.fromEntries(factors.map(factor => [factor.name, factor.defaultWeight]))
  );
  const [showTooltip, setShowTooltip] = useState(null);
  const [realtimePercentage, setRealtimePercentage] = useState(calculatePercentage());
  const [loading, setLoading] = useState(false);
  const [newsText, setNewsText] = useState("OpenAI just released GPT-5 with cross-modal memory and long-term goal planning.");
  
  // Send percentage updates to parent component
  useEffect(() => {
    if (onPercentageChange && expanded) {
      onPercentageChange(realtimePercentage);
    }
  }, [realtimePercentage, expanded, onPercentageChange]);
  
  // Handle component unmount or collapse
  useEffect(() => {
    if (!expanded && onPercentageChange) {
      onPercentageChange(null);
    }
  }, [expanded, onPercentageChange]);
  
  function calculatePercentage(weights = customWeights) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    factors.forEach(factor => {
      const weight = weights[factor.name];
      weightedSum += (factor.current * weight);
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : '0.0';
  }
  
  const handleWeightChange = (factorName, newWeight) => {
    const updatedWeights = {
      ...customWeights,
      [factorName]: newWeight
    };
    
    setCustomWeights(updatedWeights);
    setRealtimePercentage(calculatePercentage(updatedWeights));
  };

  const applyPreset = (preset) => {
    setCustomWeights(preset.weights);
    setRealtimePercentage(calculatePercentage(preset.weights));
  };

  const runGptScorer = async () => {
    setLoading(true);
    try {
      const result = await agiScorer(newsText);
      
      // Update the slider values with the returned scores
      const updatedWeights = { ...customWeights };
      
      // Map the scores from the API to our factor names
      if (result['Benchmark Performance'] !== undefined) updatedWeights['Benchmark Performance'] = Math.min(50, Math.round(result['Benchmark Performance'] / 2));
      if (result['Transfer Learning'] !== undefined) updatedWeights['Transfer Learning'] = Math.min(50, Math.round(result['Transfer Learning'] / 2));
      if (result['Reasoning Capabilities'] !== undefined) updatedWeights['Reasoning Capabilities'] = Math.min(50, Math.round(result['Reasoning Capabilities'] / 2));
      if (result['Embodied Intelligence'] !== undefined) updatedWeights['Embodied Intelligence'] = Math.min(50, Math.round(result['Embodied Intelligence'] / 2));
      if (result['Social Intelligence'] !== undefined) updatedWeights['Social Intelligence'] = Math.min(50, Math.round(result['Social Intelligence'] / 2));
      
      setCustomWeights(updatedWeights);
      setRealtimePercentage(calculatePercentage(updatedWeights));
    } catch (error) {
      console.error('Error calling AGI Scorer:', error);
      alert('Failed to score the sample text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Our Methodology</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold mb-4">How We Calculate AGI Progress</h3>
        
        <p className="mb-6">
          Our AGI percentage is calculated using a weighted average of several key factors that researchers consider
          essential for the development of Artificial General Intelligence. Each factor is assessed based on current
          research, expert surveys, and benchmark results.
        </p>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="btn btn-primary mb-6"
        >
          {expanded ? 'Hide Details' : 'Show Calculation Details'}
        </button>
        
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Key Factors and Current Levels</h4>
            
            <div className="space-y-6 mb-8">
              {factors.map(factor => (
                <div key={factor.name} className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h5 className="font-medium">{factor.name}</h5>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">{factor.current}%</span>
                      <p className="text-sm text-gray-600">current level</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary rounded-full h-2.5" 
                      style={{ width: `${factor.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h4 className="text-lg font-semibold mb-4">Create Your Own AGI Estimate</h4>
              <p className="mb-4">Adjust the importance of each factor to see how it affects the overall AGI percentage.</p>
              
              {/* Preset buttons */}
              <div className="mb-6">
                <h5 className="text-sm font-medium mb-2">Presets:</h5>
                <div className="flex flex-wrap gap-2">
                  {presets.map(preset => (
                    <button 
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1 bg-secondary text-white text-sm rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {factors.map(factor => (
                  <div key={factor.name} className="flex items-center">
                    <div className="w-1/3 relative">
                      <label 
                        className="text-sm font-medium cursor-help"
                        onMouseEnter={() => setShowTooltip(factor.name)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        {factor.name}
                      </label>
                      {showTooltip === factor.name && (
                        <div className="absolute z-10 bg-dark text-white p-2 rounded shadow-lg text-xs max-w-xs left-0 mt-1">
                          {factor.tooltip}
                        </div>
                      )}
                    </div>
                    <div className="w-1/3 px-4">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={customWeights[factor.name]}
                        onChange={(e) => handleWeightChange(factor.name, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="w-1/3 text-right">
                      <span className="text-sm font-medium">Weight: {customWeights[factor.name]}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add textarea above the button */}
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Custom Article:</h5>
                <textarea
                  placeholder="Paste a news article here to analyze its AGI implications..."
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={5}
                />
              </div>
              
              <div className="mb-6 flex justify-center">
                <button 
                  onClick={runGptScorer}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  {loading ? 'Processing...' : 'Run GPT Scorer'}
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Your AGI Percentage:</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">{realtimePercentage}%</span>
                    <div className="ml-2 text-xs text-gray-500">
                      <span className={customWeights !== factors.reduce((acc, factor) => ({ ...acc, [factor.name]: factor.defaultWeight }), {}) ? 'visible' : 'invisible'}>
                        (updated in real-time)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 italic">
              Note: This methodology is a simplified model for educational and entertainment purposes. 
              Actual AGI development is complex and challenging to quantify precisely.
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Methodology; 