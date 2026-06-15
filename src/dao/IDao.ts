
/**
 * Intefaccia iniziale, probabilmenrte completa, in caso modificare
 */

export interface IDao<T> {
    create(item: T): Promise<T>;
    read(item: T | string | T): Promise<T | null>;
    update(item: T, updatedItem: T): Promise<T | null>;
    delete(item: T): Promise<boolean>;
    findAll(): Promise<T[]>;
}

