import express from "express";
import dotenv from "dotenv";
import process from "process";
import admin from "./routes/admin";

dotenv.config();

const app = express();
app.use(express.json());

// Route pubblica
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Route protette
app.use("/api", admin);

// Error handler Auth0
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.status === 401) {
    return res.status(401).json({ error: "Token non valido." });
  }
  return res.status(500).json({ error: "Errore server." });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});