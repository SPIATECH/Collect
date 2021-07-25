#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e 

opt=$1

script=$0
dir=$(dirname $script)
cd $dir
echo $dir
cd ../
pwd

if [[ $opt == "all" ]]
then
    echo removing lib folder
    rm -rf lib
fi

# Now we are at the root folder of Collect.Apps
for b in */build/build.sh
do
    echo Go to $b
    bdir=$(dirname $b)
    cd $bdir/../
    pwd
    echo removing the binaries
    rm -rf bin
    if [[ $opt == "all" ]]
    then
        echo removing all the packages
        rm -rf pkg bin src/golang.org src/gopkg.in src/github.com dist
    fi
    cd -
done



