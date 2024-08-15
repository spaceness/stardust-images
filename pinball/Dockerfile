FROM debian:latest
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust-images
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
ENV START="./SpaceCadetPinball"
WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy unzip xfwm4 xfce4-terminal xfce4-session xfconf xfce4-notifyd \
    wget curl inetutils-ping imagemagick vim libsdl2-mixer-2.0-0 libsdl2-2.0-0 fluidsynth && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs
COPY ./scripts/xpra.sh ./xpra-install.sh
RUN bash xpra-install.sh
RUN useradd --uid 1000 stardust && \
    mkdir -p /run/dbus /home/stardust /home/stardust/.vnc && \
    chown -R stardust:stardust /home/stardust && \
    chmod 777 /home/stardust /app && \
    echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    usermod -aG sudo stardust

USER stardust

RUN touch /home/stardust/.Xresources /home/stardust/.Xauthority

COPY ./server ./server
COPY ./scripts/start.sh ./start.sh
COPY ./pinball/xstartup /home/stardust/.vnc/xstartup

RUN sudo chmod +x /home/stardust/.vnc/xstartup && \
    cd server && sudo npm i -g pnpm tsx && sudo pnpm i && sudo pnpm build

USER root
COPY ./pinball/files ./files
RUN cd files && unzip PINBALL.ZIP && chmod 777 * && chmod 777 . && chmod +x ./SpaceCadetPinball
USER stardust

CMD ["bash", "start.sh"]

EXPOSE 5901 6080
