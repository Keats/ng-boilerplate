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

  var config = require('./misc/build-config.js')(grunt);

  grunt.initConfig({

    clean: {
      build: config.buildDirectory,
      release: config.releaseDirectory
    },

    // Build the foundation + custom files using compass
    compass: {
      main: {
        options: {
          config: config.compassConfigFile,
          cssDir: config.cssDirectory,
          sassDir: config.sassDirectory,
          force: true,
          environment: 'production'
        }
      }
    },

    // Compiles coffeescript
    coffee: {
      dev: {
        expand: true, // keeping the hierarchy while developing
        src: config.sourceFileFilter,
        dest: config.buildDirectory,
        ext: '.js'
      }
    },

    // Lint coffeescript files, with the 80l length rule ignored
    coffeelint: {
      options: {
        'max_line_length': {
          'level': 'ignore'
        }
      },
      src: {
        files: {
          src: config.sourceFileFilter
        }
      },
      tests: {
        files: {
          src: config.testFileFilter
        }
      }
    },

    // Creates the index page (ie, add js and css links in the template)
    index: {
      dev: {
        dir: config.buildDirectory,
        src: config.indexTask.dev
      },
      release: {
        dir: config.releaseDirectory,
        src: config.indexTask.release
      }
    },

    // Copy libs js/css and our assets over to the build directory
    copy: {
      libsJs: {
        files: [
          {
            src: config.libs.js,
            dest: config.buildDirectory,
            expand: true
          }
        ]
      },

      libsCss: {
        files: [
          {
            src: config.libs.css,
            dest: config.buildDirectory,
            expand: true
          }
        ]
      },
      // Using src=** and cwd so it doesn't include the src/ folder when copying
      assets: {
        files: [
          {
            src: ['**'],
            dest: config.buildDirectory,
            cwd: config.assetsDirectory,
            expand: true
          }
        ]
      },

      releaseAssets: {
        files: [
          {
            src: ['**'],
            dest: config.releaseDirectory,
            cwd: config.assetsDirectory,
            expand: true
          }
        ]
      },

      releaseCss: {
        files: [
          {
            src: ['**'],
            cwd: config.cssDirectory,
            dest: config.releaseDirectory + 'style/',
            expand: true
          }
        ]
      }
    },

    // This will concatenate all the .html files in the src folder and
    // create a js file to be used in an angular app
    html2js: {
      all: {
        options: {
          module: 'templates',
          base: 'src/templates'
        },
        src: config.templateFileFilter,
        dest: config.convertedTemplatesPath
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
        files: config.karmaFiles,
        preprocessors: {
          '**/*.coffee': 'coffee'
        },
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

    // uglify our app (not vendors js) and adds a banner to it
    uglify: {
      release: {
        options: {
          banner: config.banner
        },
        files: {
          'release/scripts/app.js': config.ownJsToMinifyFilter,
        }
      }
    },

    // We only want 1 file for the libs so concatenate all of the minified one
    concat: {
      releaseLibs: {
        src: config.libs.jsMin,
        dest: config.releaseLibsMinPath
      }
    },

    // what to do when a file changes
    watch: {
      options: {
        livereload: true,
      },

      coffeeSrc: {
        files: config.sourceFileFilter,
        tasks: ['coffeelint:src', 'coffee', 'karma:dev:run']
      },

      coffeeTests: {
        files: config.testFileFilter,
        tasks: ['coffeelint:tests', 'karma:dev:run'],
        options: {
          livereload: false
        }
      },

      sass: {
        files: config.sassFileFilter,
        tasks: ['compass:main']
      },

      templates: {
        files: config.templateFileFilter,
        tasks: ['html2js']
      },

      index: {
        files: config.indexFileFilter,
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

    if (this.target === 'dev') {
      jsFiles.push('http://localhost:35729/livereload.js');
    }

    grunt.file.copy(config.indexFileFilter, this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
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
      'coffee',
      'copy:libsJs',
      'copy:libsCss',
      'copy:assets',
      'index:dev'
    ]
  );

  // Task to run whil developing, will watch over changes and run tests, compile sass/etc
  grunt.registerTask(
    'dev',
    [
      'karma:dev', // starts the karma server and browser
      'build',
      'watch'
    ]
  );

  // Alias to run the full test suite
  grunt.registerTask('test', ['karma:complete']);

  // This will create a release folder, containing the app ready to be deployed
  grunt.registerTask(
    'release',
    [
      'clean',
      'build',
      'uglify',
      'concat',
      'copy:releaseAssets',
      'copy:releaseCss',
      'index:release',
      'clean:build'
    ]
  );

};