namespace API.Helpers;

public class NotificationParams : PaginationParams
{
    public int UserId { get; set; }
    public string Status { get; set; } = "all";
    public string OrderBy { get; set; } = "received-desc";
}
