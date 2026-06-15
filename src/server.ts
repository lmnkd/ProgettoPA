import express from "express";
import dotenv from "dotenv";
import process from "process";
import { checkJwt } from "./middleware/auth.middleware";
import { AppErrorsMessage } from "./enum/AppErrorsMessage";

dotenv.config();

const app = express();
app.use(express.json());

// Route pubblica
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Route protetta — richiede JWT Auth0 valido
app.get("/protected", checkJwt, (req, res) => {
  res.json({ message: "Accesso autorizzato." });
});

// Gestione errori Auth0
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.status === 401) {
    return res.status(401).json({ error: AppErrorsMessage.INVALID_JWT_TOKEN });
  }
  return res.status(500).json({ error: AppErrorsMessage.SERVER_ERROR });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on http://localhost:3000");
});