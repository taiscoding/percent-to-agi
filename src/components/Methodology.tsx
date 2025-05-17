'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

const factors = [
  {
    name: 'Benchmark Performance',
    description: 'How AI systems perform on standardized benchmarks compared to humans',
    tooltip: 'Measures how well AI systems perform on standardized tests compared to human performance. Higher scores indicate AI matching or exceeding human capabilities on specific tasks.',
    defaultWeight: 25,
    current: 65,
  },
  {
    name: 'Transfer Learning',
    description: 'Ability to apply knowledge from one domain to another',
    tooltip: 'Assesses how effectively AI can apply knowledge learned in one context to new situations. A key component of generalization and adaptability.',
    defaultWeight: 20,
    current: 40,
  },
  {
    name: 'Reasoning Capabilities',
    description: 'Abstract reasoning, planning, and causal understanding',
    tooltip: 'Evaluates AI\'s ability to think abstractly, understand cause and effect, and formulate plans. This is critical for solving novel problems.',
    defaultWeight: 25,
    current: 30,
  },
  {
    name: 'Embodied Intelligence',
    description: 'Physical interaction and understanding of the real world',
    tooltip: 'Measures AI\'s capability to perceive, navigate, and interact with the physical world. Important for robotics and real-world applications.',
    defaultWeight: 15,
    current: 20,
  },
  {
    name: 'Social Intelligence',
    description: 'Understanding human emotions, intentions, and social dynamics',
    tooltip: 'Gauges how well AI can recognize and respond to human emotions, social cues, and complex interpersonal dynamics.',
    defaultWeight: 15,
    current: 25,
  },
];

interface MethodologyProps {
  initialValues: {[key: string]: number};
}

const Methodology: React.FC<MethodologyProps> = ({ initialValues }) => {
  const [expanded, setExpanded] = useState(false);
  const [customWeights, setCustomWeights] = useState<{[key: string]: number}>(
    Object.fromEntries(factors.map(factor => [factor.name, factor.defaultWeight]))
  );
  const [currentLevels, setCurrentLevels] = useState<{[key: string]: number}>(
    Object.fromEntries(factors.map(factor => [factor.name, factor.current]))
  );
  const [analysisRun, setAnalysisRun] = useState<boolean>(false);
  
  // Auto-expand when analysis is run
  useEffect(() => {
    if (Object.values(initialValues).some(value => value > 0)) {
      setExpanded(true);
      setAnalysisRun(true);
    }
  }, [initialValues]);
  
  const calculateCustomPercentage = () => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    factors.forEach(factor => {
      const weight = customWeights[factor.name];
      const level = currentLevels[factor.name];
      weightedSum += (level * weight);
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : '0.0';
  };
  
  const handleWeightChange = (factorName: string, newWeight: number) => {
    setCustomWeights(prev => ({
      ...prev,
      [factorName]: newWeight
    }));
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
            
            {analysisRun && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Analysis results loaded</h3>
                    <p className="text-sm text-green-700">The levels below reflect the analysis of the provided sample article.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6 mb-8">
              {factors.map(factor => (
                <div key={factor.name} className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <h5 className="font-medium">{factor.name}</h5>
                      <Tooltip content={factor.tooltip} position="right">
                        <svg className="h-4 w-4 ml-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                      <p className="text-sm text-gray-600 ml-6">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">{currentLevels[factor.name]}%</span>
                      <p className="text-sm text-gray-600">current level</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary rounded-full h-2.5" 
                      style={{ width: `${currentLevels[factor.name]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h4 className="text-lg font-semibold mb-4">AGI Capabilities Analysis</h4>
              <p className="mb-4">These sliders represent the AI capabilities detected in the analysis.</p>
              
              <div className="space-y-4 mb-6">
                {factors.map(factor => (
                  <div key={factor.name} className="flex items-center">
                    <div className="w-1/3 flex items-center">
                      <label className="text-sm font-medium">{factor.name}</label>
                      <Tooltip content={factor.tooltip} position="right">
                        <svg className="h-4 w-4 ml-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </div>
                    <div className="w-1/3 px-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={initialValues[factor.name]}
                        readOnly
                        disabled
                        className="w-full cursor-not-allowed opacity-70"
                      />
                    </div>
                    <div className="w-1/3 text-right">
                      <span className="text-sm font-medium">Value: {initialValues[factor.name]}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Your AGI Percentage:</span>
                  <span className="text-2xl font-bold text-primary">{calculateCustomPercentage()}%</span>
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