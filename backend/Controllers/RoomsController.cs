using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Data;
using ZilvaResort.Api.DTOs;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms(
        [FromQuery] string? category,
        [FromQuery] int? guests,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? featured)
    {
        var query = _context.Rooms
            .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity)
            .AsNoTracking()
            .Where(r => r.IsAvailable);

        if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
        {
            query = query.Where(r => r.Category.ToLower() == category.ToLower());
        }

        if (guests.HasValue)
        {
            query = query.Where(r => r.MaxGuests >= guests.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(r => r.PricePerNight >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(r => r.PricePerNight <= maxPrice.Value);
        }

        if (featured.HasValue && featured.Value)
        {
            query = query.Where(r => r.IsFeatured);
        }

        var rooms = await query
            .OrderBy(r => r.Id)
            .Select(r => new RoomDto(
                r.Id,
                r.Slug,
                r.Name,
                r.Category,
                r.ShortDescription,
                r.PricePerNight,
                r.Area,
                r.MaxGuests,
                r.Bedrooms,
                r.Bathrooms,
                r.BedType,
                r.ViewType,
                r.CoverImage,
                r.IsFeatured,
                r.IsAvailable,
                r.BreakfastIncluded,
                r.RoomAmenities.Select(ra => new AmenityDto(
                    ra.Amenity.Id,
                    ra.Amenity.Name,
                    ra.Amenity.Icon,
                    ra.Amenity.Category
                )).ToList()
            ))
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<RoomDetailDto>> GetRoomBySlug(string slug)
    {
        var room = await _context.Rooms
            .Include(r => r.Images)
            .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Slug == slug);

        if (room == null)
        {
            return NotFound(new { message = $"Xona topilmadi: {slug}" });
        }

        var detail = new RoomDetailDto(
            room.Id,
            room.Slug,
            room.Name,
            room.Category,
            room.ShortDescription,
            room.Description,
            room.PricePerNight,
            room.Area,
            room.MaxGuests,
            room.Bedrooms,
            room.Bathrooms,
            room.BedType,
            room.ViewType,
            room.CoverImage,
            room.IsFeatured,
            room.IsAvailable,
            room.BreakfastIncluded,
            room.CheckInTime,
            room.CheckOutTime,
            room.Rules,
            room.Images.OrderBy(i => i.SortOrder).Select(i => new RoomImageDto(
                i.Id,
                i.ImageUrl,
                i.Caption,
                i.SortOrder
            )).ToList(),
            room.RoomAmenities.Select(ra => new AmenityDto(
                ra.Amenity.Id,
                ra.Amenity.Name,
                ra.Amenity.Icon,
                ra.Amenity.Category
            )).ToList()
        );

        return Ok(detail);
    }
}
