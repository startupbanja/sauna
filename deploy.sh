#!/bin/bash
#This is the script for deploying the project. Some of the folders mentioned below might need to be created first before running this.


# ask for sudo
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi
# Pull from github master
rm ~/git-pull -rf
mkdir ~/git-pull
cd ~/git-pull
git clone https://github.com/startupbanja/sauna.git
cd sauna
# Prepare frontend
npm install
npm run build
rm /var/sauna/frontend/ -rf
mkdir /var/sauna/frontend
cp -r ~/git-pull/sauna/build/* /var/sauna/frontend
# Prepare backend
cd ~/git-pull/sauna/backend
npm install
rm /var/sauna/backend -rf
mkdir /var/sauna/backend
cp -r ~/git-pull/sauna/backend/* /var/sauna/backend
systemctl restart backend
