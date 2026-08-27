namespace ZilvaResort.Api.DTOs;

public record BookingRequestDto(
    int Id,
    string FullName,
    string Phone,
    string? Email,
    DateTime CheckIn,
    DateTime CheckOut,
    int Adults,
    int Children,
    int? RoomId,
    string? RoomName,
    string? SpecialRequests,
    string Status,
    DateTime CreatedAt
);

public class CreateBookingRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Adults { get; set; } = 2;
    public int Children { get; set; } = 0;
    public int? RoomId { get; set; }
    public string? SpecialRequests { get; set; }
}

public class UpdateBookingStatusDto
{
    public string Status { get; set; } = "Contacted"; // New, Contacted, Confirmed, Cancelled
}
