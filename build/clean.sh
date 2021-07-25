#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

echo 
date
echo Cleaning ...

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
rm -rfv bin dist

echo 
echo finished cleaning
echo 
date


