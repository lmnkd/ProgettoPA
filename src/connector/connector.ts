import { Sequelize } from "sequelize";
import process from "process";
import {initModels} from "../model/Init_models";


/**
 * File per la gestione della connessione al database PostgreSQL utilizzando Sequelize.
 * La classe SequelizeConnector è progettata come un singleton per garantire che ci sia una sola connessione al database in tutta l'applicazione.
 * Il costruttore privato inizializza la connessione al database utilizzando le variabili d'ambiente per configurare il database, l'utente, la password, l'host e la porta.
 * Il metodo getInstance() restituisce l'istanza singleton della classe, creando una nuova istanza se non esiste già.
 * Il metodo getSequelize() restituisce l'oggetto Sequelize per interagire con il database.
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
        host: process.env.POSTGRES_HOST || "postgres",
        port: Number(process.env.POSTGRES_PORT) || 5432,
        dialect: "postgres",
        define: {
          underscored: true,
        },
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