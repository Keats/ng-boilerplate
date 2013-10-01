module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');


  var projectConfig = {
    projectName: 'MyProject',
    version: '0.0.0',

    buildDirectory: 'build/',
    releaseDirectory: 'release/',
    templatesFile: 'build/templates.js',
  };


  // Path to 3rd party js/css (installed via bower)
  var libs = {
    js: [
      'libs/angular/angular.js',
      'libs/angular-ui-router/release/angular-ui-router.js',
    ],
    jsMin: [
      'libs/angular/angular.min.js',
      'libs/angular-ui-router/release/angular-ui-router.min.js',
    ],
    css: []
  }

  // Contains all the files needed by Karma to run tests
  var testingFiles = libs.js;
  testingFiles = testingFiles.concat([
    projectConfig.templatesApp,
    projectConfig.templatesCommon,
    'libs/chai/chai.js',
    'src/.chai-asserts.js',
    'libs/angular-mocks/angular-mocks.js',
    'src/app/**/*.coffee',
    'src/app/**/*.tests.coffee'
  ])

  var sourceFiles = ['src/**/*.coffee', '!src/**/*.tests.coffee'];
  var testFiles = ['src/**/*.tests.coffee'];

  grunt.initConfig({

    clean: [projectConfig.buildDirectory, projectConfig.releaseDirectory],

    // Build the foundation + custom files using compass
    compass: {
      main: {
        options: {
          config: 'src/style/compass.rb',
          cssDir: 'build/style',
          sassDir: 'src/style',
          force: true,
          environment: 'production'
        }
      }
    },

    // Compiles coffeescript
    coffee: {
      dev: {
        expand: true,
        cwd: '.',
        src: sourceFiles,
        dest: projectConfig.buildDirectory,
        ext: '.js'
      },
      release: {
        files: {
          'release/scripts/app.js': sourceFiles
        }
      }
    },

    // Lint coffeescript, with the 80l length rule ignored
    coffeelint: {
      options: {
        'max_line_length': {
          'level': 'ignore'
        }
      },
      src: {
        files: {
          src: sourceFiles
        }
      },
      tests: {
        files: {
          src: testFiles
        }
      }
    },

    // Creates the index page (ie, add js and css links)
    index: {
      dev: {
        dir: projectConfig.buildDirectory,
        src: [
          libs.js,
          libs.css,
          projectConfig.buildDirectory + 'src/**/*.js',
          projectConfig.buildDirectory + 'style/*.css',
          projectConfig.templatesFile
        ]
      },
      release: {
        dir: projectConfig.releaseDirectory,
        src: [
          projectConfig.releaseDirectory + 'scripts/libs.js',
          projectConfig.releaseDirectory + 'scripts/app.js',
          projectConfig.releaseDirectory + 'scripts/templates.js',
          projectConfig.releaseDirectory + 'style/*.css',
        ]
      }
    },

    // Copy libs js/css and our assets over to the build directory
    // TODO: check if i can improve that part
    copy: {
      libs_js: {
        files: [
          {
            src: libs.js,
            dest: projectConfig.buildDirectory,
            cwd: '.',
            expand: true
          }
        ]
      },

      libs_css: {
        files: [
          {
            src: libs.css,
            dest: projectConfig.buildDirectory,
            cwd: '.',
            expand: true
          }
        ]
      },

      assets: {
        files: [
          {
            src: ['**'],
            dest: projectConfig.buildDirectory,
            cwd: 'src/assets',
            expand: true
          }
        ]
      },

      releaseAssets: {
        files: [
          {
            src: ['**'],
            dest: projectConfig.releaseDirectory,
            cwd: 'src/assets',
            expand: true
          }
        ]
      },

      releaseCss: {
        files: [
          {
            src: ['**'],
            dest: projectConfig.releaseDirectory + 'style/',
            cwd: 'build/style',
            expand: true
          }
        ]
      }
    },

    html2js: {
      all: {
        options: {
          module: 'templates'
        },
        src: ['src/app/**/*.html', 'src/common/**/*.html'],
        dest: projectConfig.templatesFile
      }
    },

    // Testing config
    karma: {
      options: {
        port: 9876,
        runnerPort: 9100,
        autoWatch: false,
        urlRoot: '/',
        browsers: ['Firefox'],
        reporters: 'dots',
        files: testingFiles,
        preprocessors: {'**/*.coffee': 'coffee'},
        plugins: [
          'karma-mocha',
          'karma-firefox-launcher',
          'karma-coffee-preprocessor',
          'karma-phantomjs-launcher'
        ],
        frameworks: ['mocha']
      },
      dev: {
        background: true,
        singleRun: false
      },
      complete: {
        singleRun: true,
        background: false,
        browsers: ['PhantomJS', 'Firefox']
      }
    },

    uglify: {
      release: {
        files: {
          'release/scripts/app.js': ['build/src/app/**/*.js', 'build/templates.js'],
        }
      }
    },

    concat: {
      release: {
        src: libs.jsMin,
        dest: 'release/scripts/libs.js'
      }
    },

    // what to do when a file changes
    watch: {
      coffeeSrc: {
        files: sourceFiles,
        tasks: ['coffeelint:src', 'coffee', 'karma:dev:run']
      },

      coffeeTests: {
        files: testFiles,
        tasks: ['coffeelint:tests', 'karma:dev:run']
      },

      sass: {
        files: ['src/style/**/*.scss'],
        tasks: ['compass:main']
      },

      templates: {
        files: ['src/app/**/*.html', 'src/common/**/*.html'],
        tasks: ['html2js']
      },

      index: {
        files: ['src/index.html'],
        tasks: ['index:dev']
      }
    }

  });


  // Filter files according to the given regex
  function filterFor(files, regex) {
    return files.filter(function (file) {
      return file.match(regex);
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    // This regex will remove the 'root' path when inserting in the template
    var dirRE = new RegExp('^(build|release)\/', 'g');
    var jsFiles = filterFor(this.filesSrc, /\.js$/).map(function (file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterFor(this.filesSrc, /\.css$/).map(function (file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles
          }
        });
      }
    });
  });

  // Builds the app without running the test, used in other tasks
  grunt.registerTask(
    'build',
    [
      'html2js',
      'compass',
      'coffeelint:src',
      'coffee:dev',
      'copy',
      'index:dev'
    ]
  );

  // Task to run whil developing, will watch over changes and run tests/compile sass/etc
  grunt.registerTask(
    'dev',
    [
      'karma:dev', // starts the karma server and browser
      'build',
      'watch'
    ]
  );

  // This will create a release folder, containing the app ready to be deployed
  grunt.registerTask(
    'release',
    [
      'build',
      'uglify',
      'concat',
      'copy:releaseAssets',
      'copy:releaseCss',
      'index:release'
    ]
  );


};