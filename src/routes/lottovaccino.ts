import { Router } from "express";
import { lottoVaccinoController } from "../controller/LottoVaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// creare lotto per vaccino
router.post(
    "/vaccini/:vaccinoId/lotti",
    authenticate,
    requireRole("operator"),
    lottoVaccinoController.createLotto
);

// ottenere lotti per vaccino
router.get(
    "/vaccini/:vaccinoId/lotti",
    authenticate,
    (req, res) => lottoVaccinoController.getLottiByVaccino(req, res)
);

// UPDATE


// DELETE




export default router;