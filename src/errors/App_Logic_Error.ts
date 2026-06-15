import {AppErrorsName} from "../enum/AppErrorsName";


export class AppLogicError extends Error {
    constructor(name:AppErrorsName)
        {
        super();
        this.name = name;
    }
}