import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Gemini AI client lazily
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment. Please add it via Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API endpoints must be mounted FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { contents, systemInstruction } = req.body;

      if (!contents || !Array.isArray(contents)) {
        res.status(400).json({ error: "Invalid request: 'contents' array is required." });
        return;
      }

      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error: "API_KEY_MISSING",
          message: "Gemini API key is missing. Please configure 'GEMINI_API_KEY' in the Secrets panel in AI Studio settings."
        });
        return;
      }

      const client = getGeminiClient();

      // System instruction for copyright-free corporate AI Chat Bot
      const defaultSystemInstruction = 
        "You are a highly capable, completely free, and copyright-free AI Chat Bot. " +
        "Your goal is to assist the user as a neutral, open, and helpful AI companion. " +
        "You speak and reply in the same language as the user's input. " +
        "If they speak Bengali (বাংলা), you must reply in elegant, natural, and grammatically correct Bengali. " +
        "Focus on delivering rich, copyright-free, plagiarism-free information. " +
        "Provide thorough code, creative writing, advice, and answers with proper structural formatting. " +
        "Make extensive use of clean Markdown (bold texts, bulleted points, code sections, tables) to make replies highly readable.";

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents, // already structured as { role: 'user'|'model', parts: [{ text: string }] }
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ 
        error: "INTERNAL_ERROR", 
        message: error?.message || "An unexpected error occurred while communicating with Gemini API." 
      });
    }
  });

  // Vite integration for dev vs prod environments
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the server:", err);
});
