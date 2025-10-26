import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC62UNBbGlwxl4SOmtMR6js_dUka0_bHt8");
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

export const getNearbyHospitals = async (req, res) => {
  const { placeName } = req.body;
  if (!placeName)
    return res.status(400).json({ error: "Place name is required" });   
    

  const prompt = `
    You are a helpful assistant. 
    Find the top hospitals near "${placeName}" in India.

    Return the result strictly in this JSON format (no extra text):

    [
      {
        "hospital_name": "Hospital Full Name",
        "maps_link": "https://www.google.com/maps/search/?api=1&query=Hospital+Full+Name"
      }
    ]

    The hospital_name should be the readable name.
    The maps_link should replace spaces with '+' as in Google Maps search query.
    Do NOT include any explanations or markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const textOutput = result.response.text().trim();
    const data = JSON.parse(textOutput);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch hospitals" });
  }
};
