import { correctAmount } from "../middleware/token.middleware";
import { AppErrorsMessage } from "../enum/AppErrorsMessage";

describe("correctAmount", () => {

    test("restituisce 400 se amount manca", async () => {
        const req: any = {
            body: {}
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await correctAmount(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: AppErrorsMessage.MISSING_DATA
        });
        expect(next).not.toHaveBeenCalled();
    });

    test("chiama next se amount è valido", async () => {
        const req: any = {
            body: {
                amount: 10
            }
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await correctAmount(req, res, next);

        expect(next).toHaveBeenCalled();
    });

});