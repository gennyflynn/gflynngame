# gflynngame 

## Overview

This is a lobby-based online version of the popular boardgame [Secret Hitler](https://www.secrethitler.com/)! 

## Tech stack: 

Server: Python, Flask

Client: Typescript, React


## Prerequisites

Install poetry 

```
    pip install poetry
    cd game-server/src/server
    poetry install 

```

Install yarn dependencies

```
    cd client
    yarn install
```

## Running Locally

### Server 

```
    cd game-server/src/server
    poetry run flask run 
```

This currently runs on port 5000. 
(May conflict with airplay on M1 Macs).

### Client

```
    cd client
    yarn start
```
