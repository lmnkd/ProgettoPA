import { Router } from "express";
import { lottoVaccinoController } from "../controller/LottoVaccinoController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkVaccinoExists, checkCodiceLottoUnique, checkQuantitaPositiva, checkDateCoerenti } from "../middleware/lottovaccino.middleware";

const router = Router();

// creare lotto per vaccino
router.post(
    "/vaccini/:vaccinoId/lotti",
    authenticate,
    requireRole("admin"),
    checkVaccinoExists,
    checkCodiceLottoUnique,
    checkQuantitaPositiva,
    checkDateCoerenti,
    lottoVaccinoController.createLotto
);

// ottenere lotti per vaccino
router.get(
    "/vaccini/:vaccinoId/lotti",
    authenticate,
    requireRole("operator", "admin"),
    checkVaccinoExists,
    lottoVaccinoController.getLottiByVaccino
);

export default router;