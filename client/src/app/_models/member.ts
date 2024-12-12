export interface Member{
    id: number;
    firstName: string;
    lastName: string;
    createdAt: Date;
    lastActive: Date;
    role: string;
    departmentId?: number;
}