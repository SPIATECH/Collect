@ECHO OFF

echo %cd%

rem Change Directory to location of this file.
set dir=%~dp0
echo Dir = %dir%
pushd %dir%
echo %cd%

rem start the AlertManager program
start AlertManager.exe

echo Completed appsStartup.bat for ALERTMANAGER script
exit

