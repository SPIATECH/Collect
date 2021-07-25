@ECHO OFF

echo %cd%

rem Change Directory to location of this file.
set dir=%~dp0
echo Dir = %dir%
cd %dir%
echo %cd%

rem start the \CollectWebServer program
start CollectWebServer.exe


echo Completed appsStartup.bat for COLLECTWEBSERVER
exit

