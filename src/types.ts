const TYPES = {
    Server: Symbol.for('Server'),
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),

    UserRepository: Symbol.for('UserRepository'),
    UserService: Symbol.for('UserService')
};

export default TYPES;
