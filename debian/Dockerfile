FROM debian:latest
LABEL org.opencontainers.image.source https://github.com/spaceness/stardust-images

ENV USER=stardust
ENV PNPM_HOME="/home/${USER}/.local/share/pnpm"
WORKDIR /app

# Combine apt-get commands
RUN apt-get update && apt-get install --no-install-recommends -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy \
    xfwm4 xfce4-terminal xfce4-session xconf xfce4-notifyd wget curl inetutils-ping imagemagick nano \
    tigervnc-tools tigervnc-standalone-server tigervnc-common chromium && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 1000 ${USER} && \
    mkdir -p /run/dbus /home/${USER}/.vnc && \
    chown -R ${USER}:${USER} /home/${USER} && \
    chmod 777 /home/${USER} /app && \
    echo "${USER} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    usermod -aG sudo ${USER}

USER ${USER}

COPY ./server ./server
COPY ./start.sh ./start.sh
COPY ./firefox/xstartup ./xstartup

RUN cp ./xstartup /home/${USER}/.vnc/xstartup && \
    chmod +x /home/${USER}/.vnc/xstartup && \
    touch /home/${USER}/.Xauthority && \
    touch /home/${USER}/.Xresources && \
    cd server && \
    sudo npm i -g pnpm tsx && \
    sudo pnpm i && \
    sudo pnpm build

CMD ["bash", "start.sh"]

EXPOSE 5901 6080