using System.Text;
using System.Text.Json;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Services;

public class TelegramNotificationService : ITelegramNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<TelegramNotificationService> _logger;
    private readonly HttpClient _httpClient;

    public TelegramNotificationService(
        IConfiguration configuration,
        ILogger<TelegramNotificationService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task SendBookingNotificationAsync(BookingRequest booking, string? roomName = null)
    {
        var botToken = _configuration["TelegramSettings:BotToken"];
        var chatId = _configuration["TelegramSettings:ChatId"];
        var enabled = _configuration.GetValue<bool>("TelegramSettings:Enabled");

        if (!enabled || string.IsNullOrWhiteSpace(botToken) || string.IsNullOrWhiteSpace(chatId))
        {
            _logger.LogInformation(
                "[Telegram Notification Skipped - BotToken or ChatId not configured] Yangi bron: ID={Id}, Mehmon={Name}, Tel={Phone}, Xona={Room}",
                booking.Id, booking.FullName, booking.Phone, roomName ?? "Tanlanmagan");
            return;
        }

        try
        {
            var nights = Math.Max(1, (int)(booking.CheckOut.Date - booking.CheckIn.Date).TotalDays);
            var sb = new StringBuilder();
            sb.AppendLine("🏔️ *YANGI BRON SO'ROVI — ZILVA RESORT*");
            sb.AppendLine("━━━━━━━━━━━━━━━━━━━━");
            sb.AppendLine($"🆔 *So'rov ID:* `#{booking.Id}`");
            sb.AppendLine($"👤 *Mehmon:* *{EscapeMarkdown(booking.FullName)}*");
            sb.AppendLine($"📞 *Telefon:* `{booking.Phone}`");
            if (!string.IsNullOrWhiteSpace(booking.Email))
            {
                sb.AppendLine($"📧 *Email:* `{EscapeMarkdown(booking.Email)}`");
            }
            sb.AppendLine($"🏡 *Xona / Kottej:* *{EscapeMarkdown(roomName ?? "Belgilanmagan")}*");
            sb.AppendLine($"📅 *Sanalar:* {booking.CheckIn:dd.MM.yyyy} — {booking.CheckOut:dd.MM.yyyy} ({nights} kecha)");
            sb.AppendLine($"👥 *Mehmonlar soni:* {booking.Adults} kattalar" + (booking.Children > 0 ? $", {booking.Children} bolalar" : ""));
            
            if (!string.IsNullOrWhiteSpace(booking.SpecialRequests))
            {
                sb.AppendLine($"💬 *Maxsus istaklar:* _{EscapeMarkdown(booking.SpecialRequests)}_");
            }
            sb.AppendLine("━━━━━━━━━━━━━━━━━━━━");
            sb.AppendLine("⚡️ _Iltimos, mehmon bilan 15 daqiqa ichida bog'laning!_");

            await SendTelegramMessageAsync(botToken, chatId, sb.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Telegram xabarnomasini yuborishda xatolik yuz berdi.");
        }
    }

    public async Task SendContactNotificationAsync(ContactRequest contact)
    {
        var botToken = _configuration["TelegramSettings:BotToken"];
        var chatId = _configuration["TelegramSettings:ChatId"];
        var enabled = _configuration.GetValue<bool>("TelegramSettings:Enabled");

        if (!enabled || string.IsNullOrWhiteSpace(botToken) || string.IsNullOrWhiteSpace(chatId))
        {
            _logger.LogInformation(
                "[Telegram Notification Skipped - BotToken or ChatId not configured] Yangi xabar: ID={Id}, Mehmon={Name}, Mavzu={Subject}",
                contact.Id, contact.FullName, contact.Subject);
            return;
        }

        try
        {
            var sb = new StringBuilder();
            sb.AppendLine("📩 *YANGI MUROJAAT / XABAR — ZILVA RESORT*");
            sb.AppendLine("━━━━━━━━━━━━━━━━━━━━");
            sb.AppendLine($"👤 *Murojaatchi:* *{EscapeMarkdown(contact.FullName)}*");
            sb.AppendLine($"📞 *Telefon:* `{contact.Phone}`");
            if (!string.IsNullOrWhiteSpace(contact.Email))
            {
                sb.AppendLine($"📧 *Email:* `{EscapeMarkdown(contact.Email)}`");
            }
            if (!string.IsNullOrWhiteSpace(contact.Subject))
            {
                sb.AppendLine($"📌 *Mavzu:* *{EscapeMarkdown(contact.Subject)}*");
            }
            sb.AppendLine($"💬 *Xabar matni:*");
            sb.AppendLine($"_{EscapeMarkdown(contact.Message)}_");
            sb.AppendLine("━━━━━━━━━━━━━━━━━━━━");

            await SendTelegramMessageAsync(botToken, chatId, sb.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Telegram xabarini yuborishda xatolik yuz berdi.");
        }
    }

    private async Task SendTelegramMessageAsync(string botToken, string chatId, string text)
    {
        var url = $"https://api.telegram.org/bot{botToken}/sendMessage";
        var payload = new
        {
            chat_id = chatId,
            text = text,
            parse_mode = "Markdown"
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            _logger.LogWarning("Telegram API xatosi: {StatusCode} - {Error}", response.StatusCode, error);
        }
    }

    private static string EscapeMarkdown(string text)
    {
        return text
            .Replace("_", "\\_")
            .Replace("*", "\\*")
            .Replace("[", "\\[")
            .Replace("]", "\\]")
            .Replace("`", "\\`");
    }
}
