FROM debian:latest
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust-images
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy xfwm4 xfce4-terminal xfce4-session xconf xfce4-notifyd \
    wget curl inetutils-ping imagemagick nano tigervnc-tools tigervnc-standalone-server tigervnc-common \
    firefox-esr && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 1000 stardust && \
    mkdir -p /run/dbus /home/stardust /home/stardust/.vnc && \
    chown -R stardust:stardust /home/stardust && \
    chmod 777 /home/stardust /app && \
    echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    usermod -aG sudo stardust

USER stardust

RUN touch /home/stardust/.Xresources /home/stardust/.Xauthority

COPY ./server ./server
COPY ./start.sh ./start.sh
COPY ./firefox/xstartup ./xstartup

RUN cp ./xstartup /home/stardust/.vnc/xstartup && \
    chmod +x /home/stardust/.vnc/xstartup && \
    cd server && sudo npm i -g pnpm tsx && sudo pnpm i && sudo pnpm build

CMD ["bash", "start.sh"]

EXPOSE 5901 6080
