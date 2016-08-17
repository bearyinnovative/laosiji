#!/usr/bin/env bash

NVM_DIR="/home/hbc/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 5.11.1

ENV=$(pwd)/.env

[ -f "$ENV" ] && eval $(cat "$ENV" | sed 's/^/export /')

npm install --verbose --cache-min 999999 ./hubot-bearychat

exec ./bin/hubot -a bearychat -n 一言不合就开车斯基
