echo off
echo.
echo %time%
echo initializing dependancies for the application

set cur=%~dp0
echo %cur%
pushd %cur%

echo navigating to project folder
pushd ..
echo Executing folder is %cd%

echo.
echo installing packages for CollectWebServer
call npm-cache install npm 
echo finished installing packages for CollectWebServer
echo.
echo.
rem echo installing packages for AlertUI
rem pushd ..\AlertUI\alert-ui-react
rem echo Executing folder is %cd%
rem call npm-cache install npm 
rem echo finished installing packages for AlertUI
echo.
echo %time%
pause

