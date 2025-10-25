import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const callGroqAPI = async (prompt, temperature = 0.3, maxTokens = 2000) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        temperature: temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: "system",
            content:
              "You are a clinical AI assistant providing evidence-based, structured health recommendations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    throw new Error("Failed to get response from AI service");
  }
};

export { callGroqAPI };
