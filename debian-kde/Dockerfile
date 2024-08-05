FROM debian:latest
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust-images
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
WORKDIR /app

RUN apt-get update && apt-get install  -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy wget curl inetutils-ping imagemagickvim\
    kde-plasma-desktop breeze firefox-esr kwin-x11 plasma-discover tigervnc-tools tigervnc-standalone-server \
    tigervnc-common && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd --uid 1000 stardust && \
    mkdir -p /run/dbus /home/stardust /home/stardust/.vnc && \
    chown -R stardust:stardust /home/stardust && \
    chmod 777 /home/stardust /app && \
    echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    usermod -aG sudo stardust && \
    echo 'stardust:' | chpasswd -e

USER stardust

RUN touch /home/stardust/.Xresources /home/stardust/.Xauthority

COPY ./server ./server
RUN cd server && \
    sudo npm i -g pnpm tsx && \
    sudo pnpm i && \
    sudo pnpm build
COPY ./scripts/start.sh ./start.sh
COPY ./debian-kde/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
RUN touch /home/stardust/.Xauthority
CMD ["bash", "start.sh"]
EXPOSE 5901 6080
