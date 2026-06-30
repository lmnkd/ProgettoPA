import { checkVaccinoExistsById } from "../middleware/vaccino.middleware";
import { vaccinoDao } from "../dao/VaccinoDao";

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

});