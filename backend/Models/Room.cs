namespace ZilvaResort.Api.Models;

public class Room
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "Standard";
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Area { get; set; } // m²
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

    public ICollection<RoomImage> Images { get; set; } = new List<RoomImage>();
    public ICollection<RoomAmenity> RoomAmenities { get; set; } = new List<RoomAmenity>();
}
