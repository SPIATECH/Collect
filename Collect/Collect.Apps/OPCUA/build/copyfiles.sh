#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 


# Copy script

confdir=src/configurationFiles
conf=$confdir/config.json
tconf=$confdir/tagconfig.json
script=src/scripts/appsStartup
cert=certificates/client_selfsigned_cert.pem

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
cp -v $tconf $binpath/

echo copying appsStartup.bat file to bin folder
cp -v ${script}.* $binpath/
echo finished copying appsStartup.bat file to bin folder


cp -v $cert $binpath/

