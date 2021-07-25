#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 

echo Packaging OPCUA components to executable

binpath=bin/x64/Release
pkgfile=package.json

if [[ $(uname -s) == "Linux" ]]
then
    ext=
    build=buildlin
    bintype=node12-linux-x64
else
    ext=.exe
    build=buildwin
    bintype=node12-win-x64
fi

script=$0
dir=$(dirname $script)
cd $dir
dir=$(pwd)
# read the list of packages
cd ../

root=$(pwd)
echo Executing folder is $root
appname=$(basename $root)
appexename=${appname}${ext}

echo run opcua build
npm run-script clean
npm run-script $build || { echo ERR npm run-script failed > /dev/stderr ; exit 2; }

echo creating executable for $appname
rm -rfv $binpath
mkdir -p $binpath
pkg -t $bintype -o $binpath/$appexename $pkgfile || exit 3
echo finished creating executable for appname

cd $dir
./copyfiles.sh $appname $appexename $binpath

echo Completed


