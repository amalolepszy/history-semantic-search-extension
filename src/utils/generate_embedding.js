export async function generateEmbedding(text, apiKey) {
  if (!text || !apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.data && result.data[0]) {
      return result.data[0].embedding;
    }
    
    return null;

  } catch (error) {
    console.error("Failed to generate embedding:", error);
    throw error;
  }
}
