namespace API.Interfaces;

public interface IUnitOfWork
{
    IDepartmentRepository DepartmentRepository { get; }
    IEmployeeRepository EmployeeRepository { get; }
    INotificationRepository NotificationRepository { get; }
    ISummaryRepository SummaryRepository { get; }
    IUserRepository UserRepository { get; }
    IWorkRecordRepository WorkRecordRepository { get; }
    IWorkShiftRepository WorkShiftRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
