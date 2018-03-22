#!/bin/sh
ssh nodejs@52.17.41.23 <<EOF
 cd dataMaturity
 git checkout -- .
 git pull origin release
 npm i
 pm2 restart all
 exit
EOF