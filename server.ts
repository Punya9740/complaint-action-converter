import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Hackathon-Ready User Store (Replaces MongoDB) ---
const USERS_FILE = path.join(process.cwd(), "users.json");

// Helper to get users from file
async function getUsers() {
  try {
    if (!fs.existsSync(USERS_FILE) || fs.readFileSync(USERS_FILE, "utf-8").trim() === "" || JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")).length === 0) {
      console.log("Seeding default users...");
      const defaultUsers = [
        { id: "1", username: "citizen", password: await bcrypt.hash("citizen123", 10), role: "citizen" },
        { id: "2", username: "admin", password: await bcrypt.hash("admin@123", 10), role: "admin" },
        { id: "3", username: "user1", password: await bcrypt.hash("pass123", 10), role: "citizen" }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading users file:", err);
  }
  return [];
}

// Helper to save users to file
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Auth API Routes ---

  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, role } = req.body;
      console.log(`Registration attempt for: ${username}`);

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const users = await getUsers();
      if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role: role || "citizen"
      };

      saveUser(newUser);
      console.log(`User registered successfully: ${username}`);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error during registration" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(`Login attempt for: ${username}`);

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const users = await getUsers();
      const user = users.find(u => u.username === username);

      if (!user) {
        console.log(`Login failed: User ${username} not found`);
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Login failed: Incorrect password for ${username}`);
        return res.status(401).json({ message: "Incorrect password" });
      }

      console.log(`Login successful for: ${username}`);
      res.status(200).json({
        message: "Login successful",
        user: {
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error during login" });
    }
  });

  // --- Vite Middleware ---
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
