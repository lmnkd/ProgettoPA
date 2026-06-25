import {AppErrorsName} from "../enum/AppErrorsName";


// Classe creata per far apparire gli errori  creati da noi

export class AppLogicError extends Error {
    constructor(name:AppErrorsName)
        {
        super();
        this.name = name;
    }
}