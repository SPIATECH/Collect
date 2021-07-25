#!/usr/bin/bash
#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License


script=$0
dir=$(dirname $script)
cd $dir
dir=$(pwd)
echo Executing folder is $dir
appname=$(basename $dir)
./CollectWebServer
echo Exited


