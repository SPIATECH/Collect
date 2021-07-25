#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e
echo 
echo
date
echo initializing dependancies for the application


script=$0
dir=$(dirname $script)
cd $dir
# read the list of packages
cd ../

echo
echo installing packages
ls package.json
# This command will install all packages mentioned in package.json
# Some warnings are being printed to stderr. So redirecting them to stdout
npm install npm 2>&1 || { echo ERR npm install failed > /dev/stderr; exit 1; } 
echo finished installing packages
date

exit 0

