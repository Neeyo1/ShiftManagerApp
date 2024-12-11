export interface Notification{
    id: number;
    title: string;
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
}

export interface NotificationDetailed{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    readAt: Date;
    isChanged: boolean;
}