@echo off
cd /d "%~dp0"

echo.
echo ================================
echo   Obnet Website - Git Push
echo ================================
echo.

git add .

set /p msg="Enter commit message: "

git commit -m "%msg%"

git push

echo.
echo ================================
echo   Done! Site will update in
echo   1-2 minutes at obnet.org
echo ================================
echo.
pause
