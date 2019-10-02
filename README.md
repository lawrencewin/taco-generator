# Taco Generator

A web app created by Lawrence Win for the ClickTime software development internship challenge

## How To Install/Use

The app is hosted on GitHub Pages. Just go to the link [here](https://lawrencewin.github.io/taco-generator/#/).

However, the online version does have limitations. Due to the limitations of hosting things on pages, cookies can't be set, and
the main way of saving taco generations across multiple sessions doesn't exist.

To run the app offline, clone the repository to your computer by typing in `git clone https://github.com/lawrencewin/taco-generator.git` into your terminal anywhere on your computer.

Once you clone the repo, go into the main directory with your terminal. Install the required dependencies using `npm install`. Once installation is finished, type `npm start`, and the app should run in your browser at [http://localhost:3000](http://localhost:3000).

To regain cookie functionality, just uncomment lines within the Home.js file within each method dealing with cookies. 
