#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License


artifactsdir=~/i4suite-artifacts
uidir=$artifactsdir/CollectUI/public
webdir=$artifactsdir/CollectWebServer/Release

action=$1

script=$0
echo $script
echo script = $script
dir=$(dirname $script)
cd $dir
echo This is the build folder
dir=$(pwd)
cd ../
root=$(pwd)
pwd


case $action in
    "download")
        if [[ -d "$uidir" ]]
        then
	    echo
            echo $uidir
            echo Copying UI to public folder
            cp -rv $uidir/*  public/
        else
            echo Folder not found $uidir
	    echo ERROR
	    exit 3
        fi
    ;;
    "upload")
	    mkdir -p $artifactsdir
	    rm -rf $webdir
	    mkdir -p $webdir
	    cp -rv bin/x64/Release/*  $webdir/
    ;;
    *)
	    echo $Invalid option $action
	    echo
	    echo Usage:
	    echo "    artifacts download"
	    echo "           OR"
	    echo "    artifacts upload"
	    echo
	    exit 1
    ;;
esac

