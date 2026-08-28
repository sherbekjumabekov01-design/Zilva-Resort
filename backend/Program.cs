using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITelegramNotificationService, TelegramNotificationService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();

// Configure Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("PublicApiLimit", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
    options.AddSlidingWindowLimiter("AuthLimit", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 3;
        opt.QueueLimit = 2;
    });
});

// Database configuration: PostgreSQL or SQLite
var usePostgres = builder.Configuration.GetValue<bool>("UsePostgres");
var postgresConn = builder.Configuration.GetConnectionString("PostgreSqlConnection");
var sqliteConn = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=zilva_resort.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (usePostgres && !string.IsNullOrEmpty(postgresConn))
    {
        options.UseNpgsql(postgresConn);
    }
    else
    {
        options.UseSqlite(sqliteConn);
    }
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Global Exception Handling Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ma'lumotlar bazasini initsializatsiya qilishda xatolik yuz berdi.");
    }
}

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
app.UseRateLimiter();
app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/healthz");
app.MapHealthChecks("/api/health");

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    name = "Zilva Resort Web API",
    status = "Active",
    version = "1.0",
    health = "/healthz",
    endpoints = new[]
    {
        "/api/rooms",
        "/api/bookingrequests",
        "/api/contactrequests",
        "/api/admin/booking-requests",
        "/api/admin/contact-requests",
        "/openapi/v1.json"
    }
}));

app.Run();

