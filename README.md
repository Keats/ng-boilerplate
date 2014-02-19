# ng-boilerplate
[![Build Status](https://travis-ci.org/Keats/ng-boilerplate.png?branch=master)](https://travis-ci.org/Keats/ng-boilerplate)
![Dependencies Status](https://david-dm.org/Keats/ng-boilerplate.png)

## Install
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

## Goal
This is my own take on https://github.com/ngbp/ng-boilerplate (called ngbp from now on in this file), modifying it
to work for *me*, not supposed to be generic.
The main difference with ngbp is that it is more barebone to fit my own needs :

- SASS using snowflake https://github.com/Keats/snowflake (Bourbon + Neat + some parts of Foundation 5)
- using gulp instead of grunt
- neat code organization by feature

## Structure

```bash
ng-boilerplate/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- style/
  |  |  |- *.scss
  |  |- templates/
  |  |  |- **/*.html
  |- libs/
  |  |- angular/
  |  |- angular-ui-router/
  |- .bowerrc
  |- .gitignore
  |- bower.json
  |- gulpfile.coffee
  |- package.json
```
See this awesome discussion to understand the structure : https://github.com/yeoman/generator-angular/issues/109
The basic idea is that you create a folder for each feature in src/app, making for very small files.
I also put tests into their own folders in a feature directory with an extensions of .tests.coffee.

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


