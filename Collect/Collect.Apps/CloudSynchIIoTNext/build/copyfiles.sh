#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 


# Copy script

confdir=src/configurationFiles
conf=$confdir/config.json
sconf=$confdir/SynchConfig.json
script=src/scripts/appsStartup

appname=$1
appexename=$2
binpath=$3

echo appname    = $appname
echo appexename = $appexename
echo binpath    = $binpath
conftarget=$appexename.json

# Right now we are in build folder. So go un level up.
cd ..
pwd

echo $conf
echo "Copying configuration files"
cp -v $conf $binpath/$conftarget
cp -v $sconf $binpath/

echo copying appsStartup.bat file to bin folder
cp -v ${script}.* $binpath/
echo finished copying appsStartup.bat file to bin folder

