type ISessionQueryParam = {
    from?: Date;
    to?: Date;
};
type ITutorLearningStackSummary = {
    completed?: number;
    missed?: number;
    totalHour?: number;
};

export { ITutorLearningStackSummary, ISessionQueryParam };
