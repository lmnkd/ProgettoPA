import { checkVaccinoExistsById } from "../middleware/vaccino.middleware";
import { vaccinoDao } from "../dao/VaccinoDao";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

jest.mock("../dao/VaccinoDao", () => ({
    vaccinoDao: {
        findById: jest.fn()
    }
}));

describe("checkVaccinoExistsById", () => {

    test("chiama next se il vaccino esiste", async () => {
        (vaccinoDao.findById as jest.Mock).mockResolvedValue({
            id: 1,
            nome: "Pfizer"
        });

        const req: any = {
            params: { id: "1" }
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await checkVaccinoExistsById(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("restituisce 404 se il vaccino non esiste", async () => {
    (vaccinoDao.findById as jest.Mock).mockResolvedValue(null);

    const req: any = {
        params: { id: "999" }
    };

    const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const next = jest.fn();

    await checkVaccinoExistsById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: AppErrorsMessage.VACCINO_NOT_FOUND });
    expect(next).not.toHaveBeenCalled();
});

    
});

