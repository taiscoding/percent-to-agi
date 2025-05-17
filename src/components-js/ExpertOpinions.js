import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';

// Import CSS for slick carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ExpertOpinions = () => {
  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "AI Research Director, Stanford University",
      quote: "I believe we're at roughly 60% of the way to AGI. The biggest hurdles remaining are in generalized reasoning and transfer learning across domains.",
      image: "https://via.placeholder.com/100",
      year: 2025
    },
    {
      id: 2,
      name: "Prof. Marcus Thompson",
      title: "Cognitive Science Chair, MIT",
      quote: "We're still only at about 35% of true AGI. Current systems lack consciousness, intentionality, and genuine understanding of causality.",
      image: "https://via.placeholder.com/100",
      year: 2025
    },
    {
      id: 3,
      name: "Dr. Emily Nakamura",
      title: "Lead AI Researcher, Google DeepMind",
      quote: "I'd put us at 72% of the way to AGI. Our multi-agent systems are showing emergent behaviors that suggest a path toward more generalized intelligence.",
      image: "https://via.placeholder.com/100",
      year: 2025
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      title: "Chief Scientist, OpenAI",
      quote: "We're approximately 55% of the way there. While our models show remarkable capabilities in language and reasoning, they still lack robust common sense and self-awareness.",
      image: "https://via.placeholder.com/100",
      year: 2025
    },
    {
      id: 5,
      name: "Prof. Alexandra Rodriguez",
      title: "Director, Center for Human-Compatible AI",
      quote: "I estimate we're only 42% towards AGI. The most critical remaining challenges lie in safety, alignment, and developing systems that truly understand human values.",
      image: "https://via.placeholder.com/100",
      year: 2025
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    arrows: true
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Expert Opinions</h2>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="card"
        >
          <Slider {...settings}>
            {experts.map((expert) => (
              <div key={expert.id} className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-6 relative">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary"
                    />
                    <div className="absolute bottom-0 right-0 bg-secondary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {expert.year}
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold">{expert.name}</h3>
                    <p className="text-gray-600">{expert.title}</p>
                  </div>
                  
                  <div className="relative">
                    <svg className="absolute -top-3 -left-3 w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-lg italic text-center px-10 py-2">{expert.quote}</p>
                    <svg className="absolute -bottom-3 -right-3 w-8 h-8 text-gray-300 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-4">Average estimate from our panel of experts:</p>
          <div className="flex justify-center items-center bg-light rounded-full w-24 h-24 mx-auto shadow-md">
            <span className="text-3xl font-bold text-primary">52.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertOpinions; 