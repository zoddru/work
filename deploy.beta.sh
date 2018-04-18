#!/bin/sh
ssh nodejs@52.17.41.23 <<EOF
 cd dataMaturity-beta
 git checkout -- .
 git pull origin master
 npm i
 pm2 restart all
 exit
EOF