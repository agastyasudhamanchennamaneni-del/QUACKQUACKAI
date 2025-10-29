import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "./middleware/rateLimit.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit);

const GROG_API = process.env.GROG;
const SERP_API = process.env.SERP_API_KEY;
const PORT = process.env.PORT || 5000;

function isEmergency(symptoms) {
  const danger = [
    "chest pain",
    "difficulty breathing",
    "severe bleeding",
    "loss of consciousness",
    "suicidal",
  ];
  return danger.some(d => (symptoms || "").toLowerCase().includes(d));
}

app.post("/api/query", async (req, res) => {
  const { query, age, sex, allergies, medications } = req.body;
  if (!query) return res.status(400).json({ error: "query required" });

  if (isEmergency(query)) {
    return res.json({
      emergency: true,
      message: "⚠️ Possible emergency — seek immediate medical help!",
    });
  }

  try {
    // --- GROG API CALL ---
    const grogResponse = await fetch("https://api.grog.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROG_API}`,
      },
      body: JSON.stringify({
        model: "grok-medical",
        messages: [
          {
            role: "system",
            content:
              "You are a grok-style medical assistant. Always warn users that you are not a doctor. Provide possible causes, confidence levels, and dietary advice. Be concise, witty, and smart like GROK.",
          },
          {
            role: "user",
            content: `User: ${query}. Age: ${age || "N/A"} | Sex: ${sex || "N/A"} | Allergies: ${
              allergies || "none"
            } | Medications: ${medications || "none"}`,
          },
        ],
      }),
    });
    const grogData = await grogResponse.json();

    // --- SERP API CALL ---
    const serpResponse = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        query + " nutrition or medical site"
      )}&api_key=${SERP_API}`
    );
    const serpData = await serpResponse.json();

    res.json({
      emergency: false,
      grogResult: grogData,
      serpResult: serpData.organic_results?.slice(0, 3),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
