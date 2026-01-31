import OpenAI from 'openai';

const getClient = (apiKey) => {
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true
  });
};

export async function generateChatCompletion(messages, apiKey) {
  const client = getClient(apiKey);

  try {
    const completion = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: messages,
      temperature: 0.7,
    });

    // Logowanie zużycia tokenów
    if (completion.usage) {
      console.log(
        `[Chat] Total Tokens: ${completion.usage.total_tokens} ` + 
        `(Prompt: ${completion.usage.prompt_tokens}, Output: ${completion.usage.completion_tokens})`
      );
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}

export async function generateEmbedding(text, apiKey) {
  const client = getClient(apiKey);

  try {
    const response = await client.embeddings.create({
      model: "gemini-embedding-001",
      input: text,
    });

    // --- LOGGING TOKENS ---
    if (response.usage) {
      console.log(`[Embedding] Tokens: ${response.usage.total_tokens}`);
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    throw error;
  }
}
