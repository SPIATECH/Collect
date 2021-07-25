#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

set -e



# PKG INSTALL 
script=$0
dir=$(dirname $script)
cd $dir

# read the list of packages
cd ../src

echo GOPATH = $GOPATH

go mod download 2>&1
[[ $? -ne 0 ]]  && { echo go mod download failed; exit 1; }

echo PkgInstall Completed

