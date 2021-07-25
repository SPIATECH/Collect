@ECHO OFF

echo %cd%

rem Change Directory to location of this file.
set dir=%~dp0
echo Dir = %dir%
pushd %dir%
echo %cd%

rem start the AlertManager program
start CloudSynchIIoTNext.exe

echo Completed appsStartup.bat for Cloud Synch IIoTNext script
exit

