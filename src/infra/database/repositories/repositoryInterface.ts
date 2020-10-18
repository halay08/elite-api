export default interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(entity: Partial<T>): Promise<string>;
    update(id: string, entity: Partial<T>): Promise<string>;
    delete(id: string): Promise<string>;
}
