type ITutorSort = {
    happyUsers: 'asc' | 'desc';

    reviews: 'asc' | 'desc';
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

    lastDocumentId: string;
};

type ITutorReviewerQuery = {
    lastDocumentId: string;
};

export { ITutorSort, ITutorQuery, TutorFilterStatus, ITutorReviewerQuery };
