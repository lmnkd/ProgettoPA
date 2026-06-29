import { Router } from "express";
import { adminController } from "../controller/AdminController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { vaccinazioneController, VaccinazioneController } from "../controller/VaccinazioneController";

const router = Router();



// Rotta per aggiungere token ad un User o Operator
router.get('/admin/addToken/:cf', authenticate, requireRole("admin"), adminController.increaseUserTokens)


// Rotta token redis admin/code mettere nel body l'utente che si vuole vedere senza usare il JWT
router.post('/admin/code', authenticate, requireRole("admin"),  vaccinazioneController.generateCoperturaCode)



export default router;
