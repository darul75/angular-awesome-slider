module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },
    jshint: {
      files: ['src/ng-slider.js', 'test/**/*.js']
    },
    // KARMA TASK CONFIG
    karma: {
      unit: {
        options: {
          basePath: './',
          frameworks: ['jasmine'],
          browsers: ['Chrome'],
          autoWatch: true,
          singleRun: true,
          files: [            
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',                                    
            'src/ng-slider.js',
            'test/**/*Spec.js']
        }
      }
    },
    // UGLIFY TASK
    uglify: {
      task1: {
         options: {
            preserveComments: 'some',
            report: 'min',
            banner: '/** \n* @license <%= pkg.name %> - v<%= pkg.version %>\n' + 
             '* (c) 2013 Julien VALERY https://github.com/darul75/ng-slider\n' +
             '* License: MIT \n**/\n'
         },         
         files: {
             'dist/ng-slider.min.js': ['src/ng-slider.js']
         }
       }
     },
     // MINIFY CSS
    cssmin: {
      options: {
        keepSpecialComments: false,
        banner: '/** \n* @license <%= pkg.name %> - v<%= pkg.version %>\n' + 
             '* (c) 2013 Julien VALERY https://github.com/darul75/ng-slider\n' +
             '* License: MIT \n**/\n'
      },
      compress: {
        files: {          
          'dist/css/ng-slider.min.css': ['src/css/ng-slider.css', 'src/css/ng-slider.round.css']
        }
      }
    },
    // COPY CONTENT
    copy: {
      main: {
        files: [
          // slider
          {expand: true, flatten: true, src: ['src/img/*'], dest: 'dist/img/'},          
        ]
      }
    },
});

  // LOAD PLUGINS  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  // TASK REGISTER
  //grunt.registerTask('default', ['jshint', 'cssmin', 'uglify:task1', 'karma']);
  grunt.registerTask('default', ['copy', 'cssmin', 'uglify:task1']);
};
