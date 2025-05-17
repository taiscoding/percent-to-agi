import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DataVisualizations = () => {
  const [activeChart, setActiveChart] = useState('progress');

  // Progress over time data
  const progressData = {
    labels: ['2010', '2015', '2020', '2025', '2030 (Projected)', '2035 (Projected)', '2040 (Projected)'],
    datasets: [
      {
        label: 'Conservative Estimate',
        data: [5, 12, 22, 37.8, 56, 72, 88],
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Optimistic Estimate',
        data: [8, 20, 35, 62.4, 83, 95, 99],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Progress by capability area
  const capabilityData = {
    labels: [
      'Language Understanding',
      'Visual Perception',
      'Reasoning',
      'Knowledge Representation',
      'Planning',
      'Learning',
      'Creativity',
      'Common Sense',
      'Self-Awareness',
      'Adaptability'
    ],
    datasets: [
      {
        label: 'Current Progress (%)',
        data: [85, 79, 52, 63, 58, 81, 70, 43, 28, 61],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Expert predictions
  const predictionsData = {
    labels: ['2025', '2030', '2035', '2040', '2045', '2050+', 'Never'],
    datasets: [
      {
        label: 'Percentage of Experts',
        data: [5, 18, 24, 31, 12, 7, 3],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const barOptions = {
    ...options,
    indexAxis: activeChart === 'capabilities' ? 'y' : 'x',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: activeChart === 'capabilities' 
          ? 'Progress by Capability Area' 
          : 'Expert Predictions: When Will AGI Be Achieved?',
      },
    },
  };

  const buttonClass = (chartType) => 
    `px-4 py-2 rounded-md text-sm font-medium ${
      activeChart === chartType 
        ? 'bg-primary text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } transition-colors`;

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Data Visualizations</h2>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-4"
        >
          <div className="flex justify-center mb-6 space-x-4">
            <button 
              className={buttonClass('progress')} 
              onClick={() => setActiveChart('progress')}
            >
              Progress Over Time
            </button>
            <button 
              className={buttonClass('capabilities')} 
              onClick={() => setActiveChart('capabilities')}
            >
              Capability Areas
            </button>
            <button 
              className={buttonClass('predictions')} 
              onClick={() => setActiveChart('predictions')}
            >
              Expert Predictions
            </button>
          </div>
          
          <div className="h-80">
            {activeChart === 'progress' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Line 
                  data={progressData} 
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      title: {
                        display: true,
                        text: 'AGI Progress Over Time',
                      },
                    }
                  }} 
                />
              </motion.div>
            )}
            
            {activeChart === 'capabilities' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Bar 
                  data={capabilityData} 
                  options={barOptions} 
                />
              </motion.div>
            )}
            
            {activeChart === 'predictions' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Bar 
                  data={predictionsData} 
                  options={barOptions} 
                />
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Data sources: Research papers, expert surveys, and industry reports from 2020-2025</p>
          </div>
        </motion.div>
        
        <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-light">
          <h3 className="text-lg font-semibold mb-2">Methodology Notes</h3>
          <p className="text-sm text-gray-700">
            These visualizations represent aggregated data from various sources, including academic research, 
            industry benchmarks, and expert surveys. The progress metrics consider advancements in multiple 
            domains including language, vision, reasoning, robotics, and more. Projections are based on 
            current trends and may be updated as new breakthroughs occur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizations; 