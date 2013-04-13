module.exports = function (grunt)
{
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');

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
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
	grunt.registerTask('debug', ['jshint']);
};