#!/bin/bash

#Provisionning
wget -qO- https://deb.nodesource.com/setup_5.x | sudo bash - # This command includes apt-get update
sudo apt-get -y install jq nodejs git # Nodejs 5.x includes npm
sudo npm install nodemon gulp sails -g

#Build
cd /vagrant
npm install --no-bin-links

npm start
