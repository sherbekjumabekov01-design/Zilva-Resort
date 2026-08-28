# PowerShell Database Backup Script for Zilva Resort
param (
    [string]$BackupDir = "backups",
    [string]$ContainerName = "zilva_postgres",
    [string]$DbUser = "zilva_admin",
    [string]$DbName = "zilva_resort"
)

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$BackupFile = "$BackupDir/backup_${DbName}_${Timestamp}.sql"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🌲 Zilva Resort Database Backup Started" -ForegroundColor Yellow
Write-Host "Fayl: $BackupFile"
Write-Host "=========================================="

docker exec -t $ContainerName pg_dump -U $DbUser -d $DbName > $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Zaxira nusxa (Backup) muvaffaqiyatli saqlandi!" -ForegroundColor Green
} else {
    Write-Host "❌ Xatolik yuz berdi!" -ForegroundColor Red
}
