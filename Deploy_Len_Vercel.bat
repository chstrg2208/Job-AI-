@echo off
title TBR Plan Finder Pro - Deploy len Vercel
echo ============================================================
echo   TBR PLAN FINDER PRO - DEPLOY LEN VERCEL (ONLINE WEB)
echo   The Best Rate Insurance
echo ============================================================
echo.
echo Thuc hien day toan bo source code va du lieu len Vercel...
echo.

cd /d "E:\Job\tbr-plan-finder-deploy"

echo Dang goi Vercel CLI...
echo Neu lan dau chay, trinh duyet se mo de ban dang nhap tai khoan Vercel.
echo Sau khi dang nhap xong, man hinh se hoi vai cau:
echo   - Set up and deploy? Nhap y roi Enter
echo   - Which scope? Chon tai khoan cua ban roi Enter
echo   - Link to existing project? Nhap n roi Enter
echo   - What's your project's name? De nguyen hoac go ten roi Enter
echo.

npx vercel

echo.
echo ============================================================
echo   HOAN TAT!
echo   Vercel da cap duong link web online (co duoi .vercel.app)
echo   Ban co the copy link do gui cho moi nguoi su dung!
echo ============================================================
echo.
pause
