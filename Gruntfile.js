// Generated on 2015-03-02 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= config.app %>/assets/js/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/assets/scss/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'newer:autoprefixer:server']
      },
      styles: {
        files: ['<%= config.app %>/assets/css/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'newer:autoprefixer:server']
      },
      // assemble: {
      //   files: ['<%= config.app %>/layouts/*.*',
      //           '<%= config.app %>/pages/*.*',
      //           '<%= config.app %>/partials/*.*'],
      //   tasks: ['newer:assemble:server']
      // },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.app %>/assets/css/{,*/}*.css',
          '<%= config.app %>/assets/img/{,*/}*'
        ]
      }
    },

    browserSync: {
      server: {
        files: {
          src: ['<%= config.app %>/{,*/}*.html', '<%= config.app %>/assets/css/{,*/}*.css', '{.tmp,<%= config.app %>}/assets/js/{,*/}*.js', '<%= config.app %>/assets/img/{,/}*.{gif,jpeg,jpg,png,svg,webp}'],
        },
        options: {
          //proxy: 'localhost:8010',
          watchTask: true,
          logLevel: 'silent',
          ghostMode: {
            scroll: true,
            links: true,
            forms: true
          },
          server: {
            baseDir: ['<%= config.app %>', '.tmp'],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          //proxy: 'localhost:8010',
          watchTask: false,
          logLevel: 'silent',
          ghostMode: {
            scroll: true,
            links: true,
            forms: true
          },
          server: {
            baseDir: ['<%= config.dist %>', '.tmp']
          }
        }
      }
    },

    assemble: {
      options: {
        flatten: true,
        layoutdir: '<%= config.app %>/layouts',
        layoutext: '.html',
        partials: ['<%= config.app %>/partials/*.*']
      },
      all: {
        options: {
        },
        files: {
          '<%= config.app %>': ['<%= config.app %>/pages/*.*']
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: ['.tmp', '<%= config.app %>/assets/css/']
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: false,
        includePaths: ['<%= config.app %>/bower_components', '<%= config.app %>/bower_components/bootstrap-sass-official/assets/stylesheets']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets/scss',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/assets/css',
          ext: '.css'
        }],
        options: {
          outputStyle: 'compressed',
          sourceComments: false
        }
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets/scss',
          src: ['*.{scss,sass}'],
          dest: '<%= config.app %>/assets/css',
          ext: '.css'
        }],
        options: {
          outputStyle: 'nested',
          sourceComments: true
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/assets/js/{,*/}*.js'
      ]
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        cascade: false,
        browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1', 'ie >= 9']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets/css/',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/assets/css/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>/assets/css/',
          src: '{,*/}*.css',
          dest: '<%= config.dist %>/assets/css/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html'],
        exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/_bootstrap.js']
      },
      sass: {
        src: ['<%= config.app %>/assets/scss/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/assets/js/{,*/}*.js',
            '<%= config.dist %>/assets/css/{,*/}*.css',
            '<%= config.dist %>/assets/img/{,*/}*.*',
            '<%= config.dist %>/assets/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/assets/img',
          '<%= config.dist %>/assets/css'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/assets/css/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets/img',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/assets/img'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets/img',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/assets/img'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'assets/img/{,*/}*.webp',
            '**/*.html',
            'assets/fonts/{,*/}*.*',
            '!**/bower_components/**'
          ]
        }, {
          src: '<%= config.app %>/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }, {
          expand: true,
          dot: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= config.dist %>'
        }]
      },
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            filter: 'isFile',
            cwd: '<%= config.app %>/bower_components/',
            dest: '<%= config.app %>/assets/fonts/',
            src: [
                'bootstrap-sass-official/assets/fonts/bootstrap/**'
            ]
          }
        ]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/assets/scss',
        dest: '<%= config.app %>/assets/css/',
        src: '{,*/}*.css'
      }
    },

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: '<%= config.app %>/bower_components/modernizr/modernizr.js',
        outputFile: '<%= config.dist %>/assets/js/modernizr.js',
        files: {
          src: [
            '<%= config.dist %>/assets/js/{,*/}*.js',
            '<%= config.dist %>/assets/css/{,*/}*.css'
          ]
        },
        uglify: true
      }
    },

    // Spriting tool
    sprite: {
      all: {
        src: '<%= config.app %>/assets/img/sprites/*.png',
        dest: '<%= config.app %>/assets/img/sprites.png',
        destCss: '<%= config.app %>/assets/scss/_sprites.scss'
      }
    },

    // Updates all grunt plugins automatically
    devUpdate: {
      main: {
        options: {
          updateType: 'prompt',
          semver: false
        }
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server',
        'copy:styles',
        'copy:fonts',
        // 'includes:server'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'sass:dist',
        'copy:styles',
        'copy:fonts',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'browserSync:dist'
      ]);
    }

    grunt.task.run([
      'clean:server',
      //'assemble:all',
      'wiredep',
      'sprite:all',
      'concurrent:server',
      'autoprefixer:server',
      'browserSync:server',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'browserSync:server'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    //'assemble:all',
    'wiredep',
    'sprite:all',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer:dist',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'modernizr',
    // 'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('update', [
    'devUpdate:main'
  ]);

};
