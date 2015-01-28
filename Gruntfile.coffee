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

    # ### Install web dependencies
    bowercopy:
      css:
        options:
          destPrefix: 'demo/css'
        files:
          'bootstrap.css': 'bootstrap/dist/css/bootstrap.css'
          'bootstrap-theme.css': 'bootstrap/dist/css/bootstrap-theme.css'
          'semantic.css': 'semantic-ui/build/packaged/css/semantic.css'
      fonts:
        options:
          destPrefix: 'demo'
        files:
          'fonts': ['bootstrap/dist/fonts', 'semantic-ui/build/packaged/fonts']
      images:
        options:
          destPrefix: 'demo'
        files:
          'images': 'semantic-ui/build/packaged/images'
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
          'semantic.js': 'semantic-ui/build/packaged/javascript/semantic.js'
      test:
        options:
          destPrefix: 'spec/lib'
        files:
          'jasmine-jquery.js': 'jasmine-jquery/lib/jasmine-jquery.js'

    # ### Bump configuration
    bump:
      options:
        files: ['package.json', 'bower.json', 'src/dg/backbone.dg.coffee']
        commitMessage: 'Version bump to %VERSION%'
        commitFiles: ['-a'],
        pushTo: 'origin'

    # ### Clean tasks
    clean:
      core: ['dist']
      demo: ['demo/**']
      doc: ['doc']
      test: ['spec/js']

    # ### Coffee
    coffee:
      test:
        options:
          bare: true
        src: ['spec/coffee/**.coffee']
        dest: 'spec/js/'
        ext: '.spec.js'
        expand: true
        flatten: true

    # ### CoffeeLint tasks
    coffeelint:
      options:
        max_line_length:
          value: 120
      core: ['src/dg/**.coffee']
      demo: ['src/demo/**.coffee']

    # ### Copy tasks
    copy:
      demo:
        files: [
          { dest: 'demo/js', src: 'dist/std/backbone.dg.js', expand: true, flatten: true }
          { dest: 'demo/js', src: 'dist/std/backbone.dg.bootstrap.js', expand: true, flatten: true }
          { dest: 'demo/js', src: 'dist/std/backbone.dg.semantic.js', expand: true, flatten: true }
          { dest: 'demo/images', src: 'src/demo/images/**', expand: true, flatten: true, filter: 'isFile' }
        ]

    # ### Docker tasks
    docker:
      options:
        extra: ['fileSearch', 'goToLine']
        colourScheme: 'friendly'
        lineNums: true
        ignoreHidden: true
      core:
        dest: 'doc/dg'
        src: ['README.md', 'src/dg']
      demo:
        dest: 'doc/demo'
        src: ['src/demo']
        options:
          exclude: '*.styl,src/demo/demo-data.coffee'

    # ### GitHub Pages tasks
    'gh-pages':
      src: ['doc/**', 'demo/**']

    # ### Haml tasks
    haml:
      demo:
        files:
          'demo/bootstrap/index.html': 'src/demo/bootstrap/index.haml'
          'demo/semantic/index.html': 'src/demo/semantic/index.haml'
          'demo/index.html': 'src/demo/index.haml'

    # ### Jasmine tasks
    jasmine:
      test:
        options:
          helpers: 'spec/js/helpers/*.js'
          specs: 'spec/js/**/*.spec.js'
          vendor: [
            'demo/js/json2.js'
            'demo/js/jquery.js'
            'demo/js/underscore.js'
            'demo/js/bootstrap.js'
            'demo/js/backbone.js'
            'demo/js/backbone.marionette.js'
            'dist/std/backbone.dg.js'
            'dist/std/backbone.dg.bootstrap.js'
            'spec/lib/jasmine-jquery.js'
          ]

    # ### Rigger tasks
    rig:
      core:
        options:
            banner: '<%= meta.banner %>'
        files:
          'dist/std/backbone.dg.js': ['src/dg/backbone.dg.coffee']
          'dist/std/backbone.dg.bootstrap.js': ['src/dg/ui/backbone.dg.bootstrap.coffee']
          'dist/std/backbone.dg.semantic.js': ['src/dg/ui/backbone.dg.semantic.coffee']
      demo:
        files:
          'demo/bootstrap/demo.js': ['src/demo/bootstrap/demo.coffee']
          'demo/semantic/demo.js': ['src/demo/semantic/demo.coffee']

    # ### Stylus task
    stylus:
      demo:
        files:
          'demo/bootstrap/demo.css': 'src/demo/bootstrap/demo.styl'
          'demo/semantic/demo.css': 'src/demo/semantic/demo.styl'
          'demo/base.css': 'src/demo/base.styl'

    # ### Uglify tasks
    uglify:
      options:
        banner: '<%= meta.banner %>'
        mangle:
          except: ['Backbone']
      core:
        files:
          'dist/std/backbone.dg.min.js': ['dist/std/backbone.dg.js']
          'dist/std/backbone.dg.bootstrap.min.js': ['dist/std/backbone.dg.bootstrap.js']
          'dist/std/backbone.dg.semantic.min.js': ['dist/std/backbone.dg.semantic.js']

    # ### Watch tasks
    watch:
      core:
        files: 'src/dg/*'
        tasks: ['core', 'demo']
      demo:
        files: 'src/demo/*'
        tasks: 'demo'

  # ### Tasks loading (contrib)
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # ### Tasks loading (others)
  grunt.loadNpmTasks 'grunt-bowercopy'
  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-docker'
  grunt.loadNpmTasks 'grunt-gh-pages'
  grunt.loadNpmTasks 'grunt-haml'
  grunt.loadNpmTasks 'grunt-rigger'

  # ### Task definition
  grunt.registerTask 'version', 'Bump the version', (target)->
    target = 'patch' unless target
    grunt.task.run "bump-only:#{target}"

  grunt.registerTask 'release', 'Push the release', ['core', 'demo', 'doc', 'bump-commit']
  grunt.registerTask 'test', 'Compile and run the tests', ['clean:test', 'bowercopy:test', 'coffee:test', 'jasmine:test']
  grunt.registerTask 'doc', 'Clean and compile the doc', ['clean:doc', 'docker:core', 'docker:demo']
  grunt.registerTask 'demo-bower-copy', 'Copy the bower components to the right place', ['bowercopy:css', 'bowercopy:fonts', 'bowercopy:js', 'bowercopy:images']
  grunt.registerTask 'demo', 'Clean, build and prepare the demo', ['clean:demo', 'demo-bower-copy', 'coffeelint:demo', 'rig:demo', 'stylus:demo', 'haml:demo', 'copy:demo', 'docker:core']
  grunt.registerTask 'core', 'Clean, validate and build the project', ['clean:core', 'coffeelint:core', 'rig:core', 'uglify:core', 'docker:core']
  grunt.registerTask 'all', 'Run the core, test, demo and doc tasks', ['core', 'test', 'demo', 'doc']
  grunt.registerTask 'default', 'Run the core, test and demo tasks', ['core', 'test', 'demo']
