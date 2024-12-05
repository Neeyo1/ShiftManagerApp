export interface WorkRecord{
    id: number;
    start: Date;
    end?: Date;
    minutesInWork: number;
    employeeId: number;
}