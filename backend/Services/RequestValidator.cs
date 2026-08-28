using System.Text.RegularExpressions;
using ZilvaResort.Api.DTOs;

namespace ZilvaResort.Api.Services;

public static class RequestValidator
{
    private static readonly Regex PhoneRegex = new(@"^\+?[0-9]{9,15}$", RegexOptions.Compiled);
    private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public static List<string> ValidateBooking(CreateBookingRequestDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            errors.Add("Mehmonning to'liq ismi (F.I.SH) kiritilishi shart.");
        }
        else if (dto.FullName.Trim().Length > 100)
        {
            errors.Add("Ism 100 belgidan oshmasligi kerak.");
        }

        if (string.IsNullOrWhiteSpace(dto.Phone))
        {
            errors.Add("Telefon raqami kiritilishi shart.");
        }
        else
        {
            var cleanedPhone = Regex.Replace(dto.Phone, @"[\s\-\(\)]", "");
            if (!PhoneRegex.IsMatch(cleanedPhone))
            {
                errors.Add("Telefon raqami noto'g'ri formatda. Masalan: +998901234567");
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.Email) && !EmailRegex.IsMatch(dto.Email.Trim()))
        {
            errors.Add("Elektron pochta (email) formati noto'g'ri.");
        }

        if (dto.CheckIn.Date < DateTime.UtcNow.Date.AddDays(-1))
        {
            errors.Add("Kirish sanasi (Check-In) o'tib ketgan sana bo'lishi mumkin emas.");
        }

        if (dto.CheckOut.Date <= dto.CheckIn.Date)
        {
            errors.Add("Chiqish sanasi (Check-Out) kirish sanasidan keyin bo'lishi shart.");
        }

        var nights = (dto.CheckOut.Date - dto.CheckIn.Date).TotalDays;
        if (nights > 30)
        {
            errors.Add("Bir martalik maksimal bron muddati 30 kundan oshmasligi kerak.");
        }

        if (dto.Adults < 1)
        {
            errors.Add("Kattalar soni kamida 1 nafar bo'lishi kerak.");
        }

        if (dto.Children < 0)
        {
            errors.Add("Bolalar soni manfiy bo'lishi mumkin emas.");
        }

        if (dto.SpecialRequests != null && dto.SpecialRequests.Length > 500)
        {
            errors.Add("Qo'shimcha istaklar 500 belgidan oshmasligi kerak.");
        }

        return errors;
    }

    public static List<string> ValidateContact(CreateContactRequestDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            errors.Add("Ismingizni kiritishingiz shart.");
        }
        else if (dto.FullName.Trim().Length > 100)
        {
            errors.Add("Ism 100 belgidan oshmasligi kerak.");
        }

        if (string.IsNullOrWhiteSpace(dto.Phone))
        {
            errors.Add("Telefon raqamingizni kiritishingiz shart.");
        }
        else
        {
            var cleanedPhone = Regex.Replace(dto.Phone, @"[\s\-\(\)]", "");
            if (!PhoneRegex.IsMatch(cleanedPhone))
            {
                errors.Add("Telefon raqami noto'g'ri formatda. Masalan: +998901234567");
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.Email) && !EmailRegex.IsMatch(dto.Email.Trim()))
        {
            errors.Add("Elektron pochta (email) formati noto'g'ri.");
        }

        if (string.IsNullOrWhiteSpace(dto.Message))
        {
            errors.Add("Xabar matni kiritilishi shart.");
        }
        else if (dto.Message.Trim().Length > 1000)
        {
            errors.Add("Xabar matni 1000 belgidan oshmasligi kerak.");
        }

        return errors;
    }
}
