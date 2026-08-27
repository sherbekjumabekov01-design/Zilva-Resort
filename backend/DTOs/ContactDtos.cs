namespace ZilvaResort.Api.DTOs;

public record ContactRequestDto(
    int Id,
    string FullName,
    string Phone,
    string? Email,
    string Subject,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);

public class CreateContactRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Subject { get; set; } = "Umumiy so'rov";
    public string Message { get; set; } = string.Empty;
}
