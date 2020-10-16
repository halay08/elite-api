const TYPES = {
    Server: Symbol.for('Server'),
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),
    FireAuth: Symbol.for('FireAuth'),

    UserRepository: Symbol.for('UserRepository'),
    UserService: Symbol.for('UserService'),
    AuthService: Symbol.for('AuthService'),
};

export default TYPES;
