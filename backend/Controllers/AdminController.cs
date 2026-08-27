using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.DTOs;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var totalRooms = await _context.Rooms.CountAsync();
        var totalBookings = await _context.BookingRequests.CountAsync();
        var pendingBookings = await _context.BookingRequests.CountAsync(b => b.Status == "New");
        var totalContacts = await _context.ContactRequests.CountAsync();
        var unreadContacts = await _context.ContactRequests.CountAsync(c => !c.IsRead);

        return Ok(new
        {
            totalRooms,
            totalBookings,
            pendingBookings,
            totalContacts,
            unreadContacts
        });
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

        room.PricePerNight = dto.Price;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Narx muvaffaqiyatli yangilandi.", price = room.PricePerNight });
    }

    // --- Admin Users Management ---
    public record CreateAdminUserDto(string Username, string FullName, string Password, string? PinCode, string? Role);

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
                u.PinCode,
                u.Role,
                u.IsActive,
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
            Password = dto.Password,
            PinCode = string.IsNullOrWhiteSpace(dto.PinCode) ? "7788" : dto.PinCode.Trim(),
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Menejer" : dto.Role.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.AdminUsers.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Yangi administrator muvaffaqiyatli qo'shildi.",
            user = new
            {
                newUser.Id,
                newUser.Username,
                newUser.FullName,
                newUser.PinCode,
                newUser.Role,
                newUser.IsActive,
                newUser.CreatedAt
            }
        });
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

        _context.AdminUsers.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Administrator tizimdan o'chirildi." });
    }
}

