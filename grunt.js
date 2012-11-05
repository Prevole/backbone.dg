/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
//    grunt.loadNpmTasks('grunt-jasmine-runner');

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            version: '<%= pkg.version %>',
            banner_main:
                ' * Ajadmin.Dg v<%= meta.version %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Distributed under MIT license\n' +
                ' * <%= pkg.homepage %>\n',
            banner_header: '/*!\n',
            banner_footer: ' */',
//      banner_incl_basics:
//        ' * Includes JSON2\n' +
//        ' * https://github.com/douglascrockford/JSON-js\n' +
//        ' * Includes jQuery\n' +
//        ' * http://jquery.com' +
//        ' * Includes Underscore\n' +
//        ' * http://underscorejs.org\n',
//      banner_incl_backbone:
//        ' * Includes Backbone\n' +
//        ' * http://backbonejs.org\n' +
//        ' * Includes Backbone.Wreqr\n' +
//        ' * https://github.com/marionettejs/backbone.wreqr\n' +
//        ' * Includes Backbone.EventBinder\n' +
//        ' * https://github.com/marionettejs/backbone.eventbinder\n' +
//        ' * Includes Backbone.Marionette\n' +
//        ' * https://github.com/marionettejs/backbone.marionette\n',
            banner:
                '<%= meta.banner_header %>' +
                '<%= meta.banner_main %>' +
                '<%= meta.banner_footer %>'
//      banner_backbone: '<%= meta.banner_header %>' +
//                       '<%= meta.banner_main %>' +
//                       ' *\n' +
//                       '<%= meta.banner_incl_backbone %>' +
//                       '<%= meta.banner_footer %>',
//      banner_world: '<%= meta.banner_header %>' +
//                    '<%= meta.banner_main %>' +
//                    ' *\n' +
//                    '<%= meta.banner_incl_basics %>' +
//                    '<%= meta.banner_incl_backbone %>' +
//                    '<%= meta.banner_footer %>'
        },

//    lint: {
//      files: ['src/tableling.*.js']
//    },

        clean: ["dist", "working", "demo/js"],

        rig: {
            build: {
                src: ['src/ajadmin.dg.coffee'],
                dest: 'working/ajadmin.dg.coffee'
            }
        },

        coffee: {
            build: {
                options: {
                    bare: true
                },
                files: {
                    'dist/ajadmin/ajadmin.dg.js': ['working/ajadmin.dg.coffee'],
                    'demo/js/demo.js': ['demo/coffee/demo.coffee']
                }
            }
        },

        sass: {
            demo: {
                files: {
                    'demo/css/demo.css': 'demo/scss/demo.scss'
                }
            }
        },

//    concat: {
//      backbone : {
//        src : [
//          'vendor/backbone.js',
//          'vendor/backbone.eventbinder.js',
//          'vendor/backbone.wreqr.js',
//          'vendor/backbone.marionette.js',
//          'lib/ajadmin.dg.js'
//        ],
//        dest : 'lib/bundles/ajadmin.dg.js'
//      },
//      world : {
//        src : [
//          'vendor/json2.js',
//          'vendor/jquery.js',
//          'vendor/underscore.js',
//          'vendor/backbone.js',
//          'vendor/backbone.eventbinder.js',
//          'vendor/backbone.wreqr.js',
//          'vendor/backbone.marionette.js',
//          'lib/tableling.js'
//        ],
//        dest : 'lib/bundles/tableling.world.js'
//      }
//    },

        min: {
            standard: {
                src: [
                    '<banner:meta.banner>',
                    'dist/ajadmin/ajadmin.dg.js'
                ],
                dest: 'dist/ajadmin/ajadmin.dg.min.js'
            }
        },

//      world: {
//        src: [
//          '<banner:meta.banner_world>',
//          '<config:concat.world.dest>'
//        ],
//        dest: 'lib/bundles/tableling.world.min.js'
//      },
//      backbone: {
//        src: [
//          '<banner:meta.banner_backbone>',
//          '<config:concat.backbone.dest>'
//        ],
//        dest: 'lib/bundles/tableling.backbone.min.js'
//      }
//    },

        copy: {
            demo: {
                options: {
                    flatten: true
                },
                files: {
                    "demo/js/": ["dist/ajadmin/ajadmin.dg.js", "vendor/javascripts/*.js"]
                }
            }
        },

//    copy : {
//      demo: {
//        files: {
//          'docs/demo/': 'lib/bundles/tableling.world.min.js'
//        }
//      }
//    },

//    jasmine : {
//      src : [
//        'vendor/jquery.js',
//        'vendor/json2.js',
//        'vendor/underscore.js',
//        'vendor/backbone.js',
//        'vendor/backbone.eventbinder.js',
//        'vendor/backbone.wreqr.js',
//        'vendor/backbone.marionette.js',
//        'src/tableling.js',
//        'src/tableling.core.js',
//        'src/tableling.modular.js',
//        'src/tableling.plain.js',
//        'src/tableling.bootstrap.js'
//      ],
//      helpers : 'spec/javascripts/helpers/*.js',
//      specs : 'spec/javascripts/**/*.spec.js'
//    },
//
//    'jasmine-server' : {
//      browser : false
//    },
//
        jshint: {
            globals: {
                Backbone: true,
                _: true,
                $: true
            }
        },

        uglify: {}
    });

  // Default task.
//  grunt.registerTask('default', 'lint rig concat min copy');

    grunt.registerTask('default', 'clean rig coffee sass min copy');
};
