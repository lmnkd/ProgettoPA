import { Router } from "express";
import { vaccinazioneController } from "../controller/VaccinazioneController";
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { checkTokenAvailability } from "../middleware/token.middleware";



const router = Router();


router.post('/creavaccinazione', authenticate, requireRole("operator"), checkTokenAvailability, vaccinazioneController.createVaccinazione)
router.get('/getvaccinazione/:id', authenticate, requireRole("operator"), vaccinazioneController.getVaccinazioneById)
router.get('/getallvaccinazioni', authenticate, requireRole("operator"), vaccinazioneController.getAllVaccinazioni)
router.put('/updatevaccinazione/:id', authenticate, requireRole("operator"), vaccinazioneController.updateVaccinazione)
router.delete('/deletevaccinazione/:id', authenticate, requireRole("operator"), vaccinazioneController.deleteVaccinazione)
