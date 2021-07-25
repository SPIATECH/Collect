#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 

# Build Script
bin=bin/x64/Release

script=$0
echo script = $script
dir=$(dirname $script)
cd $dir
echo This is the build folder
dir=$(pwd)
cd ../
root=$(pwd)
appname=$(basename $root)


cd collect-ui-react
pwd
echo cleaning up
rm -rfv build

echo Clean completed
echo

