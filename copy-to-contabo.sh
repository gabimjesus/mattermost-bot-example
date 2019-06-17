#!/usr/bin/env bash

SSH_USER_AND_HOST='pead@pead.tokenlab.com.br'
DESTINATION='/home/pead/mattermost-bot-tutorial'

FILES='src docker-compose.yml nodemon.json package.json package-lock.json'

if [[ "$1" == "copy-env" ]]; then
  FILES=".env $FILES"
fi

rsync -i -r ${FILES} "$SSH_USER_AND_HOST:$DESTINATION"
