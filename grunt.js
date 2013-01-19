/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-haml');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-docker');
    grunt.loadNpmTasks('grunt-jasmine-runner');

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            version: '<%= pkg.version %>',
            banner_main:
                ' * Backbone.Dg v<%= meta.version %>\n' +
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

        clean: {
          build: ["dist", "working"],
          demo: ["demo"]
        },

        rig: {
            build: {
                src: ['src/dg/backbone.dg.coffee'],
                dest: 'working/backbone.dg.coffee'
            },
            demo: {
                src: ['src/demo/demo.coffee'],
                dest: 'working/demo.coffee'
            }
        },

        coffeelint: {
            build: {
                files: ["src/dg/*.coffee"],
                options: {
                    max_line_length: {
                        value: 120
                    }
                }
            },
            demo: {
                files: ["src/demo/*.coffee"],
                options: {
                    max_line_length: {
                        value: 120
                    }
                }
            }
        },

        coffee: {
            build: {
                options: {
                    bare: true
                },
                files: {
                    'dist/std/backbone.dg.js': ['working/backbone.dg.coffee']
                }
            },
            demo: {
                options: {
                    bare: true
                },
                files: {
                    'demo/demo.js': ['working/demo.coffee']
                }
            },
            specs: {
                options: {
                    bare: true
                },
                files: {
                    'spec/javascripts/**.js': ['spec/coffeescripts/**.coffee']
                }
            }
        },

        jasmine : {
            src : [
                'vendor/javascripts/json2.js',
                'vendor/javascripts/jquery.js',
                'vendor/javascripts/underscore.js',
                'vendor/javascripts/backbone.js',
                'vendor/javascripts/backbone.babysitter.js',
                'vendor/javascripts/backbone.eventbinder.js',
                'vendor/javascripts/backbone.wreqr.js',
                'vendor/javascripts/backbone.marionette.js',
                'dist/std/backbone.dg.js'
            ],
            helpers : 'spec/javascripts/helpers/*.js',
            specs : 'spec/javascripts/**/*.spec.js'
        },

        'jasmine-server' : {
            browser : false
        },

        sass: {
            demo: {
                files: {
                    'demo/demo.css': 'src/demo/demo.scss'
                }
            }
        },

        haml: {
            demo: {
                src: "src/demo/demo.haml",
                dest: "demo/demo.html"
            }
        },

        min: {
            build: {
                src: [
                    '<banner:meta.banner>',
                    'dist/std/backbone.dg.js'
                ],
                dest: 'dist/std/backbone.dg.min.js'
            }
        },

        copy: {
            demo: {
                options: {
                    flatten: false
                },
                files: {
                    "demo/js/": ["vendor/javascripts/*.js"],
                    "demo/js/backbone.dg.js": ["dist/std/backbone.dg.js"],
                    "demo/images/": ["src/demo/images/*.png"],
                    "demo/bootstrap/": ["src/demo/bootstrap/**"]
                }
            }
        },

        docker: {
            build: {
                src: ["working/*.coffee"],
                options: {
                    extras: ["fileSearch", "goToLine"],
                    colourScheme: "friendly",
                    lineNums: true
                }
            }
        },

        jshint: {
            globals: {
                Backbone: true,
                _: true,
                $: true
            }
        },

        uglify: {},

        globals: {
            jasmine : false,
            describe : false,
            beforeEach : false,
            expect : false,
            it : false,
            spyOn : false
        }
    });

    grunt.registerTask('default', 'clean coffeelint rig coffee jasmine sass haml min copy docker');
};
