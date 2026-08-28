using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.DTOs;
using ZilvaResort.Api.Models;
using ZilvaResort.Api.Services;

namespace ZilvaResort.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminController(AppDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var totalRooms = await _context.Rooms.CountAsync();
        var totalBookings = await _context.BookingRequests.CountAsync();
        var pendingBookings = await _context.BookingRequests.CountAsync(b => b.Status == "New");
        var confirmedBookings = await _context.BookingRequests.CountAsync(b => b.Status == "Confirmed" || b.Status == "DepositPaid");
        var totalContacts = await _context.ContactRequests.CountAsync();
        var unreadContacts = await _context.ContactRequests.CountAsync(c => !c.IsRead);
        var activeAdmins = await _context.AdminUsers.CountAsync(u => u.IsActive);

        // Calculate estimated revenue from confirmed bookings
        var confirmedList = await _context.BookingRequests
            .Include(b => b.Room)
            .Where(b => b.Status == "Confirmed" || b.Status == "DepositPaid")
            .ToListAsync();

        decimal totalRevenue = 0;
        foreach (var b in confirmedList)
        {
            var nights = (b.CheckOut - b.CheckIn).TotalDays;
            if (nights <= 0) nights = 1;
            var price = b.Room?.PricePerNight ?? 1800000m;
            totalRevenue += price * (decimal)nights;
        }

        var occupancyRate = totalRooms > 0 ? Math.Min(100, Math.Round((double)confirmedBookings / (totalRooms * 3) * 100, 1)) : 0;

        return Ok(new
        {
            totalRooms,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            totalContacts,
            unreadContacts,
            activeAdmins,
            totalRevenue,
            occupancyRate,
            averageDailyRate = confirmedBookings > 0 ? Math.Round(totalRevenue / confirmedBookings) : 2400000m
        });
    }

    [HttpGet("audit-logs")]
    public async Task<ActionResult> GetAuditLogs([FromQuery] int limit = 50)
    {
        var logs = await _context.AuditLogs
            .AsNoTracking()
            .OrderByDescending(a => a.Timestamp)
            .Take(limit)
            .ToListAsync();

        return Ok(logs);
    }

    [HttpGet("booking-requests")]
    public async Task<ActionResult<IEnumerable<BookingRequestDto>>> GetBookingRequests([FromQuery] string? status)
    {
        var query = _context.BookingRequests
            .Include(b => b.Room)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(b => b.Status.ToLower() == status.ToLower());
        }

        var list = await query
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BookingRequestDto(
                b.Id,
                b.FullName,
                b.Phone,
                b.Email,
                b.CheckIn,
                b.CheckOut,
                b.Adults,
                b.Children,
                b.RoomId,
                b.Room != null ? b.Room.Name : null,
                b.SpecialRequests,
                b.Status,
                b.CreatedAt
            ))
            .ToListAsync();

        return Ok(list);
    }

    [HttpPatch("booking-requests/{id}/status")]
    public async Task<ActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var booking = await _context.BookingRequests.FindAsync(id);
        if (booking == null)
        {
            return NotFound(new { message = "So'rov topilmadi." });
        }

        booking.Status = dto.Status;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UPDATE_BOOKING_STATUS", "BookingRequest", id.ToString(), $"Status o'zgartirildi: {booking.Status} (Mehmon: {booking.FullName})");

        return Ok(new { message = "Status muvaffaqiyatli yangilandi.", status = booking.Status });
    }

    [HttpGet("contact-requests")]
    public async Task<ActionResult<IEnumerable<ContactRequestDto>>> GetContactRequests()
    {
        var list = await _context.ContactRequests
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ContactRequestDto(
                c.Id,
                c.FullName,
                c.Phone,
                c.Email,
                c.Subject,
                c.Message,
                c.IsRead,
                c.CreatedAt
            ))
            .ToListAsync();

        return Ok(list);
    }

    [HttpPatch("contact-requests/{id}/read")]
    public async Task<ActionResult> MarkContactAsRead(int id)
    {
        var contact = await _context.ContactRequests.FindAsync(id);
        if (contact == null)
        {
            return NotFound(new { message = "Xabar topilmadi." });
        }

        contact.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xabar o'qildi deb belgilandi." });
    }

    [HttpPatch("rooms/{id}/toggle-availability")]
    public async Task<ActionResult> ToggleRoomAvailability(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
        {
            return NotFound(new { message = "Xona topilmadi." });
        }

        room.IsAvailable = !room.IsAvailable;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("TOGGLE_ROOM_AVAILABILITY", "Room", id.ToString(), $"Xona {room.Name} holati: {(room.IsAvailable ? "Bandlikka ochiq" : "Yopiq")}");

        return Ok(new { message = "Xona holati yangilandi.", isAvailable = room.IsAvailable });
    }

    public record UpdateRoomPriceDto(decimal Price);

    [HttpPatch("rooms/{id}/price")]
    public async Task<ActionResult> UpdateRoomPrice(int id, [FromBody] UpdateRoomPriceDto dto)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
        {
            return NotFound(new { message = "Xona topilmadi." });
        }

        if (dto.Price <= 0)
        {
            return BadRequest(new { message = "Narx musbat son bo'lishi kerak." });
        }

        var oldPrice = room.PricePerNight;
        room.PricePerNight = dto.Price;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UPDATE_ROOM_PRICE", "Room", id.ToString(), $"Xona {room.Name} narxi o'zgartirildi: {oldPrice:N0} so'm -> {room.PricePerNight:N0} so'm");

        return Ok(new { message = "Narx muvaffaqiyatli yangilandi.", price = room.PricePerNight });
    }

    // --- Admin Users Management (RBAC) ---
    public record CreateAdminUserDto(string Username, string FullName, string? Email, string Password, string? PinCode, string? Role);
    public record UpdateAdminUserDto(string? FullName, string? Email, string? Password, string? PinCode, string? Role);

    [HttpGet("users")]
    public async Task<ActionResult> GetAdminUsers()
    {
        var users = await _context.AdminUsers
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.FullName,
                u.Email,
                u.PinCode,
                u.Role,
                u.IsActive,
                u.LastLoginAt,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("users")]
    public async Task<ActionResult> CreateAdminUser([FromBody] CreateAdminUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Login (username) va parol kiritilishi shart." });
        }

        var usernameClean = dto.Username.Trim();
        var exists = await _context.AdminUsers.AnyAsync(u => u.Username.ToLower() == usernameClean.ToLower());
        if (exists)
        {
            return BadRequest(new { message = "Bu login (username) allaqachon mavjud." });
        }

        var newUser = new AdminUser
        {
            Username = usernameClean,
            FullName = string.IsNullOrWhiteSpace(dto.FullName) ? usernameClean : dto.FullName.Trim(),
            Email = dto.Email?.Trim(),
            Password = dto.Password,
            PinCode = string.IsNullOrWhiteSpace(dto.PinCode) ? "7788" : dto.PinCode.Trim(),
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Manager" : dto.Role.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.AdminUsers.Add(newUser);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CREATE_USER", "AdminUser", newUser.Id.ToString(), $"Yangi foydalanuvchi yaratildi: {newUser.Username} (Rol: {newUser.Role})");

        return Ok(new
        {
            message = "Yangi administrator muvaffaqiyatli qo'shildi.",
            user = new
            {
                newUser.Id,
                newUser.Username,
                newUser.FullName,
                newUser.Email,
                newUser.PinCode,
                newUser.Role,
                newUser.IsActive,
                newUser.CreatedAt
            }
        });
    }

    [HttpPut("users/{id}")]
    public async Task<ActionResult> UpdateAdminUser(int id, [FromBody] UpdateAdminUserDto dto)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Foydalanuvchi topilmadi." });
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Password)) user.Password = dto.Password;
        if (!string.IsNullOrWhiteSpace(dto.PinCode)) user.PinCode = dto.PinCode.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Role)) user.Role = dto.Role.Trim();

        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("UPDATE_USER", "AdminUser", id.ToString(), $"Foydalanuvchi {user.Username} ma'lumotlari tahrirlandi (Rol: {user.Role})");

        return Ok(new { message = "Foydalanuvchi muvaffaqiyatli yangilandi.", user });
    }

    [HttpPatch("users/{id}/toggle-status")]
    public async Task<ActionResult> ToggleUserStatus(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Foydalanuvchi topilmadi." });
        }

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("TOGGLE_USER_STATUS", "AdminUser", id.ToString(), $"Foydalanuvchi {user.Username} holati: {(user.IsActive ? "Faollashtirildi" : "Bloklandi")}");

        return Ok(new { message = "Admin holati o'zgartirildi.", isActive = user.IsActive });
    }

    [HttpDelete("users/{id}")]
    public async Task<ActionResult> DeleteAdminUser(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Foydalanuvchi topilmadi." });
        }

        var totalAdmins = await _context.AdminUsers.CountAsync();
        if (totalAdmins <= 1)
        {
            return BadRequest(new { message = "Tizimda kamida bitta admin foydalanuvchi qolishi kerak." });
        }

        var username = user.Username;
        _context.AdminUsers.Remove(user);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DELETE_USER", "AdminUser", id.ToString(), $"Foydalanuvchi {username} tizimdan o'chirildi.");

        return Ok(new { message = "Administrator tizimdan o'chirildi." });
    }
}

