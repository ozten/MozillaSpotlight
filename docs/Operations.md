# Operations

## Installation

    git clone https://github.com/ozten/MozillaSpotlight
    cd MozillaSpotlight
    npm install

## Configuration

    cp config.js-dist config
    emacs config.js

## Running the server

    npm start

This should probably be run under `forever`, deamontools, or some other processes manager that will restart it.