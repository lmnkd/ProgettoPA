import {vaccinazioneDao} from "../dao/VaccinazioneDao";
import {AppErrorsName} from "../enum/AppErrorsName";
import { VaccinazioneAttributes } from "../model/Vaccinazione";
import PDFDocument from "pdfkit";
import { userDao } from "../dao/UserDao";


interface CreateVaccinazioneInput {
    user_cf: string;
    lotto_id: number;
    vaccino_id: number;
    data_vaccinazione: Date;
}

export class VaccinazioneService {

    async createVaccinazione(data: CreateVaccinazioneInput) {
        return vaccinazioneDao.create({
            userCf: data.user_cf,
            lottoId: data.lotto_id,
            vaccinoId: data.vaccino_id,
            dataVaccinazione: data.data_vaccinazione,
        });
    }
    

    async getVaccinazioneById(targetId: number) {
        const vaccinazione = await vaccinazioneDao.findById(targetId);
        if (!vaccinazione) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }
        return vaccinazione;
    }   

    async getAllVaccinazioni() {
        return vaccinazioneDao.findAll();
    }

     async updateVaccinazione(
        targetId: number,
        updatedData: Partial<VaccinazioneAttributes>
    ) {
        const updatedVaccinazione = await vaccinazioneDao.update({ id: targetId }, updatedData);
        if (!updatedVaccinazione) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }

        return updatedVaccinazione;
    }

    async deleteVaccinazione(targetId: number) {
        const deleted = await vaccinazioneDao.delete(targetId);
        if (!deleted) {
            const err = new Error("Vaccinazione not found");
            err.name = AppErrorsName.VACCINAZIONE_NOT_FOUND;
            throw err;
        }       
        return deleted;
    }   

    async generatePdfReport(cf: string): Promise<Buffer> {

    console.log("si ferma qui")
    const user = await userDao.findById(cf);

    if (!user) {
        const err = new Error("User not found");
        err.name = AppErrorsName.USER_NOT_FOUND;
        throw err;
    }

    console.log("errore in vaccinazione")
    const vaccinazioni = await vaccinazioneDao.findAllByUserCf(cf);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 50,
            info: {
                Title: `Vaccinazioni - ${cf}`,
                Author: "Sistema Gestione Vaccinazioni",
            },
        });

        const chunks: Uint8Array[] = [];

        doc.on("data", (chunk: Uint8Array) => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            const totalLength = chunks.reduce(
                (sum, chunk) => sum + chunk.length,
                0
            );

            const result = new Uint8Array(totalLength);

            let offset = 0;

            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            resolve(Buffer.from(result));
        });

        doc.on("error", reject);

        // Intestazione report
        doc.fontSize(18).text("Report Vaccinazioni", {
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(12).text(`Utente: ${user.name}`);
        doc.text(`CF: ${user.cf}`);
        doc.text(
            `Generato il: ${new Date().toLocaleDateString("it-IT")}`
        );

        doc.moveDown(2);

        if (vaccinazioni.length === 0) {
            doc.fontSize(12).text("Nessuna vaccinazione registrata.");
        } else {
            const startX = 50;

            const drawTableHeader = (y: number): number => {
                doc.fontSize(10).font("Helvetica-Bold");

                doc.text("Vaccino", startX, y, { width: 150 });
                doc.text("Lotto", startX + 150, y, { width: 100 });
                doc.text("Data vaccinazione", startX + 250, y, { width: 120 });
                doc.text("Copertura (gg)", startX + 370, y, { width: 100 });

                y += 20;

                doc.moveTo(startX, y)
                    .lineTo(startX + 470, y)
                    .stroke();

                doc.font("Helvetica");

                return y + 10;
            };

            let y = drawTableHeader(doc.y);

            for (const v of vaccinazioni as any[]) {
                if (y > doc.page.height - 80) {
                    doc.addPage();
                    y = drawTableHeader(50);
                }

                const dataFormatted = new Date(
                    v.dataVaccinazione
                ).toLocaleDateString("it-IT");

                doc.text(
                    v.Vaccino?.nome ?? "-",
                    startX,
                    y,
                    { width: 150 }
                );

                doc.text(
                    v.LottoVaccino?.codiceLotto ?? "-",
                    startX + 150,
                    y,
                    { width: 100 }
                );

                doc.text(
                    dataFormatted,
                    startX + 250,
                    y,
                    { width: 120 }
                );

                doc.text(
                    String(v.Vaccino?.durataCopertura ?? "-"),
                    startX + 370,
                    y,
                    { width: 100 }
                );

                y += 20;
            }
        }

        doc.end();
    });
}

}

export const vaccinazioneService = new VaccinazioneService();