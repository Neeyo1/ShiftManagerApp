import { Employee } from "./employee";
import { WorkShift } from "./workShift";

export interface Summary{
    employee: Employee;
    totalWorkShiftMinutes: number;
    totalWorkRecordMinutes: number;
    summaryWorkDetails: SummaryWorkDetail[];
}

export interface SummaryWorkDetail{
    date: Date;
    workShiftMinutes: number;
    workRecordMinutes: number;
    workShift?: WorkShift
}
