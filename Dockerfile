FROM node

ENV DEBIAN_FRONTEND=noninteractive

RUN \
	apt-get update && \
	apt-get install -y --no-install-recommends telnet && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*
