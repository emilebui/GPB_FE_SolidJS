# Genshin Ban Pick - Front-end SSR (Solidjs)

- This is the server-side front end application for Genshin Ban Pick
- Tech stack:
    - Solid start (Solidjs)
    - websocket

### NOTE 
- This project is build up on [Pustur/genshin-impact-team-randomizer](https://github.com/Pustur/genshin-impact-team-randomizer)

## Installation Instructions

### Requirements
- git
- nodejs

### Initial Setup
- Install dependencies:
    - Run: `npm install`

### Run application

- **RUN**:
  - `npm run dev -- --open`

- **NOTE**:
  - You may need to run the gbp_ws server first to have a working backend for this project

## Build

- Docker build
  - `docker build -t gbp_fe .`
- Regular build
  - `npm build`