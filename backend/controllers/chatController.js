import { callGroqAPI } from "../services/groqService.js";

export const chatWithDoctor = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const prompt = `
You are Dr. X, a virtual AI health expert providing trustworthy medical guidance.

The user asked: "${message}"

Please:
- Respond in a conversational and empathetic tone.
- Provide evidence-based health advice.
- If symptoms are mentioned, suggest possible causes and safe next steps.
- Always recommend seeing a licensed doctor for diagnosis.
- Give short and simple answers.
`;

    const aiResponse = await callGroqAPI(prompt);

    res.json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      reply:
        "An error occurred while generating a response. Please try again later.",
    });
  }
};
