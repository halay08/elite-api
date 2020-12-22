type ISessionQueryParam = {
    from?: Date;
    to?: Date;
};
type ITutorSessionStackSummary = {
    completed?: number;
    missed?: number;
    totalHour?: number;
};

export { ITutorSessionStackSummary, ISessionQueryParam };
