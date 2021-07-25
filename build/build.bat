echo off
echo Packaging web server components to executable

REM %~1 the first argument to the batch file is buildtype and can values either PIPELINE or ""
REM PIPELINE means the batch file is run from the build pipeline from the agent. 
REM An empty string ("") implies it is run from the local machine.
set buildtype="%~1"

set binFolder=./bin/x64/Release
set CWS=CollectWebServer

set cur=%~dp0
echo %cur%
pushd %cur%

echo navigating to project folder
cd ..
echo Executing folder is %cd%

Setlocal enabledelayedexpansion
REM Checking the build type to create the executable based on the input.
if %buildtype%=="PIPELINE" ( 
	echo The build is triggered by the PIPELINE.
	
	rem UI components will be copied by the download artifacts pipeline task to the public folder.
	echo run web server clean
	call npm run-script clean
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished run web server clean

	echo run web server build
	call npm run-script build
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished run web server build
	
	echo creating executable for web server
	call pkg -t node12-win-x64 -o %binFolder%/%CWS%.exe package.json
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished creating executable for web server

	echo copying configuration file to bin folder
	COPY "./config.json" "%binFolder%/%CWS%.exe.json"
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished copying configuration file to bin folder

	echo copying appsStartup.bat file to bin folder
	COPY "./appsStartup.bat" "%binFolder%/appsStartup.bat"
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished copying appsStartup.bat file to bin folder
	pause

) else if %buildtype%=="" (
	echo This build is triggered from the LOCAL machine.
	echo Assumes the i4Suite and i4SuiteCollect folders are in the same folder.

	echo navigating to Alert UI folder
	cd ..\i4Suite\Alerts\AlertUI\alert-ui-react
	echo Executing folder is %cd%
	echo creating deployables for Web-UI
	call npm run build
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished creating deployables for Web-UI

	echo copying binaries for UI build folder to public folder
	XCOPY  /S /Y /I /E "./build"  "../../../../i4SuiteCollect/public"
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished copying binaries for UI file to public folder

	echo run web server clean
	cd ..\..\..\..\i4SuiteCollect
	echo Executing folder is %cd%
	call npm run-script clean
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished run web server clean

	echo run web server build
	call npm run-script build
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished run web server build

	echo creating executable for web server
	call pkg -t node12-win-x64 -o ../i4Suite/Collect/Collect.Service/%CWS%/%binFolder%/%CWS%.exe package.json
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished creating executable for web server

	echo copying configuration file to bin folder
	COPY "./config.json" "../i4Suite/Collect/Collect.Service/%CWS%/%binFolder%/%CWS%.exe.json"
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished copying configuration file to bin folder

	echo copying appsStartup.bat file to bin folder
	COPY "./appsStartup.bat" "../i4Suite/Collect/Collect.Service/%CWS%/%binFolder%/appsStartup.bat"
	echo error level is %errorlevel%
	if %errorlevel% neq 0 exit /b %errorlevel%
	echo finished copying appsStartup.bat file to bin folder
	pause

)  else	(
	echo Invalid buildtype !buildtype!. Exiting the job.
	exit /b
)


