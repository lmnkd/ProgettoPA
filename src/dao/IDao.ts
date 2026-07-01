
/**
 * Intefaccia iniziale per la gestione dei DAO (Data Access Object) generici.
 * Fornisce i metodi CRUD di base per l'interazione con il database.
 * @template T - Il tipo di entità gestita dal DAO.
 */

export interface IDao<T> {
    create(item: T): Promise<T>;
    read(item: T): Promise<T | null>;
    update(item: Partial<T>, updatedItem: Partial<T>): Promise<T | null>;
    delete(cf: string | number): Promise<boolean>;
    findAll(): Promise<T[]>;
}

