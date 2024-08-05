# Stardust Images

Docker workspaces with Guac preinstalled, created specifically for Stardust. However, these images can also be used independently.

Additionally, a Fastify server is included for file upload and download functionality.

### Running the Docker Image

To run the Docker image, use the following command (using Debian as an example):

```bash
docker run -it --rm -p 5901:5901 -p 6080:6080 ghcr.io/spaceness/debian:latest
```

This command will start the Docker container and open the required ports for Guac and the agent.
