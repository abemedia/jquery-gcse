'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('gcse.jquery.json'),
    banner: '/*!\n' +
        '* jQuery Google CSE v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> Adam Bouqdib\n' +
        '* Licensed under <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>) \n*/\n\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: 'block',
      },
      dist: {
        src: ['src/js/jquery.<%= pkg.name %>.js'],
        dest: 'dist/js/jquery.<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/js/jquery.<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    updatejson: {
      options: {
        src: 'gcse.jquery.json',
        dest: ['bower.json', 'package.json'],
        indent: '    ',
        fields: ['title', 'description', 'version', 'homepage', 'keywords', 'dependencies']
      }
    },
    less: {
      dist: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
          ]
        },
        files: {
          'dist/css/jquery.gcse.css': 'src/less/gcse.less'
        }
      }
    },
    cssmin: {
      options : {
      },
      dist: {
        files: [{
          src: ['dist/css/jquery.gcse.css'],
          dest: 'dist/css/jquery.gcse.min.css',
        }]
      }
    }
  });
  
  grunt.registerTask('updatejson', function () {
    // set config vars
    var options = this.options();
    if(typeof(options.dest) === 'string') {
      options.dest = [options.dest];
    }
    
    // check that all files exist
    var files = (JSON.parse(JSON.stringify(options.dest)));
    files.push(options.src);
    for (var d = 0; d < files.length; d++) {
      if (!grunt.file.exists(files[d])) {
        grunt.log.error("file " + files[d] + " not found");
        return false;
      }
    }
    
    // read source data
    grunt.log.writeln("Reading from " + options.src);
    var src = grunt.file.readJSON(options.src);
    
    // update destination files
    for (d = 0; d < options.dest.length; d++) {
      var data = grunt.file.readJSON(options.dest[d]);
      for (var f = 0; f < options.fields.length; f++) {
        var field = options.fields[f];
        if(typeof(data[field]) !== 'undefined') {
            data[field] = src[field];
        }
      }
      grunt.file.write(options.dest[d], JSON.stringify(data, options.indent, 2));
      grunt.log.writeln("Updated " + options.dest[d]);
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  //grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('css', ['less', 'cssmin']);
  grunt.registerTask('js', ['concat', 'uglify']);
  grunt.registerTask('build', ['clean', 'css', 'js', 'updatejson']);
  grunt.registerTask('default', ['test', 'build']);
};
