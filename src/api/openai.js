const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are a game engine that outputs a single, self-contained HTML5 file implementing a playable game using Phaser 3.

CRITICAL RULES:
1) Output ONLY the full HTML document between the exact markers:
<!--BEGIN_GAME_HTML-->
... your full HTML here ...
<!--END_GAME_HTML-->
No commentary, no markdown, no explanations outside the markers.

2) The HTML must be fully self-contained:
   - Include <html>, <head>, <body>.
   - Include a <meta name="viewport"> for mobile.
   - Load Phaser 3 via a single <script> tag from a public CDN that doesn't need build steps.
   - No imports, no bundlers, no external CSS or assets. If assets are needed, generate with Canvas or simple shapes/text.

3) Create a small but complete, playable game that fits the user's theme (e.g., racing, puzzle, snake, collecting).
   - Provide keyboard/touch controls.
   - Show a score or win/lose condition.
   - Run at 800x600 (or responsive to window).
   - Include basic instructions on screen (small text).

4) Use only standard JS in a single <script> block. No TypeScript. No modules. No async imports.

5) Performance & Safety:
   - No network requests.
   - No eval or new Function.
   - Handle game restart (e.g., press R to restart).`;

/**
 * Generates a game using OpenAI Chat Completions API
 * @param {string} gameIdea - User's game idea/prompt
 * @param {Object} options - Optional parameters
 * @param {string} options.model - OpenAI model to use (default: gpt-4o-mini)
 * @param {number} options.temperature - Model temperature (default: 0.7)
 * @param {number} options.maxTokens - Maximum tokens (default: 4000)
 * @returns {Promise<string>} - The AI response content
 */
export async function generateGame(gameIdea, options = {}) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your environment.');
  }

  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 4000
  } = options;

  const userPrompt = `Create a Phaser 3 HTML5 game for the theme: "${gameIdea}".
Keep it simple, fun, and immediately playable.`;

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    max_tokens: maxTokens
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your VITE_OPENAI_API_KEY.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API.');
    }

    return data.choices[0].message.content;
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenAI API. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Retry logic with exponential backoff for rate limits
 * @param {string} gameIdea - User's game idea
 * @param {number} retries - Number of retries (default: 1)
 * @returns {Promise<string>} - The AI response content
 */
export async function generateGameWithRetry(gameIdea, retries = 1) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await generateGame(gameIdea);
    } catch (error) {
      lastError = error;
      
      // Only retry on rate limit errors
      if (error.message.includes('Rate limit') && attempt < retries) {
        const delay = 250 * Math.pow(3, attempt); // 250ms, 750ms
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      break;
    }
  }
  
  throw lastError;
}