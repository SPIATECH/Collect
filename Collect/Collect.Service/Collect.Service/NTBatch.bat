@echo off 
SETLOCAL EnableExtensions
tasklist /FI "IMAGENAME eq NotificationTray.exe" 2>NUL | find /I /N "NotificationTray.exe">NUL
if "%ERRORLEVEL%" NEQ "0" (cd "%~dp0"
cd "..\..\NotificationTray\bin\Release"
start NotificationTray.exe)
exit