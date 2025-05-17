/**
 * Scores an article based on its contribution to AGI progress
 * @param articleText - The text of the article to be scored
 * @returns A JSON object containing scores for different AGI categories
 */
export async function agiScorer(articleText: string): Promise<{[key: string]: number}> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `
        Analyze the following article and rate its contribution to AGI (Artificial General Intelligence) progress on a scale from 0 to 100 for each of these categories:
        
        - Benchmark Performance: How well does the research perform on standard AI benchmarks, or does it introduce new valuable benchmarks?
        - Transfer Learning: How effectively does the system transfer knowledge between different domains or tasks?
        - Reasoning Capabilities: How sophisticated is the system's logical, causal, or abstract reasoning?
        - Embodied Intelligence: How well does the research address physical interaction, robotics, or real-world sensorimotor capabilities?
        - Social Intelligence: How well does the system understand or engage with human social dynamics, emotions, or intentions?
        
        Provide your response as a JSON object with these categories as keys and numeric scores (0-100) as values.
        
        Article:
        ${articleText}
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as {[key: string]: number};
  } catch (error) {
    console.error('Error scoring article:', error instanceof Error ? error.message : String(error));
    // Return default values in case of error
    return {
      'Benchmark Performance': 0,
      'Transfer Learning': 0,
      'Reasoning Capabilities': 0,
      'Embodied Intelligence': 0,
      'Social Intelligence': 0
    };
  }
} 