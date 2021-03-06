module.exports = function (grunt) {
  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var concatFiles = [
    'build/sputils._pre.js',
    'bower_components/functional.js/functional.js',
    'bower_components/es6-promise-polyfill/promise.js',
    'bower_components/fetch/fetch.js',
    'src/sputils.lib.js',
    'src/sputils.helpers.js',
    'src/sputils.rest.js',
    'src/sputils.list.js',
    'src/sputils.conversion.js',
    'src/sputils.termstore.js',
    'src/sputils.user.js',
    'src/sputils.search.js',
    'src/sputils.userprofile.js',
    'build/sputils._post.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: concatFiles,
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          console: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'karma']
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', 'README.md'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'jsdoc'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build',
    'karma'
  ]);
};
