import { AppErrorsName } from "../../enum/AppErrorsName";
import {AppLogicError} from "../../errors/App_Logic_Error";
import process from "process";

/**
 * Come specificato in Auth0.docs è preferibile usare RSA256 come algoritmo di firma per i token JWT.
 */


export interface IJwt {

    private_key: string;
    public_key: string;

}


export const jwt_tokens = async(): Promise<IJwt> => {

    try {
        const private_Jwt_key = process.env.PRIVATE_JWT_KEY as string;
        const public_Jwt_key = process.env.PUBLIC_JWT_KEY as string;

        return { private_key: private_Jwt_key, public_key: public_Jwt_key };
    } catch (error) {
        throw new AppLogicError(AppErrorsName.JWT_TOKENS_CREATION_FAILED);
    }
};

