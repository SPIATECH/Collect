@ECHO OFF

echo "%cd%"

rem Change Directory to location of this file.
set dir=%~dp0
echo "%dir%"
pushd %dir%

rem #### start the Collect ModTCP Server program ####

"Collect-x ModbusTCP Server.exe"

rem exit



