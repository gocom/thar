module.exports = function (grunt)
{
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify :
        {
            options :
            {
                banner : '/*! <%= pkg.name %> v<%= pkg.version %> | Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.homepage %> | Released under the MIT License */\n',
                report : "gzip"
            },
            dist :
            {
                files :
                {
                    'dist/thar.min.js': ['src/*.js']
                }
            }
        },

        copy :
        {
            main :
            {
                files :
                [
                    {
                        src  : ['dist/thar.min.js'],
                        dest : 'dist/thar.v<%= pkg.version %>.min.js'
                    }
                ]
            }
        },

        jshint :
        {
            files : ['Gruntfile.js', 'src/*.js'],
            options :
            {
                globals :
                {
                    jQuery : true
                }
            }
        },

        changelog :
        {
            options :
            {
                dest : 'CHANGELOG.md'
            }
        },

        bumpup :
        {
            files : ['package.json']
        },

        qunit :
        {
            all : ['test/*.html']
        }
    });

    grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
    grunt.registerTask('changelog', ['changelog']);
    grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('release', function (type)
    {
        type = type ? type : 'patch';
        grunt.task.run('default');
        grunt.task.run('bumpup:' + type);
    });
};