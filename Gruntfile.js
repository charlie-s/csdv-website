module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Assemble
         */
        assemble: {
            options: {
                assets: 'dist',
                layout: ['source/layouts/default.hbs']
            },
            index: {
                files: [{
                    expand: true,
                    cwd: 'source/pages/',
                    src: '**/index.hbs',
                    dest: 'dist/'
                }]
            },
            site: {
                files: [{
                    expand: true,
                    cwd: 'source/pages/',
                    src: ['**/*.hbs', '!**/index.hbs' ],
                    dest: 'dist/',
                    ext: '/index.html',
                }]
            }
        },

        /**
         * Minify HTML.
         */
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        }

    });

    // Load plugins.
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Configure command line tasks.
    grunt.registerTask('default', ['assemble', 'htmlmin']);
};
