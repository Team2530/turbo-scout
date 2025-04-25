#!/bin/sh

cp ./event.json ../turbo-scout/src/config/event.json
cp ./teams.json ../turbo-discord/src/main/resources/teams.json

echo "Remember to change the event code in the discord bot main class too!"
