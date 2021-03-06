module.exports = function (grunt) {
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        force: true,
        laxbreak: true,
        quotmark: 'single',
        undef: true,
        unused: true,
        browser: true,
        ignores: 'src/js/tlop-templates.js',
        globals: {
          Tlop: true,
          Handlebars: true
        },
      },
      files: ['src/js/*.js']
    },

    sass: {
      options: {
        style: 'expanded'
      },
      dev: {
        files: {
        'dev/css/reset.css': 'src/scss/reset.scss',
        'dev/css/map.css': 'src/scss/map.scss'
        }
      },
      prod: {
        files: {
        'dist/css/reset.css': 'src/scss/reset.scss',
        'dist/css/map.css': 'src/scss/map.scss'
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: "Tlop.Templates",
          processName: function(filePath) {
            var name = filePath.split('/')[2].split('.');
            return name[0];
          }
        },
        files: {
          "src/js/tlop-templates.js": "src/templates/*.hbs",
        }
      }
    },

    replace: {
      options: {
        prefix: '@@'
      },
      dev: {
        options: {
          variables: {
            'script': 'js/tlop.js',
          }
        },
        files: [
          {expand: true, flatten: true, src: ['src/index.html'], dest: 'dev/'}
        ]
      },
      prod: {
        options: {
          variables: {
            'script': 'js/tlop.min.js',
          }
        },
        files: [
          {expand: true, flatten: true, src: ['src/index.html'], dest: 'dist/'}
        ]
      }
    },

    concat: {
      options: {
        banner: '/*!' + "\n" +
                  '  <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>' + "\n" +
                  '  <%= pkg.description %>' + "\n" +
                  '  (c) <%= pkg.author %> - <%= pkg.homepage %>' + "\n" +
                  '*/' + "\n"
      },
      dev: {
        files: {
          'dev/js/tlop.js': ['lib/handlebars-v1.3.0.js',
                             'src/js/tlop-templates.js',
                             'src/js/tlop-utils.js',
                             'src/js/tlop-constants.js',
                             'src/js/tlop-settings.js',
                             'src/js/tlop-script.js',
                             'src/js/tlop-splash-screen.js',
                             'src/js/tlop-menu.js',
                             'src/js/tlop-maps.js',
                             'src/js/tlop-pookie.js',
                             'src/js/tlop-engine.js'],
          'dev/index.html': ['src/index.html']

        }
      },

      prod: {
        files: {
          'dist/js/tlop.js': ['lib/handlebars-v1.3.0.js',
                              'src/js/tlop-templates.js',
                              'src/js/tlop-utils.js',
                              'src/js/tlop-constants.js',
                              'src/js/tlop-settings.js',
                              'src/js/tlop-script.js',
                              'src/js/tlop-splash-screen.js',
                              'src/js/tlop-menu.js',
                              'src/js/tlop-maps.js',
                              'src/js/tlop-pookie.js',
                              'src/js/tlop-engine.js'],
          'dist/index.html': ['src/index.html']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/tlop.min.js': ['dist/js/tlop.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('dev',  ['sass:dev',  'jshint', 'handlebars', 'concat:dev',            'replace']);
  grunt.registerTask('prod', ['sass:prod', 'jshint', 'handlebars', 'concat:prod', 'uglify', 'replace']);
};