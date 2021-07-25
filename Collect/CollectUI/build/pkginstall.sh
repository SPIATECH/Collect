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
dir=$(pwd)
cd ../


cd collect-ui-react
pwd
echo packages install started
npm install npm 2>&1 || { echo ERR: npm install npm failed; exit 1; } 


echo  packages install completed
exit 0

