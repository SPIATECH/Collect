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
pwd

dir=$(pwd)
echo $dir

echo GOPATH = $GOPATH

# Now we are at the root folder of Collect.Apps
for b in $(ls */build/pkginstall.sh | grep -v "GOMODULEREF")
do
    echo Executing $b
    bash $b
    echo completed $b execution
done



