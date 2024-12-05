import { Employee } from "./employee";
import { WorkRecord } from "./workRecord";
import { WorkShift } from "./workShift";

export interface Summary{
    employee: Employee;
    date: Date;
    workShiftMinutes: number;
    workRecordMinutes: number;
    workShift: WorkShift;
    workRecords: WorkRecord[];
}