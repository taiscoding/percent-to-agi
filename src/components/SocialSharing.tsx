'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SocialSharingProps {
  percentage: number;
}

const SocialSharing = ({ percentage }: SocialSharingProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const shareUrl = "https://percent-to-agi.com";
  const shareText = `Humanity is currently ${percentage}% of the way to Artificial General Intelligence! Check out the latest progress at Percent to AGI.`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = (platform: string) => {
    setSelectedPlatform(platform);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`AGI Progress: ${percentage}%`)}`;
        break;
      case 'reddit':
        shareLink = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Humanity is ${percentage}% of the way to AGI`)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    // Reset selection after a moment
    setTimeout(() => setSelectedPlatform(null), 500);
  };

  return (
    <div className="mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Share the Progress</h2>
      
      <motion.div 
        className="card max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold mb-4">Spread the Word About Our AGI Progress</h3>
        
        <p className="mb-8">
          Think our AGI estimate is spot on? Too optimistic? Too conservative?<br />
          Share it with your network and start a conversation about humanity's technological future!
        </p>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h4 className="font-semibold mb-2">Share this message:</h4>
          <div className="bg-white p-4 rounded border text-gray-700 text-left mb-4">
            {shareText}
          </div>
          
          <button 
            onClick={handleCopyLink}
            className="btn btn-secondary"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        
        <div className="mb-8">
          <h4 className="font-semibold mb-4">Share on social media:</h4>
          
          <div className="flex justify-center gap-6">
            <motion.button
              onClick={() => handleShare('twitter')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: selectedPlatform === 'twitter' ? [1, 1.2, 1] : 1,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center text-white text-2xl mb-2">
                X
              </div>
              <span className="text-sm">Twitter</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('facebook')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: selectedPlatform === 'facebook' ? [1, 1.2, 1] : 1,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-[#4267B2] rounded-full flex items-center justify-center text-white text-2xl mb-2">
                f
              </div>
              <span className="text-sm">Facebook</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('linkedin')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: selectedPlatform === 'linkedin' ? [1, 1.2, 1] : 1,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center text-white text-2xl mb-2">
                in
              </div>
              <span className="text-sm">LinkedIn</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleShare('reddit')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: selectedPlatform === 'reddit' ? [1, 1.2, 1] : 1,
                transition: { duration: 0.3 }
              }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-[#FF4500] rounded-full flex items-center justify-center text-white text-2xl mb-2">
                r
              </div>
              <span className="text-sm">Reddit</span>
            </motion.button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 italic">
          The AGI percentage is updated regularly based on new research and breakthroughs.
          Check back often to see how humanity's progress toward Artificial General Intelligence is evolving!
        </div>
      </motion.div>
    </div>
  );
};

export default SocialSharing; 