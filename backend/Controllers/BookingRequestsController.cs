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

    public BookingRequestsController(
        AppDbContext context,
        ILogger<BookingRequestsController> logger,
        ITelegramNotificationService telegramService)
    {
        _context = context;
        _logger = logger;
        _telegramService = telegramService;
    }

    [HttpPost]
    public async Task<ActionResult<BookingRequestDto>> CreateBookingRequest([FromBody] CreateBookingRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Phone))
        {
            return BadRequest(new { message = "Ism va telefon raqami kiritilishi shart." });
        }

        if (dto.CheckIn >= dto.CheckOut)
        {
            return BadRequest(new { message = "Ketish sanasi (Check-out) kelish sanasidan (Check-in) keyin bo'lishi kerak." });
        }

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

        _logger.LogInformation("Yangi bron so'rovi qabul qilindi: ID={Id}, Mehmon={Name}, Telefon={Phone}", 
            booking.Id, booking.FullName, booking.Phone);

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

        return CreatedAtAction(nameof(GetBookingRequestById), new { id = booking.Id }, resultDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingRequestDto>> GetBookingRequestById(int id)
    {
        var booking = await _context.BookingRequests
            .Include(b => b.Room)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(new { message = "So'rov topilmadi." });
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

        return Ok(result);
    }
}
