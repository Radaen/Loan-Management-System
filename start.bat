@echo off
title LoanFlow Pro - Loan Management System
echo ================================================================
echo   LoanFlow Pro - ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចី
echo   Stack: React JS, Tailwind CSS, Node.js, MongoDB
echo ================================================================
echo.
echo Starting Backend API Server (Node.js Express)...
start "LoanFlow Server (Port 5000)" cmd /k "cd /d %~dp0server && node index.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server (React Vite + Tailwind CSS)...
start "LoanFlow Client (Port 3000)" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo [DONE] Servers started successfully!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo ================================================================
pause
