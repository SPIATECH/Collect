#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

echo 
date
echo initializing dependancies for the application

if [[ $(uname -s) == "Linux" ]]
then
    ext=
else
    ext=.exe
fi


script=$0
echo script = $script
dir=$(dirname $script)
cd $dir
echo This is the build folder
dir=$(pwd)

cd ../
root=$(pwd)

echo Executing folder is $root

echo 
echo installing packages for CollectWebServer
npm-cache install npm 
echo finished installing packages for CollectWebServer
echo 
date


