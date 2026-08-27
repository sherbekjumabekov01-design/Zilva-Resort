# Chimgan / Zilva Resort & Spa — Production MVP Backlog

Ushbu hujjat loyihani xavfsiz, testlangan va internetga chiqarishga tayyor **Production MVP** holatiga olib chiqish bo'yicha to'liq ish rejasidir.

---

## 📌 1. Hozirgi Loyiha Holati Auditi

| Komponent | Hozirgi Holat | Baholash | Zarur O'zgarishlar |
|---|---|---|---|
| **Backend (.NET 10)** | Web API kontrollerlar, SQLite/Npgsql kodlari mavjud | 🟡 O'rtacha | Validation (FluentValidation), ProblemDetails, Rate Limiting, HealthChecks, PII masking, CORS hardening |
| **Database** | SQLite + Npgsql ulanish kodi bor, lekin migrationlar yo'q | 🟡 O'rtacha | EF Core Migrations yaratish, DateOnly & Decimal tiplari, Indexlar, PostgreSQL Docker Compose |
| **Frontend (Next.js 16)** | Barcha sahifalar, Shishali dizayn, Dark mode va Admin UI bor | 🟢 Yaxshi | `/privacy`, `/terms` sahifalari, SEO (`sitemap.ts`, `robots.ts`, JSON-LD), Booking MVP ogohlantirish matni |
| **Admin Panel** | Login, Dashboard, Xona boshqaruvi, CSV eksport bor | 🟢 Yaxshi | Rollar va xavfsiz sessiya nazorati, Audit log, Xona to'liq CRUD |
| **Xavfsizlik** | PIN & Parol bor, CORS ochiq | 🟡 O'rtacha | Environment variable ajratish, Rate limiting, Security headers, Secret management |
| **Testlar** | Hali yozilmagan | 🔴 Yo'q | xUnit Backend testlari, Integration testlar, Frontend smoke testlari |
| **Docker & Deploy** | Hali yo'q | 🔴 Yo'q | Backend Dockerfile, Frontend Dockerfile, docker-compose.yml, DEPLOYMENT.md |

---

## 📋 2. Bosqichma-Bosqich Production MVP Backlog

### 🟢 1-Bosqich: Backend Arxitekturasi & PostgreSQL Migratsiyalari
- [ ] EF Core Migrations to'liq generatsiya qilish (`InitialCreate`).
- [ ] Modellar bo'yicha ma'lumotlar turlari va constraintlarni tekshirish (`decimal(18,2)`, `DateOnly`, unique slug index).
- [ ] Database Seederni takrorlanuvchan (idempotent) holatga keltirish.
- [ ] Docker Compose ichida PostgreSQL 16 xizmatini sozlash.

### 🟢 2-Bosqich: Backend Xavfsizligi, Validation & Error Handling
- [ ] FluentValidation / ModelValidatorlar (Telefon, Email, Sanalar, Odamlar soni).
- [ ] RFC 7807 `ProblemDetails` bo'yicha global xatoliklar qaytarish.
- [ ] ASP.NET Core Rate Limiter (`/api/bookingrequests`, `/api/contactrequests`, `/api/auth/login`).
- [ ] Structured logging va shaxsiy ma'lumotlarni maskalash (PII masking).
- [ ] `/healthz` Health Check endpointini ulash.
- [ ] CORS ruxsatini faqat belgilangan domenlar bilan cheklash.

### 🟢 3-Bosqich: Frontend Sahifalari & Booking MVP Qoidalari
- [ ] `/privacy` (Maxfiylik siyosati) sahifasini yaratish.
- [ ] `/terms` (Foydalanish va bronlash shartlari) sahifasini yaratish.
- [ ] Booking modaliga aniq ogohlantirish izohini qo'shish: *"So‘rov yuborilishi xona bron qilinganini anglatmaydi. Menejer mavjudlikni tekshirib, siz bilan bog‘lanadi."*
- [ ] Qo'sh submit (double click) bloklash va xatoliklarni input yonida aniq ko'rsatish.
- [ ] `not-found.tsx` va `error.tsx` xatolik sahifalarini sozlash.

### 🟢 4-Bosqich: Admin Panel Xavfsizligi & Boshqaruv
- [ ] Admin panelda xona ma'lumotlarini to'liq tahrirlash (narx, sig'im, rasmlar).
- [ ] Booking va Contact so'rovlari statuslari boshqaruvi (`New`, `Contacted`, `Confirmed`, `Rejected`, `Spam`).
- [ ] So'rovlar bo'yicha filtrlash va qidiruv.

### 🟢 5-Bosqich: SEO, Meta Tags, Sitemap & Performance
- [ ] `sitemap.ts` va `robots.ts` yaratish.
- [ ] Barcha sahifalar uchun OpenGraph, Twitter card va Canonical URLlar.
- [ ] Schema.org JSON-LD structured data (`LodgingBusiness`, `HotelRoom`).
- [ ] Rasmlar va shriftlar yuklanishini optimallashtirish.

### 🟢 6-Bosqich: Avtomatlashtirilgan Testlar
- [ ] Backend xUnit unit testlari (Validation, DTO mapping, Date checks).
- [ ] Backend `WebApplicationFactory` orqali integratsion API testlari.
- [ ] Frontend build, lint va test tekshiruvlari.

### 🟢 7-Bosqich: Dockerizatsiya & Deployment Hujjatlari
- [ ] Backend uchun ko'p bosqichli (multi-stage) `Dockerfile`.
- [ ] Frontend uchun `standalone` rejimdagi `Dockerfile`.
- [ ] `docker-compose.yml` (PostgreSQL + Backend + Frontend + Healthchecks).
- [ ] `.env.example` shabloni.
- [ ] `DEPLOYMENT.md` yo'riqnomasi (Backup, Restore, SSL, Environment variables).

### 🟢 8-Bosqich: Yakuniy Production Audit & `PRODUCTION_READINESS.md`
- [ ] Barcha build, test, lint va docker compose holatini tekshirish.
- [ ] `PRODUCTION_READINESS.md` hisobotini tayyorlash.
