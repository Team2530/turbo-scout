# turbo-scout

Scouting app for team 2530.

## Naming

A random name generator was used for the temporary project name `turbo-scout`.

## Usage (for developers)

### Normal

```bash
# Clone the repository
git clone https://github.com/Team2530/turbo-scout.git
cd turbo-scout

# Install NodeJS for your platform

## Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

## USe NVM to install NodeJS
nvm install 21.7.1

# See https://nodejs.org/en/download/ for instructions for different platforms.

# Install libraries used by the project
npm install

# Start a development server
npm run dev
```

### Docker

First, [install docker](https://docs.docker.com/engine/install/).

Then run these commands:

```sh
docker build -t turbo-scout .
docker run -it -p8000:3000 turbo-scout # Replace 8000 with the port number you want to use from your host machine.
# Then, open localhost:8000 in your web browser
```