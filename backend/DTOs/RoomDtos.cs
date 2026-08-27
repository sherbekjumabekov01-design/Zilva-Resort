namespace ZilvaResort.Api.DTOs;

public record AmenityDto(
    int Id,
    string Name,
    string Icon,
    string Category
);

public record RoomImageDto(
    int Id,
    string ImageUrl,
    string? Caption,
    int SortOrder
);

public record RoomDto(
    int Id,
    string Slug,
    string Name,
    string Category,
    string ShortDescription,
    decimal PricePerNight,
    int Area,
    int MaxGuests,
    int Bedrooms,
    int Bathrooms,
    string BedType,
    string ViewType,
    string CoverImage,
    bool IsFeatured,
    bool IsAvailable,
    bool BreakfastIncluded,
    List<AmenityDto> Amenities
);

public record RoomDetailDto(
    int Id,
    string Slug,
    string Name,
    string Category,
    string ShortDescription,
    string Description,
    decimal PricePerNight,
    int Area,
    int MaxGuests,
    int Bedrooms,
    int Bathrooms,
    string BedType,
    string ViewType,
    string CoverImage,
    bool IsFeatured,
    bool IsAvailable,
    bool BreakfastIncluded,
    string CheckInTime,
    string CheckOutTime,
    List<string> Rules,
    List<RoomImageDto> Images,
    List<AmenityDto> Amenities
);

public class CreateRoomDto
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "Standard";
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Area { get; set; }
    public int MaxGuests { get; set; }
    public int Bedrooms { get; set; } = 1;
    public int Bathrooms { get; set; } = 1;
    public string BedType { get; set; } = "King Bed";
    public string ViewType { get; set; } = "Tog' manzarasi";
    public string CoverImage { get; set; } = string.Empty;
    public bool IsFeatured { get; set; } = false;
    public bool IsAvailable { get; set; } = true;
    public bool BreakfastIncluded { get; set; } = true;
    public string CheckInTime { get; set; } = "14:00";
    public string CheckOutTime { get; set; } = "12:00";
    public List<string> Rules { get; set; } = new();
    public List<int> AmenityIds { get; set; } = new();
    public List<string> ImageUrls { get; set; } = new();
}
