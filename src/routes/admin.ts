import { Router } from "express";
import { checkJwt } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/roles.middleware";

const router = Router();

router.get("/admin", checkJwt, checkPermission("read:data"), (req, res) => {
  res.json({ message: "Solo admin!" });
});

export default router;