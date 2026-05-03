import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy Anthropic API to avoid CORS issues
  app.post("/api/analyze", async (req, res) => {
    const { complaint } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "ANTHROPIC_API_KEY is not configured in environment variables." 
      });
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: "You are a civic complaint analyzer. Given a complaint, return ONLY a JSON object with keys: category (string), priority (High|Medium|Low), priority_reason (one sentence), actions (array of 4 strings). No markdown, no preamble, just the JSON.",
          messages: [{ role: "user", content: complaint }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      const content = data.content[0].text;
      const result = JSON.parse(content);
      res.json(result);
    } catch (error) {
      console.error("Proxy Error:", error);
      res.status(500).json({ error: "Failed to communicate with Anthropic API" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    // In development, we use Vite to serve the project
    // But since the user is explicitly using index.html in the root (legacy style),
    // we'll serve it as a static file if it exists, or use Vite if they had a React app.
    
    // Check if index.html exists in root
    if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
      app.get('/', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'index.html'));
      });
    }

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
