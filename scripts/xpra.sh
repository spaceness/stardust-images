#!/bin/bash
apt install -y apt-transport-https software-properties-common
apt install -y ca-certificates
curl -fsSL https://xpra.org/xpra.asc -o /usr/share/keyrings/xpra.asc
curl -fsSL https://xpra.org/repos/bookworm/xpra.sources -o /etc/apt/sources.list.d/xpra.sources
apt update -y
apt install -y xpra
