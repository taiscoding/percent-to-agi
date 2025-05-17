import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI configuration with API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI client
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if we have a prompt in the request body
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Check if we have a valid API key
    if (!configuration.apiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.',
      });
    }

    // Call OpenAI API with the prompt
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes AI research and provides numerical ratings on its AGI relevance and impact. You always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    // Extract the response and parse it as JSON
    const responseText = completion.data.choices[0].message.content;
    let jsonResult;

    try {
      // Try to parse the response as JSON
      jsonResult = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          jsonResult = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          throw new Error('Failed to parse OpenAI response as JSON');
        }
      } else {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    }

    // Return the JSON result
    return res.status(200).json(jsonResult);
  } catch (error) {
    // Handle API errors
    console.error('Error with OpenAI API request:', error);
    
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response 
      ? error.response.data.error.message 
      : 'An error occurred during your request.';

    return res.status(statusCode).json({
      error: errorMessage,
    });
  }
} 