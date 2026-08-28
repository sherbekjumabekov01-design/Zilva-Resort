using ZilvaResort.Api.Data;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Services;

public interface IAuditLogService
{
    Task LogAsync(string action, string entityName, string? entityId = null, string? details = null, string? username = null, string? ipAddress = null);
}

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditLogService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(string action, string entityName, string? entityId = null, string? details = null, string? username = null, string? ipAddress = null)
    {
        try
        {
            var user = username ?? _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            var ip = ipAddress ?? _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "127.0.0.1";

            var log = new AuditLog
            {
                UserName = user,
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = details,
                IpAddress = ip,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
        catch
        {
            // Fail silently to avoid breaking the core transaction if audit logging fails
        }
    }
}
