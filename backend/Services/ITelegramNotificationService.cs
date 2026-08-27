using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Services;

public interface ITelegramNotificationService
{
    Task SendBookingNotificationAsync(BookingRequest booking, string? roomName = null);
    Task SendContactNotificationAsync(ContactRequest contact);
}
