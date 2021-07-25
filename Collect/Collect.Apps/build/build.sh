#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 

script=$0
dir=$(dirname $script)
cd $dir
echo $dir
cd ../
dir=$(pwd)
echo $dir

if [[ $(uname -s) == "Linux" ]]
then
    ext=
else
    ext=.exe
fi

rm -rf bin
binpath=bin/x64/Release
conf=bin/conf
mkdir -p $binpath
mkdir -p $conf

echo GOPATH = $GOPATH

# Now we are at the root folder of Collect.Apps
for b in $(ls */build/build.sh | grep -v "GOMODULEREF")
do
    echo; echo 
    echo Executing $b
    bash $b
    echo completed $b execution

    echo Copy to CollectApps bin folder
    app=$(echo $b | awk -F/ '{print $1}')
    echo app = $app
    echo Copy config files to a common place
    cp -v $app/$binpath/$app${ext}.json $conf/${app}Config.json
    mkdir -p $binpath/$app
    cp -v $app/$binpath/* $binpath/$app/
done



