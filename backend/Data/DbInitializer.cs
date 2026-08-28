using Microsoft.EntityFrameworkCore;
using ZilvaResort.Api.Models;

namespace ZilvaResort.Api.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        // Ensure AdminUsers & AuditLogs tables exist in existing database
        try
        {
            context.Database.ExecuteSqlRaw(@"CREATE TABLE IF NOT EXISTS ""AdminUsers"" (""Id"" INTEGER NOT NULL CONSTRAINT ""PK_AdminUsers"" PRIMARY KEY AUTOINCREMENT, ""Username"" TEXT NOT NULL, ""FullName"" TEXT NOT NULL, ""Email"" TEXT NULL, ""Password"" TEXT NOT NULL, ""PinCode"" TEXT NULL, ""Role"" TEXT NOT NULL, ""IsActive"" INTEGER NOT NULL, ""LastLoginAt"" TEXT NULL, ""CreatedAt"" TEXT NOT NULL);");
            context.Database.ExecuteSqlRaw(@"CREATE TABLE IF NOT EXISTS ""AuditLogs"" (""Id"" INTEGER NOT NULL CONSTRAINT ""PK_AuditLogs"" PRIMARY KEY AUTOINCREMENT, ""UserId"" INTEGER NULL, ""UserName"" TEXT NOT NULL, ""Action"" TEXT NOT NULL, ""EntityName"" TEXT NOT NULL, ""EntityId"" TEXT NULL, ""Details"" TEXT NULL, ""IpAddress"" TEXT NULL, ""Timestamp"" TEXT NOT NULL);");
            
            // Add missing columns if AdminUsers table already existed
            try { context.Database.ExecuteSqlRaw(@"ALTER TABLE ""AdminUsers"" ADD COLUMN ""Email"" TEXT NULL;"); } catch { }
            try { context.Database.ExecuteSqlRaw(@"ALTER TABLE ""AdminUsers"" ADD COLUMN ""LastLoginAt"" TEXT NULL;"); } catch { }
        }
        catch { }

        // Seed initial audit log if empty
        if (!context.AuditLogs.Any())
        {
            context.AuditLogs.Add(new AuditLog
            {
                UserName = "System",
                Action = "SYSTEM_INITIALIZED",
                EntityName = "Database",
                Details = "Zilva Resort & Spa tizim va ma'lumotlar bazasi initsializatsiya qilindi.",
                IpAddress = "127.0.0.1",
                Timestamp = DateTime.UtcNow
            });
            context.SaveChanges();
        }

        // Seed initial admin user if not exists
        if (!context.AdminUsers.Any())
        {
            context.AdminUsers.AddRange(
                new AdminUser
                {
                    Username = "admin",
                    FullName = "Bosh Administrator",
                    Password = "zilva2026!admin",
                    PinCode = "7788",
                    Role = "SuperAdmin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new AdminUser
                {
                    Username = "menejer",
                    FullName = "Zilva Menejeri",
                    Password = "menejer2026!zilva",
                    PinCode = "1234",
                    Role = "Menejer",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );
            context.SaveChanges();
        }

        if (context.Rooms.Any())
        {
            return; // DB has already been seeded
        }

        // 1. Seed Amenities
        var wifi = new Amenity { Name = "Tezkor Wi-Fi", Icon = "Wifi", Category = "Texnologiya" };
        var tv = new Amenity { Name = "Smart TV 55\" & Netflix", Icon = "Tv", Category = "Texnologiya" };
        var ac = new Amenity { Name = "Iqlim nazorati & Isitish", Icon = "Snowflake", Category = "Qulaylik" };
        var coffee = new Amenity { Name = "Nespresso qahva & Choy to'plami", Icon = "Coffee", Category = "Taom" };
        var mountain = new Amenity { Name = "Tog' va archazor panoramasi", Icon = "Mountain", Category = "Manzara" };
        var fireplace = new Amenity { Name = "O'tinli haqiqiy kamin", Icon = "Flame", Category = "Hashamat" };
        var jacuzzi = new Amenity { Name = "Shaxsiy gidromassajli vanna (Jacuzzi)", Icon = "Bath", Category = "Vanna" };
        var safe = new Amenity { Name = "Elektron seyf", Icon = "ShieldCheck", Category = "Xavfsizlik" };
        var terrace = new Amenity { Name = "Shaxsiy ochiq terras / Balkon", Icon = "Sun", Category = "Tashqi" };
        var toiletries = new Amenity { Name = "L'Occitane premium parvarish vositalari", Icon = "Sparkles", Category = "Vanna" };
        var bathrobes = new Amenity { Name = "Paxta xalat va shippaklar", Icon = "Shirt", Category = "Qulaylik" };
        var roomService = new Amenity { Name = "24/7 Room Service & Konsyerj", Icon = "Bell", Category = "Xizmat" };

        var allAmenities = new List<Amenity>
        {
            wifi, tv, ac, coffee, mountain, fireplace, jacuzzi, safe, terrace, toiletries, bathrobes, roomService
        };

        context.Amenities.AddRange(allAmenities);
        context.SaveChanges();

        // Helper to add room with amenities and images
        var rooms = new List<Room>
        {
            new Room
            {
                Name = "Deluxe Mountain View",
                Slug = "deluxe-mountain-view",
                Category = "Deluxe",
                ShortDescription = "Katta vitrajli derazalar orqali qorli cho'qqilar va archazor o'rmoniga ochiladigan nafis xona.",
                Description = "Deluxe Mountain View xonasi shinamlik va tabiat bilan uyg'unlikni qadrlaydigan mehmonlar uchun yaratilgan. Keng King Size to'shak, yumshoq yoritish, tabiiy yog'och mebellar va tog'ning toza havosidan bahramand bo'lish uchun shinam balkon mavjud. Xonada Nespresso qahva mashinasi, zamonaviy Smart TV va premium vanna buyumlari hozirlangan.",
                PricePerNight = 1800000,
                Area = 42,
                MaxGuests = 2,
                Bedrooms = 1,
                Bathrooms = 1,
                BedType = "1 ta King Size karavot",
                ViewType = "Tog' va archazor panoramasi",
                CoverImage = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = true,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "14:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Xonada tamaki chekish qat'iyan man etiladi",
                    "Uy hayvonlari bilan joylashish ma'muriyat bilan kelishiladi",
                    "Tinchlik soatlari: 23:00 dan 08:00 gacha",
                    "Bepul bekor qilish: tashrifdan 48 soat oldin"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", Caption = "Asosiy yotoqxona va vitraj oynalar", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", Caption = "Shinam dam olish burchagi", SortOrder = 2 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", Caption = "Marmar vanna xonasi", SortOrder = 3 }
                }
            },
            new Room
            {
                Name = "Panoramic Jacuzzi Suite",
                Slug = "panoramic-jacuzzi-suite",
                Category = "Suite",
                ShortDescription = "Tog' manzarali shaxsiy gidromassaj vannasi va keng terassaga ega lyuks suit.",
                Description = "Unutilmas dam olish onlari uchun maxsus loyihalashtirilgan Panoramic Jacuzzi Suite. Keng terassada o'rnatilgan issiq suvli jakuzi orqali yulduzli osmon va ulug'vor tog'larni tomosha qilishingiz mumkin. Xona ichida qulay yashash zonasi, zamonaviy mini-bar va premium qulayliklar mavjud.",
                PricePerNight = 2700000,
                Area = 58,
                MaxGuests = 3,
                Bedrooms = 1,
                Bathrooms = 1,
                BedType = "1 ta King Size + 1 ta divan-karavot",
                ViewType = "360° Tog' panoramasi",
                CoverImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = true,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "14:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Xonada tamaki chekish taqiqlanadi",
                    "Jakuzidan foydalanish bo'yicha ko'rsatmalarga rioya qilinishi shart",
                    "Bepul bekor qilish: tashrifdan 72 soat oldin"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", Caption = "Panoramik lyuks xona", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80", Caption = "Shaxsiy terrasdagi jakuzi", SortOrder = 2 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", Caption = "Yashash maydoni", SortOrder = 3 }
                }
            },
            new Room
            {
                Name = "Luxury Chalet Villa",
                Slug = "luxury-chalet-villa",
                Category = "Chalet",
                ShortDescription = "Haqiqiy o'tinli kamin, 2 ta yotoqxona va shaxsiy BBQ terrasiga ega ikki qavatli shohona kottej.",
                Description = "Oilaviy yoki do'stlar davrasida unutilmas hordiq chiqarish uchun ideal ikki qavatli Chalet Villa. Birinchi qavatda shinam kaminli mehmonxona, oshxona burchagi va ovqatlanish stoli joylashgan. Ikkinchi qavatda 2 ta mustaqil yotoqxona va balkonlar mavjud. Shaxsiy hovlida mangal va terassa jihozlari mavjud.",
                PricePerNight = 4500000,
                Area = 95,
                MaxGuests = 6,
                Bedrooms = 2,
                Bathrooms = 2,
                BedType = "2 ta King Size + 1 ta ikki kishilik divan",
                ViewType = "Archazor o'rmoni va tog' cho'qqilari",
                CoverImage = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = true,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "15:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Kamindan foydalanishda xavfsizlik qoidalariga amal qiling",
                    "Mangal faqat ajratilgan maxsus hududda yoqiladi",
                    "Tinchlik soatlari: 23:00 dan 08:00 gacha"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", Caption = "Chalet tashqi ko'rinishi", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", Caption = "Kaminli keng mehmonxona", SortOrder = 2 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", Caption = "Asosiy yotoqxona", SortOrder = 3 }
                }
            },
            new Room
            {
                Name = "Executive Duplex Chalet",
                Slug = "executive-duplex-chalet",
                Category = "Chalet",
                ShortDescription = "Shaxsiy fin saunasi, keng mehmonxona va 3 ta yotoqxonaga ega eng hashamatli shalet.",
                Description = "Resort hududidagi eng yuqori darajadagi shaletlardan biri. Unda shaxsiy mini-sauna, 3 ta shinam yotoqxona, keng panoramali derazalar va hashamatli oshxona-mehmonxona mavjud. VIP servis va maxsus konsyerj xizmati kiritilgan.",
                PricePerNight = 6200000,
                Area = 130,
                MaxGuests = 8,
                Bedrooms = 3,
                Bathrooms = 3,
                BedType = "3 ta King Size karavot",
                ViewType = "To'liq tog' tizmasi panoramasi",
                CoverImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = true,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "15:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Saunadan foydalanish qoidalariga rioya qiling",
                    "Guruhli tadbirlar ma'muriyat bilan oldindan kelishilishi kerak"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", Caption = "Duplex kottej foni", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", Caption = "Shaxsiy sauna va vanna", SortOrder = 2 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", Caption = "Yuqori qavatdagi yotoqxona", SortOrder = 3 }
                }
            },
            new Room
            {
                Name = "Standard Forest Room",
                Slug = "standard-forest-room",
                Category = "Standard",
                ShortDescription = "Shinam va qulay, toza archazor qarag'aylari ifori ufurib turgan qulay standart xona.",
                Description = "Yakka sayohatchilar yoki juftliklar uchun ajoyib tanlov. Xonada sifatli ortopedik matras, ish stoli, yuqori tezlikdagi simsiz internet va zamonaviy dush kabinasi mavjud. Barcha zaruriy gigiyena to'plamlari taqdim etiladi.",
                PricePerNight = 1200000,
                Area = 30,
                MaxGuests = 2,
                Bedrooms = 1,
                Bathrooms = 1,
                BedType = "1 ta King Size yoki 2 ta alohida karavot",
                ViewType = "Qarag'ayzor o'rmon manzarasi",
                CoverImage = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = false,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "14:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Xonada tamaki chekish taqiqlanadi",
                    "Bekor qilish: 24 soat oldin bepul"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", Caption = "Standart xona interyeri", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", Caption = "Balkon manzarasi", SortOrder = 2 }
                }
            },
            new Room
            {
                Name = "Family Forest Cottage",
                Slug = "family-forest-cottage",
                Category = "Family",
                ShortDescription = "Oila a'zolari bilan osoyishta tog' qo'ynida dam olish uchun mo'ljallangan 2 xonali kottej.",
                Description = "Bolali oilalar uchun juda qulay kottej. Ota-onalar uchun alohida yotoqxona va bolalar uchun 2 ta alohida to'shakli xona mavjud. Kottej oldida xavfsiz chimzor va bolalar maydonchasiga qulay chiqish yo'lagi bor.",
                PricePerNight = 3400000,
                Area = 78,
                MaxGuests = 5,
                Bedrooms = 2,
                Bathrooms = 1,
                BedType = "1 ta King Size + 2 ta bir kishilik karavot",
                ViewType = "O'rmon va bolalar hududi manzarasi",
                CoverImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                IsFeatured = false,
                IsAvailable = true,
                BreakfastIncluded = true,
                CheckInTime = "14:00",
                CheckOutTime = "12:00",
                Rules = new List<string>
                {
                    "Bolalar uchun qo'shimcha beshik so'rov bo'yicha bepul taqdim etiladi",
                    "Chekish man etiladi"
                },
                Images = new List<RoomImage>
                {
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", Caption = "Family kottej zali", SortOrder = 1 },
                    new RoomImage { ImageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", Caption = "Bolalar xonasi", SortOrder = 2 }
                }
            }
        };

        context.Rooms.AddRange(rooms);
        context.SaveChanges();

        // 3. Connect Amenities to Rooms
        foreach (var room in rooms)
        {
            // All rooms get standard amenities
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = wifi.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = tv.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = ac.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = coffee.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = safe.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = mountain.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = toiletries.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = bathrobes.Id });
            context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = roomService.Id });

            if (room.Category == "Suite" || room.Category == "Chalet")
            {
                context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = terrace.Id });
            }

            if (room.Category == "Suite" || room.Slug == "panoramic-jacuzzi-suite")
            {
                context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = jacuzzi.Id });
            }

            if (room.Category == "Chalet")
            {
                context.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = fireplace.Id });
            }
        }

        // 4. Seed initial sample booking & contact requests
        context.BookingRequests.Add(new BookingRequest
        {
            FullName = "Rustam Karimov",
            Phone = "+998 90 123 45 67",
            Email = "rustam@example.com",
            CheckIn = DateTime.UtcNow.AddDays(7),
            CheckOut = DateTime.UtcNow.AddDays(10),
            Adults = 2,
            Children = 1,
            RoomId = rooms[0].Id,
            SpecialRequests = "Kechki payt kelamiz, iltimos bolalar uchun qo'shimcha yostiq tayyorlab qo'ying.",
            Status = "New",
            CreatedAt = DateTime.UtcNow.AddHours(-3)
        });

        context.ContactRequests.Add(new ContactRequest
        {
            FullName = "Dilshod Aliyev",
            Phone = "+998 99 888 77 66",
            Email = "dilshod@company.uz",
            Subject = "Korporativ tadbir o'tkazish",
            Message = "Assalomu alaykum! 25 kishilik jamoamiz uchun 2 kunlik konferensiya va dam olish xizmatlari narxlarini bilmoqchi edik.",
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        });

        context.SaveChanges();
    }
}
