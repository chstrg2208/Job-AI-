@echo off
chcp 65001 >nul
echo ========================================================
echo   TBR INSURANCE - DONG BO 2 CHIEU (CLOUD ^<--^> LOCAL)
echo ========================================================
echo.

cd /d "E:\Job"

echo [1/3] Dang keo du lieu moi nhat tu GitHub (Cloud) ve May tinh...
git pull --rebase origin main
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] Khong the keo du lieu ve. Vui long kiem tra ket noi mang!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Dang kiem tra thay doi tren may tinh...
git add -A
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo [OK] Du lieu may tinh va GitHub da hoan toan dong bo, khong co gi moi can day!
) else (
    echo [3/3] Dang day du lieu moi tu May tinh len GitHub...
    git commit -m "sync: auto-sync local changes to cloud [%date% %time%]"
    git push origin main
    if %ERRORLEVEL% EQU 0 (
        echo [THANH CONG] Da day toan bo du lieu len GitHub thanh cong!
    ) else (
        echo [LOI] Khong the day du lieu len GitHub. Vui long kiem tra lai!
    )
)

echo.
echo ========================================================
echo Hoan tat dong bo 2 chieu!
echo ========================================================
timeout /t 3 >nul
