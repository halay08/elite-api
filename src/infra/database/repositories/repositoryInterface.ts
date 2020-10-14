export default interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(entity: T): Promise<string>;
    update(id: string, entity: T): Promise<string>;
    delete(id: string): Promise<string>;
}
