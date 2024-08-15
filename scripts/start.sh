#!/bin/bash
export VNCPASSWORD=$(openssl rand -base64 32)
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
echo "while :
do
sudo -u stardust xpra start-desktop :1 \
 --start=$START \
 --no-daemon \
 --bind-tcp=0.0.0.0:5901 \
 --auth=env,name=VNCPASSWORD
sleep 5
done
" | bash &
sleep 1
tsx server/index.ts
