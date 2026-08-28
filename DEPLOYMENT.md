# 🚀 Zilva Resort & Spa — Production Deployment Guide (Yo'riqnoma)

Ushbu hujjat loyihani real serverga (Ubuntu VPS, DigitalOcean, Hetzner, AWS) Docker va Nginx yordamida to'liq xavfsiz o'rnatish yo'riqnomasidir.

---

## 📋 1. Serverga Talablar (Prerequisites)
* **OS:** Ubuntu 22.04 LTS yoki 24.04 LTS
* **RAM:** Kamida 2 GB RAM (4 GB tavsiya etiladi)
* **CPU:** 2 vCPU
* **Dasturlar:** Docker & Docker Compose plugin (`docker compose version`)

---

## 🛠️ 2. Serverni Tayyorlash & O'rnatish

### 1-qadam: Docker & Docker Compose o'rnatish
```bash
# Paketlarni yangilash
sudo apt update && sudo apt upgrade -y

# Docker o'rnatish
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Foydalanuvchini docker guruhiga qo'shish
sudo usermod -aG docker $USER
newgrp docker
```

### 2-qadam: Loyihani serverga klonlash
```bash
git clone https://github.com/sherbekjumabekov01-design/Zilva-Resort.git
cd Zilva-Resort
```

### 3-qadam: Muhit o'zgaruvchilarini sozlash (`.env`)
```bash
cp .env.example .env
nano .env
```
`.env` faylida PostgreSQL paroli, JWT maxfiy kaliti va Telegram Bot tokenini kiriting:
```ini
POSTGRES_PASSWORD=SuperStrongSecretPassword2026!
TELEGRAM_BOT_TOKEN=123456789:ABCDefghIJKLmnopQRstUVwxYZ
TELEGRAM_CHAT_ID=-1001234567890
```

### 4-qadam: Konteynerlarni ishga tushirish (One-Click Launch)
```bash
docker compose up -d --build
```
Konteynerlar holatini tekshirish:
```bash
docker compose ps
```

---

## 🔒 3. SSL/HTTPS Sertifikatini O'rnatish (Let's Encrypt / Certbot)

Domen nomingiz bo'lsa (masalan `zilva-resort.uz`), Certbot orqali bepul SSL o'rnatish:

```bash
# Certbot o'rnatish
sudo apt install -y certbot

# Sertifikat olish
sudo certbot certonly --standalone -d zilva-resort.uz -d www.zilva-resort.uz

# Sertifikat fayllarini nginx papkasiga nusxalash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/zilva-resort.uz/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zilva-resort.uz/privkey.pem nginx/ssl/key.pem

# Nginx konteynerini qayta ishga tushirish
docker compose restart nginx
```

---

## 💾 4. Ma'lumotlar Bazasini Zaxiralash (Backup & Restore)

### Zaxira nusxa yaratish:
```bash
chmod +x scripts/backup_db.sh
./scripts/backup_db.sh
```

### Cron orqali har kuni avtomatik zaxiralash:
```bash
crontab -e
```
Quyidagi qatorni qo'shing (har kuni soat 03:00 da zaxiralaydi):
```cron
0 3 * * * /root/Zilva-Resort/scripts/backup_db.sh >> /var/log/zilva_backup.log 2>&1
```

---

## 🛡️ 5. Monitoring & Xavfsizlik Tekshiruvi
* **Healthcheck:** `curl http://localhost:5000/healthz` (Status: Healthy)
* **Loglar:** `docker compose logs -f backend` yoki `docker compose logs -f frontend`
* **Admin Panel:** `https://sizning-domeningiz.uz/admin`
