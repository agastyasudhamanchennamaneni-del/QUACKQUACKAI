// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import fetch from "node-fetch";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

// ✅ Root route (so you don’t see “Cannot GET /”)
app.get("/", (req, res) => {
  res.send("🩺 Medical Grok AI backend is running!");
});

// ✅ Health-check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Example: handle medical AI queries
app.post("/api/query", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    // GROQ API call
    const grogResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROG}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are Medical Grok AI — an intelligent medical assistant that diagnoses diseases, explains symptoms, gives nutritional advice, and builds personalized diet plans. Keep responses concise and accurate.",
          },
          { role: "user", content: query },
        ],
      }),
    });

    const data = await grogResponse.json();
    res.json(data);
  } catch (err) {
    console.error("GROG API Error:", err);
    res.status(500).json({ error: "Server error while contacting GROG API" });
  }
});

// ✅ Example: nutrition info using SERP API
app.post("/api/nutrition", async (req, res) => {
  try {
    const { food } = req.body;
    if (!food) return res.status(400).json({ error: "Missing food name" });

    const serpUrl = `https://serpapi.com/search.json?q=nutrition facts ${encodeURIComponent(
      food
    )}&api_key=${process.env.SERP_API_KEY}`;

    const response = await fetch(serpUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("SERP API Error:", err);
    res.status(500).json({ error: "Server error while contacting SERP API" });
  }
});

// ✅ Port (Render requires process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
