# ng-boilerplate

## Install
```bash
$ git clone git://github.com/joshdmiller/ng-boilerplate
$ cd ng-boilerplate
$ sudo npm -g install grunt-cli karma bower
$ npm install
$ bower install
(if you want to use foundation/sass) $ sudo apt-get gem install compass zurb-foundation
$ grunt dev
```

## Goal
This is my own take on https://github.com/ngbp/ng-boilerplate (called ngbp from now on in this file), modifying it
to work for *me*, not supposed to be generic.
The main difference with ngbp is that it is more barebone to fit my own needs :

- SASS with Foundation
- dev/release grunt tasks
- neat code organization (this uses the same layout as ngbp, except that the sass files are in a separate folder)

The main difference when it comes to code is that I am not using ngMin and therefore need to inline the injection of modules.

The following link http://docs.angularjs.org/guide/di (the Inline Annotation section) explains the way to do it.

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
The basic idea is that you create a folder for each feature in src/app and put your code/html in it (look at the home directory for an example).

Still not convinced of having templates in every folder instead of having a templates folder at the same level as the style one, 
might change that soon.

## Tasks
There are grunt 4 tasks :

- build: one off dev build
- dev: continuous build process, automatically run tests on code change, compile compass, concatenates templates
- test: run the whole test suite
- release: create a release directory containing the files ready to deploy

## TODO
Add common directory to the build
Maybe create a templates directory
