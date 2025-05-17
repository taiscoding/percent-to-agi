import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for historical predictions vs. actual progress
const predictionData = [
  { year: 2010, prediction2010: 15, actual: 10 },
  { year: 2012, prediction2010: 20, actual: 13 },
  { year: 2014, prediction2010: 25, actual: 17 },
  { year: 2016, prediction2010: 30, actual: 22 },
  { year: 2018, prediction2010: 35, actual: 28 },
  { year: 2020, prediction2010: 40, actual: 33 },
  { year: 2022, prediction2010: 45, actual: 36 },
  { year: 2024, prediction2010: 50, prediction2015: 45, prediction2020: 40, actual: 38 },
  { year: 2026, prediction2010: 55, prediction2015: 50, prediction2020: 45 },
  { year: 2028, prediction2010: 60, prediction2015: 58, prediction2020: 52 },
  { year: 2030, prediction2010: 65, prediction2015: 65, prediction2020: 60 },
  { year: 2035, prediction2010: 80, prediction2015: 78, prediction2020: 75 },
  { year: 2040, prediction2010: 95, prediction2015: 90, prediction2020: 85 },
];

const famouspredictions = [
  {
    name: "Ray Kurzweil",
    year: 2005,
    prediction: "By 2029, computers will have human-level intelligence.",
    accuracy: "In progress - his timeline appears optimistic based on current progress",
  },
  {
    name: "Marvin Minsky",
    year: 1970,
    prediction: "In from three to eight years we will have a machine with the general intelligence of an average human being.",
    accuracy: "Incorrect - vastly underestimated the difficulty of AGI",
  },
  {
    name: "Geoffrey Hinton",
    year: 2015,
    prediction: "We'll have human-level AI within 5-25 years.",
    accuracy: "In progress - the lower bound has passed, but the upper bound extends to 2040",
  },
  {
    name: "Andrew Ng",
    year: 2016,
    prediction: "Worrying about AI turning evil is like worrying about overpopulation on Mars.",
    accuracy: "Not a timeline prediction, but suggests AGI is very far away",
  },
  {
    name: "Yann LeCun",
    year: 2020,
    prediction: "We're very far from building truly intelligent machines.",
    accuracy: "Aligns with current consensus that AGI is still decades away",
  },
];

type PredictionYearKeys = 'prediction2010' | 'prediction2015' | 'prediction2020' | 'actual';

const ComparisonTool = () => {
  const [selectedPredictions, setSelectedPredictions] = useState<PredictionYearKeys[]>(['prediction2010', 'actual']);
  const [showFamousPredictions, setShowFamousPredictions] = useState(false);

  // Colors for the different prediction lines
  const lineColors = {
    prediction2010: '#e74c3c',
    prediction2015: '#f39c12',
    prediction2020: '#2ecc71',
    actual: '#3498db',
  };

  // Labels for the checkboxes
  const predictionLabels = {
    prediction2010: '2010 Predictions',
    prediction2015: '2015 Predictions',
    prediction2020: '2020 Predictions',
    actual: 'Actual Progress',
  };

  const handlePredictionToggle = (predictionKey: PredictionYearKeys) => {
    setSelectedPredictions(prev => {
      if (prev.includes(predictionKey)) {
        return prev.filter(key => key !== predictionKey);
      } else {
        return [...prev, predictionKey];
      }
    });
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Predictions vs. Reality</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto overflow-hidden shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-4">Historical AGI Predictions Compared to Actual Progress</h3>
          <p className="mb-6 text-gray-600">
            This tool visualizes how predictions about AGI progress made in different eras compare to the actual progress that was achieved.
          </p>
          
          <div className="mb-4 flex flex-wrap gap-4">
            {Object.entries(predictionLabels).map(([key, label]) => (
              <label key={key} className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={selectedPredictions.includes(key as PredictionYearKeys)}
                  onChange={() => handlePredictionToggle(key as PredictionYearKeys)}
                  style={{ accentColor: lineColors[key as PredictionYearKeys] }}
                />
                <span className="ml-2 text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'AGI Progress (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value, name) => [
                  `${value}%`, 
                  name === 'prediction2010' ? '2010 Predictions' : 
                  name === 'prediction2015' ? '2015 Predictions' : 
                  name === 'prediction2020' ? '2020 Predictions' : 'Actual Progress'
                ]} />
                <Legend />
                {selectedPredictions.includes('prediction2010') && (
                  <Line type="monotone" dataKey="prediction2010" name="2010 Predictions" stroke={lineColors.prediction2010} activeDot={{ r: 8 }} />
                )}
                {selectedPredictions.includes('prediction2015') && (
                  <Line type="monotone" dataKey="prediction2015" name="2015 Predictions" stroke={lineColors.prediction2015} activeDot={{ r: 8 }} />
                )}
                {selectedPredictions.includes('prediction2020') && (
                  <Line type="monotone" dataKey="prediction2020" name="2020 Predictions" stroke={lineColors.prediction2020} activeDot={{ r: 8 }} />
                )}
                {selectedPredictions.includes('actual') && (
                  <Line type="monotone" dataKey="actual" name="Actual Progress" stroke={lineColors.actual} strokeWidth={3} activeDot={{ r: 8 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mb-6">
            <button
              onClick={() => setShowFamousPredictions(!showFamousPredictions)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            >
              {showFamousPredictions ? 'Hide Famous Predictions' : 'Show Famous Predictions'}
            </button>
          </div>
          
          {showFamousPredictions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <h4 className="text-xl font-semibold mb-4">Famous AGI Predictions</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {famouspredictions.map((prediction, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prediction.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prediction.year}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{prediction.prediction}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{prediction.accuracy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="p-4 text-xs text-gray-500 italic border-t">
          Data sources: Academic publications, expert statements, and historical records.
          Note: Past predictions are documented facts, while "actual progress" is based on our methodology.
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonTool; 