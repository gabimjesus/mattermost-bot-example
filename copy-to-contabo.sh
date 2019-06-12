#!/usr/bin/env bash

FILES='src .env docker-compose.yml nodemon.json package.json package-lock.json'
DESTINATION='/home/pead/mattermost-bot-tutorial'

rsync -i -r $FILES "pead@pead.tokenlab.com.br:$DESTINATION"
