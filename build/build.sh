#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License


bin=bin/x64/Release
appname=CollectWebServer

echo 
date
echo Build start

if [[ $(uname -s) == "Linux" ]]
then
    ext=
    buildtype=node12-linux-x64
else
    ext=.exe
    buildtype=node12-linux-x64
fi


script=$0

echo $script
echo $uidir

echo script = $script
dir=$(dirname $script)
cd $dir
echo This is the build folder
dir=$(pwd)

cd ../
root=$(pwd)

echo Executing folder is $root


npm run-script clean
npm run-script build

pkg -t $buildtype -o $bin/$appname$ext package.json


echo Copy the files
cd $dir
./copyfiles.sh $appname $appname $bin

echo 
date


