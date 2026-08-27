namespace ZilvaResort.Api.Models;

public class BookingRequest
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Adults { get; set; } = 2;
    public int Children { get; set; } = 0;
    public int? RoomId { get; set; }
    public Room? Room { get; set; }
    public string? SpecialRequests { get; set; }
    public string Status { get; set; } = "New"; // New, Contacted, Confirmed, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
