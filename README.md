PRioritizer visualizer
======================

[![Build Status](https://travis-ci.org/PRioritizer/PRioritizer-visualizer.svg)](https://travis-ci.org/PRioritizer/PRioritizer-visualizer)

A pull request prioritization visualizer written in Javascript and AngularJS.

Prerequisites
-------------

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) package manager
* A webserver, which serves static pages, like [Lighttpd](http://www.lighttpd.net/), [Nginx](http://nginx.org/) or [Apache 2](http://httpd.apache.org/)

Building
--------

1. Clone the project into `~/visualizer`
2. Install dependencies with `npm install`
3. Copy (or link) the output folder with the `.json` files generated with the [analyzer](https://github.com/PRioritizer/PRioritizer-analyzer) to `./app/json`.
4. Build the project with `grunt build`

Running
-------

1. Start the project with a built-in webserver with `grunt serve`
2. A webbrowser opens a tab with the project
3. Select one of the projects to view the prioritization

To run the project on a different webserver do the following.

1. Build the project with `grunt build`
2. A complete static website is now placed in the `dist` folder
3. Copy the contents of this folder to your webserver

Make sure that the server also has access to the generated `.json` files.
You can also use grunt to upload your website through FTP.

1. Copy the file `ssh/production.json.dist` to `ssh/production.json`
2. Change the settings of the new file to your SSH server.
3. Use `grunt production` to build and upload the files.
