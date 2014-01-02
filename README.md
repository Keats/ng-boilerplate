# ng-boilerplate

## Install
```bash
$ git clone git://github.com/Keats/ng-boilerplate
$ cd ng-boilerplate
$ git submodule init
$ git submodule update
$ sudo npm -g install grunt-cli bower
$ npm install
$ bower install
$ grunt dev
```

## Goal
This is my own take on https://github.com/ngbp/ng-boilerplate (called ngbp from now on in this file), modifying it
to work for *me*, not supposed to be generic.
The main difference with ngbp is that it is more barebone to fit my own needs :

- SASS using snowflake https://github.com/Keats/snowflake (Bourbon + Neat + some parts of Foundation 5)
- dev/release grunt tasks
- neat code organization (this uses the same layout as ngbp, except that the sass files and templates are in their own folder)

The main difference when it comes to code is that I am not using ngMin and therefore do DI a bit differently (look at app.coffee to see an example).

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
  |- build.config.js
  |- Gruntfile.js
  |- package.json
```
See this awesome discussion to understand the structure : https://github.com/yeoman/generator-angular/issues/109
The basic idea is that you create a folder for each feature in src/app, making for very small files.
I also put tests into their own folders in a feature directory with an extensions of .tests.coffee.

## Tasks
There are 4 grunt tasks :

- build: one off dev build
- dev: continuous build process, automatically run tests on code change, compile compass, concatenates templates
- test: run the whole test suite
- release: create a release directory containing the files ready to deploy
