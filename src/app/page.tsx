'use client';

import { useState, useRef } from 'react';
import AGIPercentage from '@/components/AGIPercentage';
import Methodology from '@/components/Methodology';
import DataVisualizations from '@/components/DataVisualizations';
import NewsAggregator from '@/components/NewsAggregator';
import ExpertOpinions from '@/components/ExpertOpinions';
import SocialSharing from '@/components/SocialSharing';
import ComparisonTool from '@/components/ComparisonTool';
import Timeline from '@/components/Timeline';
import ModelComparison from '@/components/ModelComparison';
import { agiScorer } from '@/utils/agiScorer';

export default function Home() {
  const [activeModel, setActiveModel] = useState<string>('conservative');
  const [sliderValues, setSliderValues] = useState<{[key: string]: number}>({
    'Benchmark Performance': 0,
    'Transfer Learning': 0,
    'Reasoning Capabilities': 0,
    'Embodied Intelligence': 0,
    'Social Intelligence': 0
  });
  const [activeTab, setActiveTab] = useState<string>('overview');
  const methodologyRef = useRef<HTMLDivElement>(null);
  
  // These would normally come from your backend or API
  const percentageModels = {
    conservative: 37.8,
    optimistic: 62.4,
    capabilities: 45.2,
    academic: 29.6
  };

  const handleTestArticle = async () => {
    try {
      const sampleArticle = "OpenAI releases GPT-5 with multimodal understanding. The new model demonstrates unprecedented capabilities in understanding and reasoning across text, images, audio, and video inputs. Early benchmarks show GPT-5 outperforming human experts on reasoning tasks and exhibiting strong transfer learning abilities between different domains. The system can also interpret and respond to human emotions with remarkable accuracy.";
      
      console.log("Testing AGI Scorer with sample article...");
      const result = await agiScorer(sampleArticle);
      console.log("AGI Scorer Result:", result);
      
      // Update sliders if we have the categories
      if (result && typeof result === 'object') {
        setSliderValues({
          'Benchmark Performance': result['Benchmark Performance'] || 0,
          'Transfer Learning': result['Transfer Learning'] || 0,
          'Reasoning Capabilities': result['Reasoning Capabilities'] || 0,
          'Embodied Intelligence': result['Embodied Intelligence'] || 0,
          'Social Intelligence': result['Social Intelligence'] || 0
        });
        
        // Scroll to methodology section if it exists
        if (methodologyRef.current) {
          methodologyRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error("Error testing AGI Scorer:", error);
    }
  };

  // Navigation tabs
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'data', label: 'Data' },
    { id: 'models', label: 'Models' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'news', label: 'News' },
    { id: 'experts', label: 'Expert Opinions' }
  ];

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Current Progress to AGI</h2>
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  {Object.keys(percentageModels).map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setActiveModel(model)}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeModel === model
                          ? 'bg-primary text-white'
                          : 'bg-white text-dark hover:bg-gray-100'
                      } ${model === Object.keys(percentageModels)[0] ? 'rounded-l-lg' : ''} ${
                        model === Object.keys(percentageModels)[Object.keys(percentageModels).length - 1]
                          ? 'rounded-r-lg'
                          : ''
                      } border border-gray-200`}
                    >
                      {model.charAt(0).toUpperCase() + model.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <AGIPercentage percentage={percentageModels[activeModel as keyof typeof percentageModels]} />
              
              {/* Test Button for AGI Scorer */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleTestArticle}
                  className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors"
                >
                  Test AGI Scorer with Sample Article
                </button>
              </div>
            </div>
            
            <DataVisualizations />
          </>
        );
      case 'methodology':
        return (
          <div ref={methodologyRef}>
            <Methodology initialValues={sliderValues} />
          </div>
        );
      case 'data':
        return <DataVisualizations />;
      case 'models':
        return <ModelComparison />;
      case 'timeline':
        return <Timeline />;
      case 'predictions':
        return <ComparisonTool />;
      case 'news':
        return <NewsAggregator />;
      case 'experts':
        return <ExpertOpinions />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <header className="bg-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Percent to AGI</h1>
          <p className="text-xl mt-2">Tracking humanity's progress toward Artificial General Intelligence</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white rounded-md'
                    : 'text-gray-700 hover:bg-gray-100 rounded-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-12">
        {renderTabContent()}
        
        <SocialSharing percentage={percentageModels[activeModel as keyof typeof percentageModels]} />
      </section>

      <footer className="bg-dark text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Percent to AGI. Created with a blend of humor and scientific rigor.</p>
          <p className="text-sm mt-2">Disclaimer: AGI percentages are estimations based on current research and may not reflect actual AGI development progress. Or maybe they do. Who knows?</p>
        </div>
      </footer>
    </main>
  );
} 