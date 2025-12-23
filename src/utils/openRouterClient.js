
/**
 * OpenRouter Client with Fallback Support
 * 
 * Attempts to generate content using OpenRouter API.
 * Tries multiple API keys in sequence if one fails (401/402/etc).
 */
export const generateContentWithFallback = async (prompt) => {
  // Collection of keys to try in order
  // We check both VITE_ prefixed (standard) and OPENROUTER_ prefixed (configured in vite.config.js)
  const keys = [
    import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY,
    import.meta.env.VITE_OPENROUTER_FALLBACK_API_KEY || import.meta.env.OPENROUTER_FALLBACK_API_KEY,
    import.meta.env.VITE_OPENROUTER_FALLBACK_API_KEY_2 || import.meta.env.OPENROUTER_FALLBACK_API_KEY_2
  ].filter(Boolean); // Remove undefined/null/empty keys

  if (keys.length === 0) {
    throw new Error('No OpenRouter API keys found. Please add OPENROUTER_API_KEY to your .env.local file.');
  }

  let lastError = null;

  for (const apiKey of keys) {
    try {
        console.log(`Attempting OpenRouter call with key starting: ${apiKey.substring(0, 8)}...`);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // Optional: Add site URL/name for OpenRouter rankings
            "HTTP-Referer": window.location.origin, 
            "X-Title": "Canvas CRM",
            },
            body: JSON.stringify({
            "model": "google/gemini-2.0-flash-exp:free", // Use a free/fast model by default
            "messages": [
                {
                "role": "user",
                "content": prompt
                }
            ],
            // Ensure we just get the text back, mainly
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        // Extract the content from the response
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return {
                text: data.choices[0].message.content
            };
        } else {
             throw new Error("Invalid response format from OpenRouter");
        }

    } catch (error) {
        console.warn(`Attempt failed with key ${apiKey.substring(0, 8)}...`, error);
        lastError = error;
        // Continue to next key loop
    }
  }

  // If we exit the loop, all keys failed
  throw lastError || new Error("Failed to generate content with all available API keys.");
};
