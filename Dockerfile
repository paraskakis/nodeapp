FROM ubuntu:14.04

MAINTAINER Emmanuel Paraskakis <paraskakis@gmail.com>

#Update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y update

#Install Wget
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install wget

#Install Curl
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install curl

#Install Git
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git

#Install Nano
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nano

#Install Node
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nodejs

#Install build essentials
#RUN DEBIAN_FRONTEND=noninteractive apt-get -y install build-essential openssl libssl-dev python

#Install global packages
RUN npm update
RUN npm install -g express
RUN npm install -g mocha
#RUN npm install -g nodemon

#Install Nginx
#RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nginx
#RUN service nginx stop

# Set the working directory
WORKDIR   /src

CMD ["/bin/bash"]