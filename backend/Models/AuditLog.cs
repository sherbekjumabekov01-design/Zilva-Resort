namespace ZilvaResort.Api.Models;

public class AuditLog
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string UserName { get; set; } = "System";
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
