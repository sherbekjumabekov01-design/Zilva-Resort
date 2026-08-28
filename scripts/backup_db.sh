#!/usr/bin/env bash
# ===================================================================
# 🌲 Zilva Resort Database Automated Backup Script (Linux / Ubuntu)
# ===================================================================

BACKUP_DIR="./backups"
CONTAINER_NAME="zilva_postgres"
DB_USER="zilva_admin"
DB_NAME="zilva_resort"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

echo "=========================================="
echo "🌲 Zilva Resort DB Backup boshlandi..."
echo "Fayl: $BACKUP_FILE"
echo "=========================================="

docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Zaxira nusxa (Backup) muvaffaqiyatli saqlandi!"
  # Delete backups older than 14 days
  find "$BACKUP_DIR" -type f -name "*.sql" -mtime +14 -delete
else
  echo "❌ Zaxiralashda xatolik yuz berdi!"
  exit 1
fi
