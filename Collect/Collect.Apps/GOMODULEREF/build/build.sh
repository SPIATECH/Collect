#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 

# Build Script

bin=bin/x64/Release
maindir=src
mainfile=main/main.go
if [[ $(uname -s) == "Linux" ]]
then
    ext=
else
    ext=.exe
fi

mainexe=main/main${ext}

script=$0
echo script = $script
dir=$(dirname $script)
cd $dir
echo This is the build folder
dir=$(pwd)

cd ../
root=$(pwd)
appname=$(basename $root)
appexename=${appname}${ext}

export GOPATH="$GOPATH:$root"
echo GOPATH = $GOPATH


cd $maindir
pwd

echo Building.....
go build -o $mainexe $mainfile
echo Build completed
echo

binpath=$root/$bin
echo binpath = $binpath
mkdir -p $binpath
echo Copy to Binary folder - $binpath
cp $mainexe $binpath/$appexename

cd $dir
bash ./copyfiles.sh $appname $appexename $binpath

