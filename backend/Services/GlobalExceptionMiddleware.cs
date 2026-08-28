using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace ZilvaResort.Api.Services;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Kutilmagan xatolik yuz berdi: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var message = _env.IsDevelopment()
            ? exception.Message
            : "Serverda kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.";

        var response = new
        {
            success = false,
            message,
            statusCode = context.Response.StatusCode,
            path = context.Request.Path.Value,
            timestamp = DateTime.UtcNow
        };

        var json = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(json);
    }
}
