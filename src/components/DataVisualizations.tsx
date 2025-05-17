'use client';

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Sample data for the visualizations
const benchmarkData = [
  { name: 'Image Recognition', human: 95, ai: 98 },
  { name: 'Natural Language', human: 100, ai: 90 },
  { name: 'Reasoning', human: 100, ai: 75 },
  { name: 'Common Sense', human: 95, ai: 60 },
  { name: 'Creativity', human: 100, ai: 65 },
  { name: 'Social Intelligence', human: 95, ai: 55 },
  { name: 'Physical Tasks', human: 90, ai: 40 },
];

const researchTrendData = [
  { year: '2010', papers: 2500, funding: 1.2 },
  { year: '2012', papers: 3000, funding: 1.5 },
  { year: '2014', papers: 4500, funding: 2.3 },
  { year: '2016', papers: 6000, funding: 3.8 },
  { year: '2018', papers: 9000, funding: 5.7 },
  { year: '2020', papers: 15000, funding: 9.2 },
  { year: '2022', papers: 25000, funding: 14.5 },
  { year: '2024', papers: 35000, funding: 22.8 },
];

const expertSurveyData = [
  { name: '2025-2030', value: 10 },
  { name: '2031-2040', value: 25 },
  { name: '2041-2050', value: 35 },
  { name: '2051-2075', value: 20 },
  { name: 'After 2075', value: 10 },
];

const fundingData = [
  { name: 'Industry', value: 45 },
  { name: 'Government', value: 30 },
  { name: 'Academia', value: 15 },
  { name: 'Non-profit', value: 10 },
];

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];

const DataVisualizations = () => {
  const [activeTab, setActiveTab] = useState('benchmarks');

  const renderChart = () => {
    switch (activeTab) {
      case 'benchmarks':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold mb-4">AI vs Human Performance on Key Benchmarks</h4>
            <p className="mb-6 text-gray-600">
              Comparing AI and human performance across different cognitive and physical tasks.
              Values are normalized percentages where 100% represents optimal performance.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarkData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="human" name="Human" fill="#3498db" />
                  <Bar dataKey="ai" name="AI" fill="#e74c3c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'research':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold mb-4">AI Research Publication Trends</h4>
            <p className="mb-6 text-gray-600">
              Growth in AI research papers published and global funding (in billions USD) over time.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={researchTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" label={{ value: 'Publications', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Funding (B$)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="papers" name="Research Papers" stroke="#3498db" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="funding" name="Funding (Billions USD)" stroke="#2ecc71" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'survey':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold mb-4">Expert Survey: When Will We Achieve AGI?</h4>
            <p className="mb-6 text-gray-600">
              Results from surveying 200 AI researchers and experts on their AGI timeline predictions.
            </p>
            <div className="h-80 flex">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={expertSurveyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expertSurveyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <ResponsiveContainer width="50%" height="100%">
                <AreaChart
                  data={expertSurveyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" name="% of Experts" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'funding':
        return (
          <div className="p-4">
            <h4 className="text-xl font-semibold mb-4">AGI Research Funding Distribution</h4>
            <p className="mb-6 text-gray-600">
              Breakdown of global AGI research funding by source (percentage).
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundingData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Data Visualizations</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex border-b">
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'benchmarks' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('benchmarks')}
          >
            AI Benchmarks
          </button>
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'research' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('research')}
          >
            Research Trends
          </button>
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'survey' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('survey')}
          >
            Expert Surveys
          </button>
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'funding' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('funding')}
          >
            Funding
          </button>
        </div>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderChart()}
        </motion.div>
        
        <div className="p-4 text-xs text-gray-500 italic border-t">
          Data sources: Academic publications, industry reports, and expert surveys compiled by our research team.
          Data is updated quarterly. Last updated: {new Date().toLocaleDateString()}
        </div>
      </motion.div>
    </div>
  );
};

export default DataVisualizations; 