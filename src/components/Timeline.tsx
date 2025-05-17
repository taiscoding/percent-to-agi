import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  impact: number;
  references: string[];
  media: string | null;
}

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Fetch timeline events
  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/timeline');
        
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data');
        }
        
        const data = await response.json();
        setEvents(data.events || []);
        setLoading(false);
      } catch (err) {
        setError('Error loading timeline events');
        setLoading(false);
        console.error('Error fetching timeline events:', err);
      }
    };
    
    fetchTimelineEvents();
  }, []);

  // Get unique categories for filtering
  const uniqueCategories = Array.from(new Set(events.map(event => event.category)));
  const categories = ['all', ...uniqueCategories];

  // Filter events based on selected category
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  // Calculate the "impact size" for visual representation
  const getImpactSize = (impact: number) => {
    // Map impact 1-10 to size range 40-80px
    return 40 + (impact * 4);
  };

  // Handle event click - set the selected event
  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  // Close the event details modal
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Render impact indicator with size based on impact score
  const renderImpactIndicator = (impact: number) => {
    const size = getImpactSize(impact);
    const colors = {
      10: '#e74c3c', // Highest impact - red
      9: '#e67e22',
      8: '#f39c12',
      7: '#f1c40f',
      6: '#2ecc71',
      5: '#27ae60',
      4: '#3498db',
      3: '#2980b9',
      2: '#9b59b6',
      1: '#8e44ad'  // Lowest impact - purple
    };
    
    return (
      <div 
        className="rounded-full absolute -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-white"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: colors[impact as keyof typeof colors] || '#3498db',
          top: '50%',
          left: '50%'
        }}
      />
    );
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">AI Timeline</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div>
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  filter === category 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Timeline visualization */}
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 -translate-x-1/2"></div>
            
            {/* Timeline events */}
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className={`relative mb-16 flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Content side */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <span className="text-primary font-medium">
                    {format(parseISO(event.date), 'MMMM d, yyyy')}
                  </span>
                  <p className="mt-2 text-gray-600 line-clamp-3">{event.description}</p>
                  <button
                    onClick={() => handleEventClick(event)}
                    className="mt-2 text-primary font-medium hover:underline"
                  >
                    Read more
                  </button>
                </div>
                
                {/* Center point with impact indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center z-20">
                  {renderImpactIndicator(event.impact)}
                </div>
                
                {/* Empty space for the other side */}
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Event details modal */}
          {selectedEvent && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={closeEventDetails}
            >
              <motion.div 
                className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-auto"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
                    <p className="text-primary font-medium">
                      {format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <button 
                    onClick={closeEventDetails}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary">
                    {selectedEvent.category}
                  </span>
                  <span className="inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium bg-accent bg-opacity-10 text-accent">
                    Impact: {selectedEvent.impact}/10
                  </span>
                </div>
                
                {selectedEvent.media && (
                  <div className="mb-4">
                    <img 
                      src={selectedEvent.media} 
                      alt={selectedEvent.title} 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
                
                {selectedEvent.references && selectedEvent.references.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">References:</h4>
                    <ul className="list-disc pl-5">
                      {selectedEvent.references.map((ref, index) => (
                        <li key={index} className="mb-1">
                          <a 
                            href={ref} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline; 