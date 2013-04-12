module.exports = function (grunt)
{
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		uglify :
		{
			options :
			{
				banner : '/*! <%= pkg.name %> | Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.homepage %> | Released under the MIT License */\n'
			},
			dist :
			{
				files :
				{
					'jquery.thar.min.js': ['jquery.thar.js']
				}
			}
		}
	});

	grunt.registerTask('default', ['uglify']);
};