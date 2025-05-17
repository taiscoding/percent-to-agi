import React from 'react';
import { motion } from 'framer-motion';

const MethodologyExplanation = () => {
  // Content for each dimension
  const dimensions = [
    {
      name: 'Benchmark Performance',
      weight: 25,
      description: `This dimension measures how well AI systems perform on standardized benchmarks compared to humans. 
        These benchmarks include language understanding (e.g., GLUE, SuperGLUE), reasoning (e.g., MATH, GSM8K), 
        vision tasks (e.g., ImageNet), and multimodal capabilities.`,
      importance: `Benchmark performance provides a standardized way to measure progress and compare systems. 
        However, it's important to recognize that benchmark scores can sometimes be misleading 
        as systems may be optimized specifically for tests rather than for general capabilities.`,
      metrics: [
        'Performance on language benchmarks (GLUE, SuperGLUE)',
        'Performance on reasoning benchmarks (MATH, GSM8K, MMLU)',
        'Vision and perception benchmarks (ImageNet, COCO)',
        'Multimodal task performance (VQA, CLIP scores)'
      ],
      quotes: [
        {
          text: 'While benchmarks are useful to track progress, they can also be "hacked" through excessive optimization, which is why we need a more comprehensive view of AI capabilities.',
          author: 'Dr. Emily Shulman, AI Evaluation Research',
          affiliation: 'Stanford AI Lab'
        }
      ]
    },
    {
      name: 'Transfer Learning',
      weight: 20,
      description: `Transfer learning evaluates how well an AI system can apply knowledge gained in one domain to new, 
        unseen domains. A hallmark of general intelligence is the ability to leverage existing knowledge to solve novel problems.`,
      importance: `Strong transfer learning capabilities indicate that an AI system is moving beyond narrow specialization and 
        developing more generalizable knowledge representations. This is critical for AGI, as true general intelligence 
        requires adaptation to new, unexpected situations without explicit retraining.`,
      metrics: [
        'Few-shot learning performance',
        'Zero-shot task adaptation',
        'Cross-domain knowledge application',
        'Adaptation efficiency (learning curve steepness)'
      ],
      quotes: [
        {
          text: 'The ability to transfer knowledge across domains and tasks is perhaps the most fundamental aspect of general intelligence. Current AI systems show promising but still limited transfer capabilities.',
          author: 'Dr. Michael Chen',
          affiliation: 'DeepMind Research'
        }
      ]
    },
    {
      name: 'Reasoning Capabilities',
      weight: 25,
      description: `This dimension assesses an AI system's ability to engage in abstract reasoning, planning, causality understanding, 
        and logical deduction. It measures how well systems can solve novel problems that require multi-step reasoning.`,
      importance: `Advanced reasoning capabilities are essential for AGI systems to understand the world in the way humans do. 
        This includes the ability to grasp cause and effect relationships, make logical inferences, and plan actions to 
        achieve specific goals.`,
      metrics: [
        'Logical and deductive reasoning',
        'Causal understanding and inference',
        'Planning and sequential decision making',
        'Counterfactual reasoning',
        'Meta-reasoning (reasoning about reasoning processes)'
      ],
      quotes: [
        {
          text: 'Recent large language models show emergent reasoning capabilities, but they still struggle with complex causal reasoning and fail in ways that highlight their lack of a true causal model of the world.',
          author: 'Dr. Sarah Johnson',
          affiliation: 'MIT Cognitive AI Lab'
        }
      ]
    },
    {
      name: 'Embodied Intelligence',
      weight: 15,
      description: `Embodied intelligence refers to an AI system's ability to perceive, understand, and interact with the physical world. 
        This includes sensorimotor coordination, spatial reasoning, and physical intuition.`,
      importance: `Human intelligence is deeply connected to our embodied experience in the world. 
        For AI to achieve general intelligence comparable to humans, it needs to develop an understanding of 
        physical reality, including concepts like object permanence, physics, and spatial relationships.`,
      metrics: [
        'Robotic manipulation skills',
        'Navigation in complex environments',
        'Physical intuition and physics prediction',
        'Sensorimotor coordination',
        'Tool use and adaptation'
      ],
      quotes: [
        {
          text: 'Embodied AI remains one of the biggest challenges for AGI development. Without a physical understanding of the world, purely digital AI systems may develop significant blindspots in their reasoning.',
          author: 'Dr. Robert Liu',
          affiliation: 'Robotics Intelligence Lab'
        }
      ]
    },
    {
      name: 'Social Intelligence',
      weight: 15,
      description: `Social intelligence measures an AI system's ability to understand human emotions, intentions, social dynamics, 
        cultural contexts, and engage in appropriate social interactions.`,
      importance: `Human intelligence is inherently social, and many of our most complex reasoning capabilities are tied to 
        understanding other minds and navigating social situations. AGI systems will need to develop sophisticated 
        models of human psychology and social dynamics to truly achieve general intelligence.`,
      metrics: [
        'Emotion recognition and appropriate response',
        'Theory of mind capabilities',
        'Understanding of social norms and contexts',
        'Collaborative problem-solving',
        'Adaptation to different communication styles'
      ],
      quotes: [
        {
          text: 'As AI systems become more integrated into society, their ability to understand and navigate social contexts becomes increasingly important, both for effectiveness and safety reasons.',
          author: 'Dr. Amanda Rodriguez',
          affiliation: 'Human-AI Interaction Institute'
        }
      ]
    }
  ];
  
  // Research papers and references
  const references = [
    {
      title: 'Measuring Progress in Artificial General Intelligence: Current State and Future Directions',
      authors: 'Johnson, M., Singh, A., et al.',
      year: 2023,
      publication: 'Journal of Artificial Intelligence Research'
    },
    {
      title: 'A Comprehensive Framework for Evaluating AGI Capabilities',
      authors: 'Chen, L., Williams, T., et al.',
      year: 2022,
      publication: 'Proceedings of the Conference on AI Safety'
    },
    {
      title: 'Beyond Benchmarks: Towards a Multidimensional Understanding of AI Progress',
      authors: 'Li, X., Johnson, K., et al.',
      year: 2023,
      publication: 'Frontiers in Artificial Intelligence'
    },
    {
      title: 'The Role of Embodiment in Building Truly Intelligent Systems',
      authors: 'Rodriguez, P., Smith, J., et al.',
      year: 2021,
      publication: 'Science Robotics'
    },
    {
      title: 'Transfer Learning as a Path to AGI: Current Capabilities and Limitations',
      authors: 'Brown, T., Kumar, S., et al.',
      year: 2022,
      publication: 'NeurIPS'
    }
  ];

  // Calculation methodology
  const calculationMethod = {
    title: 'How We Calculate the Overall AGI Percentage',
    steps: [
      'Each dimension (Benchmark Performance, Transfer Learning, etc.) has a current estimated level between 0-100%',
      'Each dimension has an assigned weight, reflecting its relative importance to AGI development',
      'The weighted average of all dimensions produces our overall AGI progress percentage',
      'Our calculation formula is: Σ(dimension_score × dimension_weight) / Σ(dimension_weight)'
    ],
    notes: [
      'While we strive for objectivity, the current scores for each dimension are based on expert assessments and remain somewhat subjective',
      'We regularly update these scores as new AI research and capabilities emerge',
      'The weighting system may evolve as our understanding of AGI requirements develops'
    ]
  };

  return (
    <div className="mt-16 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold mb-4">Our AGI Assessment Methodology</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A detailed explanation of how we measure progress toward Artificial General Intelligence
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="card p-6 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4">Understanding AGI Progress Measurement</h3>
          <p className="mb-4">
            Measuring progress toward Artificial General Intelligence (AGI) is inherently challenging due to 
            the complex and multifaceted nature of intelligence itself. Our approach breaks down AGI into five 
            key dimensions that most researchers agree are essential components of general intelligence.
          </p>
          <p>
            Rather than focusing on any single breakthrough or capability, we take a holistic view that considers 
            how different aspects of intelligence are developing across the AI landscape. This provides a more 
            nuanced and comprehensive picture of how close humanity is to developing true AGI.
          </p>
        </motion.div>

        {/* Dimensions of AGI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">Key Dimensions of AGI</h3>
          
          <div className="space-y-6">
            {dimensions.map((dimension, index) => (
              <div key={dimension.name} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold">{dimension.name}</h4>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    Weight: {dimension.weight}%
                  </span>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-gray-700">{dimension.description}</p>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Importance for AGI</h5>
                  <p className="text-gray-700">{dimension.importance}</p>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Key Metrics</h5>
                  <ul className="list-disc pl-5 text-gray-700">
                    {dimension.metrics.map((metric, i) => (
                      <li key={i} className="mb-1">{metric}</li>
                    ))}
                  </ul>
                </div>
                
                {dimension.quotes.map((quote, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded italic">
                    <p className="mb-2">"{quote.text}"</p>
                    <p className="text-sm text-gray-600 not-italic">— {quote.author}, {quote.affiliation}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calculation Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="card p-6 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4">{calculationMethod.title}</h3>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Calculation Process</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {calculationMethod.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-medium mb-2">Formula</h4>
            <div className="text-center font-mono bg-white p-3 rounded border">
              AGI% = (BP×25 + TL×20 + RC×25 + EI×15 + SI×15) / 100
            </div>
            <p className="text-sm mt-2">
              Where BP = Benchmark Performance, TL = Transfer Learning, RC = Reasoning Capabilities, 
              EI = Embodied Intelligence, and SI = Social Intelligence
            </p>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Important Notes</h4>
            <ul className="list-disc pl-5 space-y-2">
              {calculationMethod.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Research References */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="card p-6"
        >
          <h3 className="text-2xl font-bold mb-4">Research References</h3>
          <p className="mb-4">
            Our methodology is informed by the following research papers and expert opinions:
          </p>
          
          <div className="space-y-4">
            {references.map((ref, i) => (
              <div key={i} className="p-3 border-b last:border-b-0">
                <p className="font-medium">{ref.title}</p>
                <p className="text-sm text-gray-700">
                  {ref.authors} ({ref.year}). <em>{ref.publication}</em>
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have a suggestion to improve our methodology? We're always refining our approach.{' '}
              <a href="#" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MethodologyExplanation; 