FROM debian:latest
LABEL org.opencontainers.image.source https://github.com/spaceness/stardust-images
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
WORKDIR /app
RUN apt-get update && apt-get install --no-install-recommends -y xfonts-75dpi xvfb passwd sudo dbus dbus-x11 \
    libxrandr2 libxext-dev libxrender-dev libxtst-dev python3 python3-pip xterm git procps python3-numpy neofetch \
    xfce4 wget curl xfce4-goodies inetutils-ping firefox-esr chromium gimp imagemagick remmina remmina-plugin-vnc remmina-plugin-rdp flatpak vim
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&\
    apt-get install -y nodejs
RUN apt-get install --no-install-recommends -y \
    tigervnc-tools tigervnc-standalone-server tigervnc-common
RUN mkdir -p /run/dbus
RUN useradd --uid 1000 stardust
RUN mkdir -p /home/stardust
RUN chown stardust /home/stardust
RUN chmod 777 /home/stardust
RUN chmod 777 /app
RUN echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
RUN usermod -aG sudo stardust
USER stardust
RUN mkdir -p /home/stardust/.vnc
RUN touch /home/stardust/.Xresources /home/stardust/.Xauthority
COPY ./server ./server
RUN cd server && \
    sudo npm i -g pnpm tsx && \
    sudo pnpm i && \
    sudo pnpm build
COPY ./scripts/start.sh ./start.sh
COPY ./debian/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
CMD ["bash", "start.sh"]
EXPOSE 5901 6080
