#!/bin/bash
export VNCPASSWORD=$(openssl rand -base64 32)
echo $VNCPASSWORD | vncpasswd -f > /home/stardust/.vnc/passwd
vncserver -kill :1
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
echo "while :
do
vncserver :1 -passwd /home/stardust/.vnc/passwd -fg -localhost no
sleep 5
done
" | bash &
sleep 1
tsx server/index.ts
