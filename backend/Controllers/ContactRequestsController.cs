using Microsoft.AspNetCore.Mvc;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.DTOs;
using ZilvaResort.Api.Models;
using ZilvaResort.Api.Services;

namespace ZilvaResort.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ContactRequestsController> _logger;
    private readonly ITelegramNotificationService _telegramService;

    public ContactRequestsController(
        AppDbContext context,
        ILogger<ContactRequestsController> logger,
        ITelegramNotificationService telegramService)
    {
        _context = context;
        _logger = logger;
        _telegramService = telegramService;
    }

    [HttpPost]
    public async Task<ActionResult<ContactRequestDto>> CreateContactRequest([FromBody] CreateContactRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Phone) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return BadRequest(new { message = "Ism, telefon raqami va xabar matnini to'ldirish majburiy." });
        }

        var contact = new ContactRequest
        {
            FullName = dto.FullName.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email?.Trim(),
            Subject = string.IsNullOrWhiteSpace(dto.Subject) ? "Umumiy so'rov" : dto.Subject.Trim(),
            Message = dto.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactRequests.Add(contact);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Yangi aloqa xabari qabul qilindi: ID={Id}, Mehmon={Name}, Mavzu={Subject}", 
            contact.Id, contact.FullName, contact.Subject);

        // Send real-time Telegram alert in background
        _ = _telegramService.SendContactNotificationAsync(contact);

        var resultDto = new ContactRequestDto(
            contact.Id,
            contact.FullName,
            contact.Phone,
            contact.Email,
            contact.Subject,
            contact.Message,
            contact.IsRead,
            contact.CreatedAt
        );

        return Ok(resultDto);
    }
}
