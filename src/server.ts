import express from "express";
import dotenv from "dotenv";
import process from "process";
import { sequelize } from "./connector/connector";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import { AppErrorsMessage } from "./enum/AppErrorsMessage";

dotenv.config();

const app = express();
app.use(express.json());

// Connessione DB + sync tabelle
sequelize.getSequelize().authenticate()
  .then(() => {
    console.log("Database connesso!");
    return sequelize.getSequelize().sync({ alter: true }); 
  })
  .then(() => console.log("Tabelle sincronizzate!"))
  .catch((err: unknown) => console.error("Errore connessione DB:", err));

// Route pubbliche
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Route protette
app.use("/api/users", userRoutes);
app.use("/api", adminRoutes);

// Error handler globale
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.status === 401) {
    return res.status(401).json({ error: AppErrorsMessage.INVALID_JWT_TOKEN });
  }
  return res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});