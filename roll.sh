#!/bin/bash

#curl --silent http://catfood.service.consul:9090/rotate/1 >> /mnt/fast/gits/catfood/roll.log 2>&1

echo $(date)": "$(curl --silent http://catfood.service.consul:9090/rotate/1) >> /mnt/fast/gits/catfood/roll.log
