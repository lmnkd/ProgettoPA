
/**
 * Intefaccia iniziale, probabilmenrte completa, in caso modificare
 */

export interface IDao<T> {
    create(item: T): Promise<T>;
    read(item: T): Promise<T | null>;
    update(item: Partial<T>, updatedItem: Partial<T>): Promise<T | null>;
    delete(cf: string | number): Promise<boolean>;
    findAll(): Promise<T[]>;
}

