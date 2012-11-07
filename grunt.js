/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-haml');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-docco');

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

        clean: {
          build: ["dist", "working"],
          demo: ["demo"]
        },

        rig: {
            build: {
                src: ['src/dg/ajadmin.dg.coffee'],
                dest: 'working/ajadmin.dg.coffee'
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
                files: ["src/demo/demo.coffee"]
            }
        },

        coffee: {
            build: {
                options: {
                    bare: true
                },
                files: {
                    'dist/ajadmin/ajadmin.dg.js': ['working/ajadmin.dg.coffee']
                }
            },
            demo: {
                options: {
                    bare: true
                },
                files: {
                    'demo/demo.js': ['src/demo/demo.coffee']
                }
            }
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
                    'dist/ajadmin/ajadmin.dg.js'
                ],
                dest: 'dist/ajadmin/ajadmin.dg.min.js'
            }
        },

        copy: {
            demo: {
                options: {
                    flatten: false
                },
                files: {
                    "demo/js/": ["vendor/javascripts/*.js"],
                    "demo/js/ajadmin.dg.js": ["dist/ajadmin/ajadmin.dg.js"],
                    "demo/images/": ["src/demo/images/*.png"],
                    "demo/bootstrap/": ["src/demo/bootstrap/**"]
                }
            }
        },

        docco: {
            build: {
                src: ["working/ajadmin.dg.coffee"]
            }
        },

        jshint: {
            globals: {
                Backbone: true,
                _: true,
                $: true
            }
        },

        uglify: {}
    });

    grunt.registerTask('default', 'clean coffeelint rig coffee sass haml min copy docco');
};
