type ITutorSort = {
    availability: 'asc' | 'ASC' | 'desc' | 'DESC';

    experience: 'asc' | 'ASC' | 'desc' | 'DESC';
};

enum TutorFilterStatus {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

type ITutorQuery = {
    status: TutorFilterStatus;

    category: number;

    expertise: string;

    startTime: Date;

    sort: Partial<ITutorSort>;

    page: number;
};

export { ITutorSort, ITutorQuery, TutorFilterStatus };
