namespace API.Entities;

public class Notification
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public bool IsRead { get; set; }

    //Notifiction - AppUser
    public int SenderId { get; set; }
    public AppUser Sender { get; set; } = null!;
    public int RecipientId { get; set; }
    public AppUser Recipient { get; set; } = null!;
}
