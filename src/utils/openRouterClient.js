
/**
 * OpenRouter Client with Multi-Model and Multi-Key Fallback Support
 * 
 * Attempts to generate content using OpenRouter API.
 * For each API key, tries multiple free models before moving to next key.
 */

// List of free models to try in order
const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-flash-1.5-8b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2-7b-instruct:free"
];

export const generateContentWithFallback = async (prompt) => {
  // Collection of keys to try in order
  const keys = [
    import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY,
    import.meta.env.VITE_OPENROUTER_FALLBACK_API_KEY || import.meta.env.OPENROUTER_FALLBACK_API_KEY,
    import.meta.env.VITE_OPENROUTER_FALLBACK_API_KEY_2 || import.meta.env.OPENROUTER_FALLBACK_API_KEY_2
  ].filter(Boolean);

  if (keys.length === 0) {
    throw new Error('No OpenRouter API keys found. Please add OPENROUTER_API_KEY to your .env.local file.');
  }

  let lastError = null;

  // Try each API key
  for (const apiKey of keys) {
    // For each key, try multiple models
    for (const model of FREE_MODELS) {
      try {
        console.log(`Trying model: ${model} with key: ${apiKey.substring(0, 8)}...`);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin, 
            "X-Title": "Canvas CRM",
          },
          body: JSON.stringify({
            "model": model,
            "messages": [
              {
                "role": "user",
                "content": prompt
              }
            ],
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorCode = response.status;
          
          // If rate limited (429), try next model
          if (errorCode === 429) {
            console.warn(`Model ${model} rate limited, trying next model...`);
            lastError = new Error(`Rate limited on ${model}`);
            continue; // Try next model
          }
          
          // For auth errors (401, 402), try next key
          if (errorCode === 401 || errorCode === 402) {
            console.warn(`Auth error with key ${apiKey.substring(0, 8)}..., trying next key...`);
            lastError = new Error(`Auth error: ${errorCode}`);
            break; // Break to next key
          }
          
          throw new Error(`OpenRouter API Error: ${errorCode} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          console.log(`Success with model: ${model}`);
          return {
            text: data.choices[0].message.content
          };
        } else {
          throw new Error("Invalid response format from OpenRouter");
        }

      } catch (error) {
        console.warn(`Attempt failed with model ${model}:`, error.message);
        lastError = error;
        // Continue to next model
      }
    }
  }

  // If we exit all loops, everything failed
  throw lastError || new Error("Failed to generate content with all available API keys and models.");
};
