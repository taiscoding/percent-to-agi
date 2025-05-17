'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AGIPercentageProps {
  percentage: number;
}

const AGIPercentage: React.FC<AGIPercentageProps> = ({ percentage }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Use Framer Motion's spring animation for smooth percentage changes
  const springPercentage = useSpring(0, { stiffness: 80, damping: 20 });
  const displayPercentage = useTransform(springPercentage, Math.round);
  
  useEffect(() => {
    springPercentage.set(percentage);
    setIsVisible(true);
  }, [percentage, springPercentage]);

  return (
    <div className="relative flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-80 h-80"
      >
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="stroke-primary"
            cx="50"
            cy="50"
            r="48"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="301.59"
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {/* Percentage display */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <motion.div
            key={percentage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="text-5xl font-bold text-primary flex items-baseline">
              <motion.span>{displayPercentage}</motion.span>
              <span className="text-2xl ml-1">%</span>
            </div>
            <div className="text-lg mt-2 text-center font-medium">progress to AGI</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm mt-4 text-gray-500 italic text-center max-w-xs"
          >
            {percentage < 30 ? "Still a long way to go..." : 
             percentage < 50 ? "Making steady progress..." : 
             percentage < 70 ? "Getting closer!" : 
             percentage < 90 ? "Almost there!" : 
             "Preparing for the robot overlords!"}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white"
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.2, 1, 1.1, 1] 
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <span className="text-xl">🧠</span>
      </motion.div>
      
      <motion.div 
        className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white"
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1, 1.2, 1] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1 
        }}
      >
        <span className="text-lg">💡</span>
      </motion.div>
    </div>
  );
};

export default AGIPercentage; 