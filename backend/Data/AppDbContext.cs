using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<RoomImage> RoomImages => Set<RoomImage>();
    public DbSet<Amenity> Amenities => Set<Amenity>();
    public DbSet<RoomAmenity> RoomAmenities => Set<RoomAmenity>();
    public DbSet<BookingRequest> BookingRequests => Set<BookingRequest>();
    public DbSet<ContactRequest> ContactRequests => Set<ContactRequest>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // RoomAmenity Many-to-Many
        modelBuilder.Entity<RoomAmenity>()
            .HasKey(ra => new { ra.RoomId, ra.AmenityId });

        modelBuilder.Entity<RoomAmenity>()
            .HasOne(ra => ra.Room)
            .WithMany(r => r.RoomAmenities)
            .HasForeignKey(ra => ra.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RoomAmenity>()
            .HasOne(ra => ra.Amenity)
            .WithMany(a => a.RoomAmenities)
            .HasForeignKey(ra => ra.AmenityId)
            .OnDelete(DeleteBehavior.Cascade);

        // RoomImage One-to-Many
        modelBuilder.Entity<RoomImage>()
            .HasOne(ri => ri.Room)
            .WithMany(r => r.Images)
            .HasForeignKey(ri => ri.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        // BookingRequest
        modelBuilder.Entity<BookingRequest>()
            .HasOne(b => b.Room)
            .WithMany()
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes for performance & slug lookup
        modelBuilder.Entity<Room>()
            .HasIndex(r => r.Slug)
            .IsUnique();

        modelBuilder.Entity<Room>()
            .Property(r => r.PricePerNight)
            .HasPrecision(18, 2);
    }
}
