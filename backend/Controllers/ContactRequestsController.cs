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
    private readonly IAuditLogService _auditLog;

    public ContactRequestsController(
        AppDbContext context,
        ILogger<ContactRequestsController> logger,
        ITelegramNotificationService telegramService,
        IAuditLogService auditLog)
    {
        _context = context;
        _logger = logger;
        _telegramService = telegramService;
        _auditLog = auditLog;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContactRequestDto>>> CreateContactRequest([FromBody] CreateContactRequestDto dto)
    {
        // 1. Strict Server-Side Validation
        var validationErrors = RequestValidator.ValidateContact(dto);
        if (validationErrors.Count > 0)
        {
            return UnprocessableEntity(ApiResponse<ContactRequestDto>.Fail(
                "Xabar ma'lumotlarida xatoliklar mavjud.",
                validationErrors
            ));
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

        await _auditLog.LogAsync("CREATE_CONTACT_MESSAGE", "ContactRequest", contact.Id.ToString(), $"Murojaat yuborildi: {contact.FullName} ({contact.Subject})");

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

        return StatusCode(StatusCodes.Status201Created, ApiResponse<ContactRequestDto>.Ok(
            resultDto,
            "Xabaringiz qabul qilindi! Tez orada mutaxassisimiz siz bilan bog'lanadi."
        ));
    }
}
