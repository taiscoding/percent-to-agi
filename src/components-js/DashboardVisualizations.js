import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { getHistoricalData, getMilestones } from '../../utils/assessmentService';

const DashboardVisualizations = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [aggregateData, setAggregateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('trends');
  
  // Define colors for each dimension
  const dimensionColors = {
    'Benchmark Performance': '#00A3E0',
    'Transfer Learning': '#FF5D73',
    'Reasoning Capabilities': '#8BC34A',
    'Embodied Intelligence': '#FFC107',
    'Social Intelligence': '#9C27B0'
  };
  
  // Fetch historical data and milestones on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get historical assessment data
        const historyResult = await getHistoricalData(100);
        if (historyResult.success) {
          processHistoricalData(historyResult.assessments);
        } else {
          throw new Error(historyResult.error || 'Failed to fetch historical data');
        }
        
        // Get AI research milestones
        const milestonesResult = await getMilestones();
        if (milestonesResult.success) {
          setMilestones(milestonesResult.milestones);
        } else {
          throw new Error(milestonesResult.error || 'Failed to fetch milestones');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        
        // Use mock data in development or if API fails
        if (process.env.NODE_ENV === 'development') {
          processHistoricalData(getMockHistoricalData());
          setMilestones(getMockMilestones());
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Process historical data to create trend lines
  const processHistoricalData = (assessments) => {
    if (!assessments || assessments.length === 0) {
      setHistoricalData([]);
      setAggregateData([]);
      return;
    }
    
    // Create a chronological timeline by sorting assessments
    const sortedAssessments = [...assessments].sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateA - dateB;
    });
    
    // Extract trend data for each dimension
    const dimensions = [
      'Benchmark Performance',
      'Transfer Learning',
      'Reasoning Capabilities',
      'Embodied Intelligence',
      'Social Intelligence'
    ];
    
    // Group assessments by month/year for trend analysis
    const timelineData = {};
    const aggregateByTime = {};
    
    sortedAssessments.forEach(assessment => {
      const date = assessment.createdAt?.toDate ? assessment.createdAt.toDate() : new Date(assessment.createdAt);
      const timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!timelineData[timeKey]) {
        timelineData[timeKey] = {
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          displayDate: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
        };
        
        // Initialize dimension counts and sums
        dimensions.forEach(dim => {
          timelineData[timeKey][`${dim}Count`] = 0;
          timelineData[timeKey][`${dim}Sum`] = 0;
          timelineData[timeKey][dim] = 0;
        });
        
        // Initialize aggregate
        aggregateByTime[timeKey] = {
          date: timelineData[timeKey].date,
          displayDate: timelineData[timeKey].displayDate,
          weightedSum: 0,
          totalWeight: 0,
          count: 0,
          aggregate: 0
        };
      }
      
      // Add dimension scores to timeline data
      dimensions.forEach(dim => {
        if (assessment.factorScores && assessment.factorScores[dim] !== undefined) {
          timelineData[timeKey][`${dim}Sum`] += assessment.factorScores[dim];
          timelineData[timeKey][`${dim}Count`] += 1;
        }
      });
      
      // Calculate aggregate score
      let weightedSum = 0;
      let totalWeight = 0;
      
      dimensions.forEach(dim => {
        if (assessment.factorScores && assessment.factorScores[dim] !== undefined && 
            assessment.weights && assessment.weights[dim] !== undefined) {
          weightedSum += assessment.factorScores[dim] * assessment.weights[dim];
          totalWeight += assessment.weights[dim];
        }
      });
      
      if (totalWeight > 0) {
        const aggregateScore = weightedSum / totalWeight;
        aggregateByTime[timeKey].weightedSum += aggregateScore;
        aggregateByTime[timeKey].count += 1;
      }
    });
    
    // Calculate averages for each time period
    Object.keys(timelineData).forEach(timeKey => {
      dimensions.forEach(dim => {
        if (timelineData[timeKey][`${dim}Count`] > 0) {
          timelineData[timeKey][dim] = timelineData[timeKey][`${dim}Sum`] / timelineData[timeKey][`${dim}Count`];
        }
      });
      
      // Calculate aggregate average
      if (aggregateByTime[timeKey].count > 0) {
        aggregateByTime[timeKey].aggregate = aggregateByTime[timeKey].weightedSum / aggregateByTime[timeKey].count;
      }
    });
    
    // Convert to arrays for charts
    const timelineArray = Object.values(timelineData);
    const aggregateArray = Object.values(aggregateByTime);
    
    setHistoricalData(timelineArray);
    setAggregateData(aggregateArray);
  };
  
  // Render the trend lines chart
  const renderTrendChart = () => {
    if (isLoading) {
      return <div className="flex justify-center my-8">Loading trend data...</div>;
    }
    
    if (error) {
      return <div className="text-red-500 text-center my-8">Error: {error}</div>;
    }
    
    if (!historicalData.length) {
      return <div className="text-center my-8">No historical data available</div>;
    }
    
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Benchmark Performance"
              stroke={dimensionColors['Benchmark Performance']}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Transfer Learning"
              stroke={dimensionColors['Transfer Learning']}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Reasoning Capabilities"
              stroke={dimensionColors['Reasoning Capabilities']}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Embodied Intelligence"
              stroke={dimensionColors['Embodied Intelligence']}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Social Intelligence"
              stroke={dimensionColors['Social Intelligence']}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Render the aggregate AGI readiness chart
  const renderAggregateChart = () => {
    if (isLoading) {
      return <div className="flex justify-center my-8">Loading aggregate data...</div>;
    }
    
    if (error) {
      return <div className="text-red-500 text-center my-8">Error: {error}</div>;
    }
    
    if (!aggregateData.length) {
      return <div className="text-center my-8">No aggregate data available</div>;
    }
    
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={aggregateData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              name="AGI Readiness (%)"
              dataKey="aggregate"
              stroke="#FF6B6B"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Render milestone timeline
  const renderMilestoneTimeline = () => {
    if (isLoading) {
      return <div className="flex justify-center my-8">Loading milestones...</div>;
    }
    
    if (error) {
      return <div className="text-red-500 text-center my-8">Error: {error}</div>;
    }
    
    if (!milestones.length) {
      return <div className="text-center my-8">No milestone data available</div>;
    }
    
    // Prepare data for scatter plot
    const scatterData = milestones.map(milestone => ({
      x: new Date(milestone.date).getTime(),
      y: milestone.impact || 50, // Impact on AGI progress (0-100)
      z: milestone.significance || 10, // Size of the dot (significance)
      name: milestone.title,
      description: milestone.description
    }));
    
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Date" 
              domain={['auto', 'auto']}
              tickFormatter={(timestamp) => new Date(timestamp).getFullYear()}
              label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Impact" 
              domain={[0, 100]}
              label={{ value: 'Impact on AGI Progress', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[60, 400]} 
              name="Significance" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="custom-tooltip bg-white p-3 border rounded shadow-lg">
                      <p className="font-bold">{payload[0].payload.name}</p>
                      <p className="text-sm">{new Date(payload[0].payload.x).getFullYear()}</p>
                      <p className="text-sm">{payload[0].payload.description}</p>
                      <p className="text-sm">Impact: {payload[0].payload.y}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              name="AI Research Milestones" 
              data={scatterData} 
              fill="#8884d8"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">AGI Progress Dashboard</h2>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setActiveView('trends')}
            className={`px-4 py-2 text-sm font-medium ${
              activeView === 'trends'
                ? 'bg-primary text-white'
                : 'bg-white text-dark hover:bg-gray-100'
            } rounded-l-lg border border-gray-200`}
          >
            Dimension Trends
          </button>
          <button
            type="button"
            onClick={() => setActiveView('aggregate')}
            className={`px-4 py-2 text-sm font-medium ${
              activeView === 'aggregate'
                ? 'bg-primary text-white'
                : 'bg-white text-dark hover:bg-gray-100'
            } border-t border-b border-gray-200`}
          >
            AGI Readiness
          </button>
          <button
            type="button"
            onClick={() => setActiveView('milestones')}
            className={`px-4 py-2 text-sm font-medium ${
              activeView === 'milestones'
                ? 'bg-primary text-white'
                : 'bg-white text-dark hover:bg-gray-100'
            } rounded-r-lg border border-gray-200`}
          >
            Research Milestones
          </button>
        </div>
      </div>
      
      <div className="card max-w-5xl mx-auto p-6">
        {activeView === 'trends' && renderTrendChart()}
        {activeView === 'aggregate' && renderAggregateChart()}
        {activeView === 'milestones' && renderMilestoneTimeline()}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoading ? 'Loading data...' : (
            historicalData.length 
              ? `Data based on ${historicalData.reduce((sum, item) => 
                  sum + (item.BenchmarkPerformanceCount || 0), 0)
                } assessments over time`
              : 'No historical data available yet. As users create assessments, trend data will appear here.'
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data for development and fallback
const getMockHistoricalData = () => {
  const startDate = new Date(2022, 0, 1); // Jan 1, 2022
  const mockData = [];
  
  for (let i = 0; i < 12; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    
    mockData.push({
      createdAt: currentDate,
      factorScores: {
        'Benchmark Performance': 50 + i * 2 + Math.random() * 5,
        'Transfer Learning': 35 + i * 1.5 + Math.random() * 5,
        'Reasoning Capabilities': 30 + i * 1.8 + Math.random() * 5,
        'Embodied Intelligence': 20 + i * 1 + Math.random() * 5,
        'Social Intelligence': 25 + i * 1.2 + Math.random() * 5
      },
      weights: {
        'Benchmark Performance': 25,
        'Transfer Learning': 20,
        'Reasoning Capabilities': 25,
        'Embodied Intelligence': 15,
        'Social Intelligence': 15
      }
    });
  }
  
  return mockData;
};

// Mock milestones for development
const getMockMilestones = () => {
  return [
    {
      title: 'DALL-E Release',
      description: 'OpenAI releases DALL-E, generating images from text descriptions',
      date: '2021-01-05',
      impact: 55,
      significance: 15
    },
    {
      title: 'GPT-3 Paper Published',
      description: 'OpenAI publishes paper on GPT-3 with 175 billion parameters',
      date: '2020-05-28',
      impact: 70,
      significance: 20
    },
    {
      title: 'AlphaFold 2 Breakthrough',
      description: 'DeepMind\'s AlphaFold 2 achieves breakthrough in protein structure prediction',
      date: '2020-11-30',
      impact: 65,
      significance: 18
    },
    {
      title: 'GPT-4 Release',
      description: 'OpenAI releases GPT-4 with multimodal capabilities',
      date: '2023-03-14',
      impact: 75,
      significance: 22
    },
    {
      title: 'AlphaGo Defeats Lee Sedol',
      description: 'DeepMind\'s AlphaGo defeats world champion Lee Sedol in Go',
      date: '2016-03-15',
      impact: 60,
      significance: 17
    },
    {
      title: 'Stable Diffusion Release',
      description: 'Stability AI releases Stable Diffusion for image generation',
      date: '2022-08-22',
      impact: 50,
      significance: 12
    }
  ];
};

export default DashboardVisualizations; 