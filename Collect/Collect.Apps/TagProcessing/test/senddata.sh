#!/usr/bin/bash
##  Collect : Collect, Store and Forward industrial data
##  Copyright SPIA Tech India, www.spiatech.com
##  MIT License

count=${1-100}
delay=${2-1}

broker=localhost
port=3883
pub=mosquitto_pub
user='spiai4user'
pass="All your sensors are mine"
topic="spiai4suite/data/raw"
tagid=$(uuid | tr a-z A-Z)

for f in $(seq 1 $count)
do
        tstamp=$(date +"%s")
        val=$(expr 33 + $f)
        msg="{
            \"tagname\" : \"Temperature\",
            \"value\" : ${val},
            \"timestamp\" : ${tstamp},
            \"device\" : \"Device1\",
            \"tagid\" : \"${tagid}\",
            \"group\" : \"Plant1\",
            \"parentgroup\" : \"Aluva\",
            \"mastergroup\" : \"Ernakulam\"
        }"


        printf "$msg\n"

        $pub -h $broker -p $port -t $topic  -m "$msg" -u $user -P "$pass"
        sleep $delay
done




