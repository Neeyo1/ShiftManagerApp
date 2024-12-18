using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, IDepartmentRepository departmentRepository,
    IEmployeeRepository employeeRepository, INotificationRepository notificationRepository,
    ISummaryRepository summaryRepository, IUserRepository userRepository,
    IWorkRecordRepository workRecordRepository, IWorkShiftRepository workShiftRepository) : IUnitOfWork
{
    public IDepartmentRepository DepartmentRepository => departmentRepository;

    public IEmployeeRepository EmployeeRepository => employeeRepository;

    public INotificationRepository NotificationRepository => notificationRepository;

    public ISummaryRepository SummaryRepository => summaryRepository;

    public IUserRepository UserRepository => userRepository;

    public IWorkRecordRepository WorkRecordRepository => workRecordRepository;

    public IWorkShiftRepository WorkShiftRepository => workShiftRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
