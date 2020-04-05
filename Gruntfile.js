module.exports = function (grunt) {

    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9001,
                    // open a browser
                    open: true,
                    // inject livereload.js into the pages
                    livereload: true
                }
            }
        },
        watch: {
            scripts: {
                files: ['**/*.scss'],
                tasks: ['default'],
                options: {
                    livereload: true
                },
            },
        },
        concat: {
            options: {
                separator: '',
            },
            dist: {
                src: ['css/*.css'],
                dest: 'css/build/style.css'
            },
        },
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    'css/style.css': 'scss/main.scss',
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css/build',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css/build',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'connect', 'watch']);

}