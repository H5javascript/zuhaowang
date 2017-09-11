#!/usr/bin/env bash

# Options & Settings
HOSTS="zuhao1 zuhao2"
#RUSER=dsdev
RUSER=web
#TCAPPDIR=tc_8.0.14_zuhao-api
#RSYNC_OPT="-v -r -t --delete --progress --size-only";export RSYNC_OPT
RSYNC_OPT="-v -r -t --delete --progress";export RSYNC_OPT

npm install
npm run build

for each in $HOSTS; do
  rsync $RSYNC_OPT dist/ $RUSER@$each:/data/webapp/zh-h5-api/
done
