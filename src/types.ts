const TYPES = {
    Server: Symbol.for('Server'),
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),
    FireAuth: Symbol.for('FireAuth'),

    Call: Symbol.for('Call'),

    UserRepository: Symbol.for('UserRepository'),
    TutorRepository: Symbol.for('TutorRepository'),
    CategoryRepository: Symbol.for('CategoryRepository'),

    UserService: Symbol.for('UserService'),
    AuthService: Symbol.for('AuthService'),
    TutorService: Symbol.for('TutorService'),

    RoomService: Symbol.for('RoomService'),
    RoomRepository: Symbol.for('RoomRepository'),

    UserSeeding: Symbol.for('UserSeeding'),
    TutorSeeding: Symbol.for('TutorSeeding'),
    CategorySeeding: Symbol.for('CategorySeeding')

    //Repository: Symbol.for('//Repository'),
    //Service: Symbol.for('//Service'),
};

export default TYPES;
