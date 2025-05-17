import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Sample data for model capabilities
const modelData = [
  {
    name: 'GPT-4',
    release: 'March 2023',
    organization: 'OpenAI',
    capabilities: {
      'Language Understanding': 92,
      'Reasoning': 85,
      'Knowledge': 88,
      'Instruction Following': 90,
      'Coding': 87,
      'Multimodal': 75,
      'Truthfulness': 80,
      'Safety': 82,
    },
    context: '128k tokens',
    strengths: [
      'Strong reasoning across domains',
      'Great at writing and creative tasks',
      'Excellent coding capabilities',
      'Good at following complex instructions'
    ],
    limitations: [
      'Not real-time updated knowledge',
      'Can still make reasoning errors',
      'Variable performance on specialized tasks',
      'Limited multimodal capabilities compared to GPT-4o'
    ]
  },
  {
    name: 'Claude 3 Opus',
    release: 'March 2024',
    organization: 'Anthropic',
    capabilities: {
      'Language Understanding': 93,
      'Reasoning': 90,
      'Knowledge': 85,
      'Instruction Following': 95,
      'Coding': 84,
      'Multimodal': 78,
      'Truthfulness': 92,
      'Safety': 90,
    },
    context: '200k tokens',
    strengths: [
      'Excellent reasoning capabilities',
      'Strong truthfulness and accuracy',
      'High reliability for complex instructions',
      'Good safety mechanisms'
    ],
    limitations: [
      'Sometimes more cautious than necessary',
      'Limited multilingual abilities compared to others',
      'Less efficient at certain coding tasks',
      'More computationally expensive'
    ]
  },
  {
    name: 'Gemini Pro',
    release: 'December 2023',
    organization: 'Google',
    capabilities: {
      'Language Understanding': 88,
      'Reasoning': 83,
      'Knowledge': 90,
      'Instruction Following': 85,
      'Coding': 82,
      'Multimodal': 85,
      'Truthfulness': 84,
      'Safety': 86,
    },
    context: '32k tokens',
    strengths: [
      'Strong general knowledge',
      'Good multimodal understanding',
      'Integration with Google products',
      'Efficient response generation'
    ],
    limitations: [
      'Sometimes less precise instruction following',
      'More variable performance across domains',
      'Less capable in specialized reasoning tasks',
      'Shorter context window than competitors'
    ]
  },
  {
    name: 'Llama 3 70B',
    release: 'April 2024',
    organization: 'Meta',
    capabilities: {
      'Language Understanding': 86,
      'Reasoning': 80,
      'Knowledge': 82,
      'Instruction Following': 83,
      'Coding': 78,
      'Multimodal': 65,
      'Truthfulness': 83,
      'Safety': 80,
    },
    context: '8k tokens',
    strengths: [
      'Open weights enable customization',
      'Efficient fine-tuning for specific use cases',
      'Good overall performance for its size',
      'Can run locally with sufficient resources'
    ],
    limitations: [
      'More limited context window',
      'Less capable in multimodal understanding',
      'Generally behind closed-source models in capabilities',
      'Requires more prompt engineering'
    ]
  },
  {
    name: 'GPT-4o',
    release: 'May 2024',
    organization: 'OpenAI',
    capabilities: {
      'Language Understanding': 95,
      'Reasoning': 88,
      'Knowledge': 90,
      'Instruction Following': 93,
      'Coding': 90,
      'Multimodal': 92,
      'Truthfulness': 82,
      'Safety': 85,
    },
    context: '128k tokens',
    strengths: [
      'Excellent multimodal capabilities',
      'Near-real-time response speed',
      'Better audio and image understanding',
      'Improved coding capabilities'
    ],
    limitations: [
      'Knowledge cutoff still applies',
      'Similar reasoning limitations as GPT-4',
      'Higher operational costs',
      'Potential for more convincing hallucinations'
    ]
  }
];

const ModelComparison = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>(['GPT-4', 'Claude 3 Opus']);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  // Format data for the radar chart
  const formatDataForRadar = () => {
    const capabilities = Object.keys(modelData[0].capabilities);
    
    return capabilities.map(capability => {
      const dataPoint: { [key: string]: any } = { capability };
      
      selectedModels.forEach(modelName => {
        const model = modelData.find(m => m.name === modelName);
        if (model) {
          dataPoint[modelName] = model.capabilities[capability as keyof typeof model.capabilities];
        }
      });
      
      return dataPoint;
    });
  };

  // Toggle model selection for comparison
  const toggleModelSelection = (modelName: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelName)) {
        return prev.filter(name => name !== modelName);
      } else {
        // Limit to comparing 3 models at a time for readability
        const newSelection = [...prev, modelName];
        return newSelection.slice(-3);
      }
    });
  };

  // Toggle expanded model details
  const toggleExpandedModel = (modelName: string) => {
    setExpandedModel(prev => prev === modelName ? null : modelName);
  };

  // Generate a unique color for each model
  const getModelColor = (index: number) => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
    return colors[index % colors.length];
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">LLM Capabilities Comparison</h2>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Select models to compare (max 3):</h3>
          <div className="flex flex-wrap gap-3">
            {modelData.map((model, index) => (
              <button
                key={model.name}
                onClick={() => toggleModelSelection(model.name)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  ${selectedModels.includes(model.name) 
                    ? `bg-opacity-90 text-white` 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                style={selectedModels.includes(model.name) 
                  ? { backgroundColor: getModelColor(modelData.findIndex(m => m.name === model.name)) } 
                  : {}}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>

        {selectedModels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 sm:p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Capability Comparison</h3>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={formatDataForRadar()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="capability" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    
                    {selectedModels.map((modelName, index) => (
                      <Radar
                        key={modelName}
                        name={modelName}
                        dataKey={modelName}
                        stroke={getModelColor(modelData.findIndex(m => m.name === modelName))}
                        fill={getModelColor(modelData.findIndex(m => m.name === modelName))}
                        fillOpacity={0.2}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedModels.map(modelName => {
            const model = modelData.find(m => m.name === modelName);
            if (!model) return null;
            
            const modelIndex = modelData.findIndex(m => m.name === modelName);
            const modelColor = getModelColor(modelIndex);
            
            return (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: modelIndex * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="p-4 text-white font-medium text-lg"
                  style={{ backgroundColor: modelColor }}
                >
                  {model.name}
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Released:</span>
                      <p className="font-medium">{model.release}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Organization:</span>
                      <p className="font-medium">{model.organization}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Context:</span>
                      <p className="font-medium">{model.context}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleExpandedModel(model.name)}
                    className="w-full mt-2 px-4 py-2 bg-gray-100 rounded text-center font-medium hover:bg-gray-200 transition-colors"
                  >
                    {expandedModel === model.name ? 'Hide Details' : 'Show Details'}
                  </button>
                  
                  {expandedModel === model.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Key Strengths</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {model.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Limitations</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {model.limitations.map((limitation, i) => (
                            <li key={i}>{limitation}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Detailed Capabilities</h4>
                        <div className="text-sm">
                          {Object.entries(model.capabilities).map(([capability, score]) => (
                            <div key={capability} className="flex justify-between items-center mb-1">
                              <span>{capability}</span>
                              <span className="font-medium">{score}/100</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Note: All ratings are approximate and based on publicly available benchmarks, papers, and expert assessments.</p>
          <p>Capabilities continue to evolve rapidly as models are improved.</p>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison; 