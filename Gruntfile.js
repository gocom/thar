module.exports = function (grunt)
{
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		pkg  : grunt.file.readJSON('package.json'),
		uglify :
		{
			options :
			{
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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