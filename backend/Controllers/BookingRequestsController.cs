using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.DTOs;
using ZilvaResort.Api.Models;
using ZilvaResort.Api.Services;

namespace ZilvaResort.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<BookingRequestsController> _logger;
    private readonly ITelegramNotificationService _telegramService;
    private readonly IAuditLogService _auditLog;

    public BookingRequestsController(
        AppDbContext context,
        ILogger<BookingRequestsController> logger,
        ITelegramNotificationService telegramService,
        IAuditLogService auditLog)
    {
        _context = context;
        _logger = logger;
        _telegramService = telegramService;
        _auditLog = auditLog;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<BookingRequestDto>>> CreateBookingRequest([FromBody] CreateBookingRequestDto dto)
    {
        // 1. Strict Server-Side Validation
        var validationErrors = RequestValidator.ValidateBooking(dto);
        if (validationErrors.Count > 0)
        {
            return UnprocessableEntity(ApiResponse<BookingRequestDto>.Fail(
                "Bron so'rovi ma'lumotlarida xatoliklar mavjud.",
                validationErrors
            ));
        }

        // 2. Database Transaction for ACID Integrity
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var booking = new BookingRequest
            {
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email?.Trim(),
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Adults = dto.Adults > 0 ? dto.Adults : 1,
                Children = dto.Children >= 0 ? dto.Children : 0,
                RoomId = dto.RoomId,
                SpecialRequests = dto.SpecialRequests?.Trim(),
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            _context.BookingRequests.Add(booking);
            await _context.SaveChangesAsync();

            // Load Room name if specified
            string? roomName = null;
            if (booking.RoomId.HasValue)
            {
                var room = await _context.Rooms.FindAsync(booking.RoomId.Value);
                roomName = room?.Name;
            }

            // Commit Transaction
            await transaction.CommitAsync();

            _logger.LogInformation("Yangi bron so'rovi qabul qilindi: ID={Id}, Mehmon={Name}, Telefon={Phone}", 
                booking.Id, booking.FullName, booking.Phone);

            // Audit log record
            await _auditLog.LogAsync("CREATE_BOOKING", "BookingRequest", booking.Id.ToString(), $"Yangi bron: {booking.FullName}, {booking.CheckIn:yyyy-MM-dd} dan {booking.CheckOut:yyyy-MM-dd} gacha ({roomName ?? "Xona ko'rsatilmagan"})");

            // Send real-time Telegram notification in background
            _ = _telegramService.SendBookingNotificationAsync(booking, roomName);

            var resultDto = new BookingRequestDto(
                booking.Id,
                booking.FullName,
                booking.Phone,
                booking.Email,
                booking.CheckIn,
                booking.CheckOut,
                booking.Adults,
                booking.Children,
                booking.RoomId,
                roomName,
                booking.SpecialRequests,
                booking.Status,
                booking.CreatedAt
            );

            return StatusCode(StatusCodes.Status201Created, ApiResponse<BookingRequestDto>.Ok(
                resultDto,
                "Bron so'rovingiz muvaffaqiyatli qabul qilindi! Menejerimiz tez orada siz bilan bog'lanadi."
            ));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Bron so'rovini saqlashda tranzaksiya bekor qilindi (Rollback).");
            throw;
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<BookingRequestDto>>> GetBookingRequestById(int id)
    {
        var booking = await _context.BookingRequests
            .AsNoTracking()
            .Include(b => b.Room)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(ApiResponse<BookingRequestDto>.Fail("Bron so'rovi topilmadi."));
        }

        var result = new BookingRequestDto(
            booking.Id,
            booking.FullName,
            booking.Phone,
            booking.Email,
            booking.CheckIn,
            booking.CheckOut,
            booking.Adults,
            booking.Children,
            booking.RoomId,
            booking.Room?.Name,
            booking.SpecialRequests,
            booking.Status,
            booking.CreatedAt
        );

        return Ok(ApiResponse<BookingRequestDto>.Ok(result));
    }
}
