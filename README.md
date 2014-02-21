# ng-boilerplate
[![Build Status](https://travis-ci.org/Keats/ng-boilerplate.png?branch=master)](https://travis-ci.org/Keats/ng-boilerplate)
![Dependencies Status](https://david-dm.org/Keats/ng-boilerplate.png)

## Goal
This project serves as a starting point for AngularJS projects using Coffeescript and SASS (it can easily be changed though).  

It provides code organisation by feature (see Structure for more details) and a build system ready for development and testing.  

It also uses [Snowflake](https://github.com/Keats/snowflake) which is Bourbon + Neat + Foundation 5.

The build system is using [Gulp](http://gulpjs.com/) instead of the usual Grunt for speed and simplicity (I wrote an [article](http://vincent.is/introducing-people-to-gulp/) introducing it with examples).  
The code instead of configuration approach makes it easy to modify things compared to Grunt.  

So in short you get:

- automatic SASS compilation using libsass
- automatic coffeescript linting and compilation (+ concatenation and minification on dist environment)
- automatic preload of templates using html2js (+ minification on dist environment)
- continuous testing with karma
- integration testing with protractor
- automatic copy of libs and assets
- automatic creation of the tags in index.html, ie no need to insert js/css tags by hand
- CI setup via Travis


## Install
To start your own project, you can clone that project, get rid of the history, change the git origin and start working by following the snippet below
```bash
$ git clone git://github.com/Keats/ng-boilerplate myproject
$ cd myproject
$ git checkout --orphan temp
$ git commit 'initial commit'
$ git branch -D master
$ git branch -m master
$ git remote remove origin
$ git remote add origin yourgitrepourl.git
$ git submodule init
$ git submodule update
$ sudo npm -g install gulp
$ npm install
$ bower install
$ gulp --require coffee-script/register
```

## Structure

```bash
ng-boilerplate/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- style/
  |  |  |- **/*.scss
  |  |- templates/
  |  |  |- **/*.html
  |  |- tests/
  |  |  |- unit
  |  |  |  |- **/*.coffee
  |  |  |- integration
  |  |  |  |- **/*.coffee
  |- libs/
  |  |- angular/
  |  |- angular-ui-router/
  |- gulpfile.coffee
```

This app organisation groups code by feature but not to the point of grouping the templates/tests/css inside it (it's really to change that in the gulpfile if you want to do that though).  

Look at the home module present in the boilerplate to see how you can integrate a module in the angular app.


## Tasks
This uses gulp (http://gulpjs.com/) so you can call any of the tasks defined in the gulpfile.
The default one watches over the files and runs the associated tasks when needed and is called like this:
```bash
$ gulp --require coffee-script/register
```

To build the version to distribute, run the following:
```bash
$ gulp build --require coffee-script/register --type dist
```

To run units + integrations tests (you need the build directory for the integration tests to run):
```bash
$ gulp build --require coffee-script/register
$ cd build && python -m SimpleHTTPServer 8001 > /dev/null 2>&1 & 
$ gulp ci --require coffee-script/register
```



