# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.231.6/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use hirsuite or bionic on local arm64/Apple Silicon): hirsute, focal, bionic
ARG VARIANT="bionic"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends build-essential

RUN wget https://nodejs.org/dist/v16.15.0/node-v16.15.0-linux-x64.tar.xz && \
    tar -xf node-v16.15.0-linux-x64.tar.xz && \
    rm -rf "${PWD}/node-v16.15.0-linux-x64.tar.xz"

ENV PATH="/node-v16.15.0-linux-x64/bin:${PATH}"
