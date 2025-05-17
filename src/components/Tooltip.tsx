'use client';
import { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-10 ${positionStyles[position]} bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-xs`}>
          {content}
          <div 
            className={`
              absolute w-2 h-2 bg-gray-800 transform rotate-45
              ${position === 'top' ? 'top-full -translate-x-1/2 left-1/2 -mt-1' : ''}
              ${position === 'right' ? 'right-full translate-y-1/2 top-1/4 -mr-1' : ''}
              ${position === 'bottom' ? 'bottom-full -translate-x-1/2 left-1/2 -mb-1' : ''}
              ${position === 'left' ? 'left-full translate-y-1/2 top-1/4 -ml-1' : ''}
            `}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 