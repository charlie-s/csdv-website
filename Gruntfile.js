"use strict";

var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {

    function titleToFilename(string) {
        var filename = string.toLowerCase();
        filename = filename.replace('"', '');
        filename = filename.replace("'", '');
        filename = filename.replace(/\W+/g, ' ');
        filename = filename.trim();
        filename = filename.replace(/ /g, '-');
        return filename;
    }

    function createPages(datasrc, template) {
        var data = grunt.file.readJSON(datasrc);
        var pageArray = [];

        data.forEach(function(post) {

            var filename = titleToFilename(post.title);

            pageArray.push({
                filename: filename,
                data: post,
                content: grunt.file.read(template)
            });
        });

        return _.flatten(pageArray);
    }

    function createLegacyBlogListing(datasrc, template) {
        var data = grunt.file.readJSON(datasrc);
        var pageArray = [];

        // Generate filenames.
        data.forEach(function(post, i) {
            data[i].filename = titleToFilename(post.title);
        });

        pageArray.push({
            filename: 'index.html',
            data: {posts: data},
            content: grunt.file.read(template)
        });

        return _.flatten(pageArray);
    }

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
            },
            legacy_blog_posts: {
                options: {
                    pages: createPages('source/legacy-blog/data.json', 'source/legacy-blog/post.hbs')
                },
                files: [{
                    dest: 'dist/legacy-blog/',
                    src: '!*'
                }]
            },
            legacy_blog_index: {
                options: {
                    pages: createLegacyBlogListing('source/legacy-blog/data.json', 'source/legacy-blog/index.hbs')
                },
                files: [{
                    dest: 'dist/legacy-blog/',
                    src: '!*'
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
