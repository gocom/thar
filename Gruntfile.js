module.exports = function (grunt)
{
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-conventional-changelog');
	grunt.loadNpmTasks('grunt-bumpup');

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		uglify :
		{
			options :
			{
				banner : '/*! <%= pkg.name %> | Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.homepage %> | Released under the MIT License */\n',
				report : "gzip"
			},
			dist :
			{
				files :
				{
					'dist/jquery.thar.min.js': ['jquery.thar.js']
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
						src  : ['dist/jquery.thar.min.js'],
						dest : 'dist/jquery.thar.v<%= pkg.version %>.min.js'
					}
				]
			}
		},

		jshint :
		{
			files : ['Gruntfile.js', 'jquery.thar.js'],
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
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
	grunt.registerTask('changelog', ['changelog']);
	grunt.registerTask('debug', ['jshint']);

	grunt.registerTask('release', function (type)
	{
		type = type ? type : 'patch';
		grunt.task.run('default');
		grunt.task.run('bumpup:' + type);
	});
};