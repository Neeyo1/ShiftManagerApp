import { Manager } from "./manager";

export interface Department{
    id: number;
    name: string;
    employeeCount: number;
    managers: Manager[];
}
