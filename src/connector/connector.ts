import { Sequelize } from "sequelize";
import process from "process";
import {initModels} from "../model/Init_models";


/**
 * Questa classe è un singleton che gestisce la connessione al database PostgreSQL utilizzando Sequelize.
 * 
 */

export class SequelizeConnector {

  private static instance: SequelizeConnector;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(
      process.env.POSTGRES_DB || "postgres",
      process.env.POSTGRES_USER || "postgres",
      process.env.POSTGRES_PASSWORD || "password",
      {
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT) || 5432,
        dialect: "postgres",
      }
    );
    initModels(this.sequelize);
  }

    public static getInstance(): SequelizeConnector {   
    if (!SequelizeConnector.instance) {
      SequelizeConnector.instance = new SequelizeConnector();
    }

    return SequelizeConnector.instance;
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
 }

}


/*Esportiamo l'istanza del connettore per poterla utilizzare in altre parti dell'applicazione. 
*Garantisce che ci sia una sola connessione al database in tutta l'applicazione.
*/
export const sequelize = SequelizeConnector.getInstance();