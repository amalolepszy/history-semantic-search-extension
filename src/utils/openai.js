import OpenAI from 'openai';

const getClient = (apiKey) => {
  return new OpenAI({
    apiKey: apiKey, // This will now be your Gemini API Key
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true
  });
};

export async function generateChatCompletion(messages, apiKey) {
  const client = getClient(apiKey);

  try {
    const completion = await client.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: messages,
      temperature: 0.7,
    });

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

    return response.data[0].embedding;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    throw error;
  }
}
