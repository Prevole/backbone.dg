module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    # ### Meta data
    meta:
      banner:
        '/*\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %>\n' +
        ' * Distributed under MIT license\n' +
        ' * <%= pkg.homepage %>\n' +
        ' */\n'

    # ### Clean tasks
    clean:
      core: ['dist']
      demo: ['demo/demo.*', 'demo/js/backbone.dg.js']
      doc: ['doc']
      test: ['spec/javascripts']

    # ### Install web dependencies
    bowercopy:
      options:
        clean: true
      css:
        options:
          destPrefix: 'demo/css'
        files:
          'bootstrap.css': 'bootstrap/dist/css/bootstrap.css'
          'bootstrap-theme.css': 'bootstrap/dist/css/bootstrap-theme.css'
      fonts:
        options:
          destPrefix: 'demo'
        files:
          'fonts': 'bootstrap/dist/fonts'
      js:
        options:
          destPrefix: 'demo/js'
        files:
          'backbone.js': 'backbone/backbone.js'
          'backbone.marionette.js': 'marionette/lib/backbone.marionette.js'
          'bootstrap.js': 'bootstrap/dist/js/bootstrap.js'
          'jquery.js': 'jquery/dist/jquery.js'
          'json2.js': 'json2/json2.js'
          'underscore.js': 'underscore/underscore.js'


    # ### CoffeeLint tasks
    coffeelint:
      options:
        max_line_length:
          value: 120
      core: ['src/dg/*.coffee']
      demo: ['src/demo/*.coffee']

    # ### Coffee
    coffee:
      test:
        options:
          bare: true
        src: ['spec/coffeescripts/**.coffee']
        dest: 'spec/javascripts/'
        ext: '.spec.js'
        expand:true
        flatten: true

    # ### Rigger tasks
    rig:
      core:
        options:
          banner: '<%= meta.banner %>'
        files:
          'dist/std/backbone.dg.js': ['src/dg/backbone.dg.coffee']
      demo:
        files:
          'demo/demo.js': ['src/demo/demo.coffee']

    # ### Sass tasks
    sass:
      demo:
        files:
          'demo/demo.css': 'src/demo/demo.scss'

    # ### Haml tasks
    haml:
      demo:
        files:
          'demo/demo.html': 'src/demo/demo.haml'

    # ### Uglify tasks
    uglify:
      options:
        banner: '<%= meta.banner %>'
        mangle:
          except: ['Backbone']
      core:
        files:
          'dist/std/backbone.dg.min.js': ['dist/std/backbone.dg.js']

    # ### Copy tasks
    copy:
      demo:
        files: [
          { dest: 'demo/js/', src: ['dist/std/backbone.dg.js'], flatten: true, expand: true }
        ]

    # ### Docker tasks
    docker:
      doc:
        options:
          extra: ['fileSearch', 'goToLine']
          colourScheme: 'friendly'
          lineNums: true
          ignoreHidden: true
          exclude: 'demo,dist,doc,node_modules,spec,bower_components'
        dest: 'doc'
        src: ['.']

    # ### Jasmine tasks
    jasmine:
      core:
        src: [
          'demo/js/json2.js'
          'demo/js/jquery.js'
          'demo/js/underscore.js'
          'demo/js/backbone.js'
          'demo/js/backbone.marionette.js'
          'dist/std/backbone.dg.js'
        ]
        options:
          helpers: 'spec/javascripts/helpers/*.js'
          specs: 'spec/javascripts/**/*.spec.js'

    # ### Watch tasks
    watch:
      core:
        files: 'src/dg/*'
        tasks: ['core', 'demo']
      demo:
        files: 'src/demo/*'
        tasks: 'demo'

    # ### Bump configuration
    bump:
      options:
        files: ['package.json', 'bower.json', 'src/dg/backbone.dg.coffee']
        commitFiles: ['-a'],
        pushTo: 'origin'

  # ### Tasks loading
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-rigger'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-haml'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-docker'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-bowercopy'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # ### Task definition

  grunt.registerTask "release", "Release a new version, push it", (target)->
    target = "patch" unless target
    grunt.task.run "bump-only:#{target}", "build", "bump-commit"

  grunt.registerTask 'test', "Compile and run the tests", ['clean:test', 'coffee:test', 'jasmine:core']
  grunt.registerTask 'doc', "Clean and compile the doc", ['clean:doc', 'docker:doc']
  grunt.registerTask 'demo', "Clean, build and prepare the demo", ['clean:demo', 'bowercopy', 'coffeelint:demo', 'rig:demo', 'sass:demo', 'haml:demo', 'copy:demo']
  grunt.registerTask 'core', "Clean, validate and build the project", ['clean:core', 'coffeelint:core', 'rig:core', 'uglify:core']
  grunt.registerTask 'all', "Run the core, test, demo and doc tasks", ['core', 'test', 'demo', 'doc']
  grunt.registerTask 'default', "Run the core, test and demo tasks", ['core', 'test', 'demo']
