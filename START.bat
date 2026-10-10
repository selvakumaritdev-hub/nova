@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo First time: installing, please wait 1-2 minutes...
  call npm install
)
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:5173 & start http://localhost:5173/admin"
echo NOVA MALL running. Do NOT close this window.
npm run dev
