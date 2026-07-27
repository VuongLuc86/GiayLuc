@echo off
chcp 65001 >nul
title Day website Vuong Luc len GitHub
echo.
echo ============================================
echo   DAY WEBSITE LEN GITHUB
echo   https://github.com/VuongLuc86/GiayLuc
echo ============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [LOI] Chua cai Git tren may.
  echo Tai tai: https://git-scm.com/download/win
  echo Cai xong, mo lai file nay.
  echo.
  pause
  exit /b 1
)

cd /d "%~dp0"

echo Dang kiem tra thay doi...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  set /p MSG="Mo ta thay doi (Enter de dung mac dinh): "
  if "%MSG%"=="" set MSG=Cap nhat noi dung website
  git commit -m "%MSG%"
) else (
  echo Khong co thay doi moi, chi day len thoi.
)

echo.
echo Dang day len GitHub...
echo Lan dau tien se hien cua so dang nhap GitHub - bam Sign in with your browser.
echo.
git push -u origin main

if errorlevel 1 (
  echo.
  echo [LOI] Day len that bai. Xem thong bao o tren.
  echo Neu bao "Authentication failed", chay lenh sau roi thu lai:
  echo    git credential-manager github login
) else (
  echo.
  echo [XONG] Da day len https://github.com/VuongLuc86/GiayLuc
)

echo.
pause
