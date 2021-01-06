type ITeachingDataSummary = {
    completed?: number;
    missed?: number;
    upcoming?: number;
    totalHour?: number;
};

type ILearningDataSummary = ITeachingDataSummary;

export { ITeachingDataSummary, ILearningDataSummary };
