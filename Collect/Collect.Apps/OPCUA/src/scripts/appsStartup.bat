@ECHO OFF

set appname=OPCUA
set appexename=%appname%.exe
set CONFIG_FILE=C:\SPIA\Config\%appname%Config.json
echo %cd%

rem Change Directory to location of this file.
set dir=%~dp0
echo Dir = %dir%
pushd %dir%
echo %cd%

rem start the AlertManager program
start %appexename%

echo appsStartup.bat %appexename% exited
exit

