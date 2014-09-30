module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		config: {
			assets: "app/assets",
			dist: "dist",
			app: "app"
		},
		bower: {
	    target: {
	      rjsConfig: "<%= config.assets %>/js/rjs-config.js"
	    }
	  },
	  clean: ["<%= config.dist %>/"],
		"compile-handlebars": {
			dist: {
	      template: "<%= config.assets %>/templates/index.hbs",
	      templateData: "<%= config.assets %>/templates/context.json",
	      // production version
	      postHTML: '<script src="assets/js/reac.TOR.min.js"></script></body></html>',
	      output: '<%= config.dist %>/index.html'
	    },
	    dev: {
	      template: "<%= config.assets %>/templates/index.hbs",
	      templateData: "<%= config.assets %>/templates/context.json",
	      // dev version
	      postHTML: '		<script data-main="assets/js/rjs-config.js" src="assets/components/requirejs/require.js"></script></body></html>',
	      output: '<%= config.app %>/index.html'
	    }
	  },
		autoprefixer: {
			options: {
				browsers: ["> 1%", "last 3 versions", "Firefox ESR", "Opera 12.1", "ie 9"]
			},
			build: {
				expand: true,
				cwd: "<%= config.assets %>",
				src: [
					"css/*.css"
				],
				dest: "<%= config.assets %>"
			}
		},
		cssmin: {
			dev: {
				files: {
					"<%= config.assets %>/css/style.css": ["<%= config.assets %>/css/*.css"]
				}
			},
			main: {
				files: {
					"<%= config.dist %>/assets/css/style.css": ["<%= config.assets %>/css/*.css"]
				}
			}
		},
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},
			main: {		// Keeping a pre-sourced index.html file in the templates folder for minified scripts until better alternative is found
				files: {
					"<%= config.dist %>/index.html": "<%= config.assets %>/templates/index.html"
				}
			}
		},
		copy: {
			all: {
				files: [{
					expand: true,
					cwd: "<%= config.assets %>/",
					dest: "<%= config.dist %>/assets",
					src: [
						"img/**/*.{png,jpg,gif,ico}",
						"fonts/*",
						"js/config.json"
					]
				}]
			},
			// css: {
			// 	files: [
		 //      {
		 //      	src: "<%= config.assets %>/components/fontawesome/css/font-awesome.min.css", dest: "<%= config.assets %>/css/imports/_font-awesome.scss"
		 //      },
		 //      {
		 //      	src: "<%= config.assets %>/components/leaflet/dist/leaflet.css", dest: "<%= config.assets %>/css/imports/_leaflet.scss"
		 //      },
		 //      {
		 //      	src: "<%= config.assets %>/components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css", dest: "<%= config.assets %>/css/imports/_leaflet-awesome-markers.scss"
		 //      },
		 //      {
		 //      	src: "<%= config.assets %>/components/jQuery.mmenu/src/css/jquery.mmenu.all.css", dest: "<%= config.assets %>/css/imports/_jquery-mmenu.scss"
		 //      }
			// 	]
			// },
			fonts: {
				files: [{
					expand: true,
					flatten: true,
					cwd: "<%= config.assets %>/components",
					dest: "<%= config.assets %>/fonts",
					src: [
						"**/fonts/**/*.{eot,svg,ttf,woff,otf}"
					]
				}]
			}
		},
		concat: {
			options: {
				separator: ";"
			},
			dist: {
				src: ["<%= config.assets %>/**/*.js"],
				dest: "<%= config.dist %>/<%= pkg.name %>.js"
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "<%= config.assets %>/js",
					mainConfigFile: "<%= config.assets %>/js/rjs-config.js",
					out: "<%= config.assets %>/<%= pkg.name %>.min.js",
					name: "rjs-config",
					paths: {
						"almond": "../components/almond/almond"
					},
					include: ["almond"]
				}
			}
		},
		imagemin: {
			all: {
				files: [{
					expand: true,
					cwd: "<%= config.assets %>/",
					src: [
						"img/*.{png,jpg,gif}"
					],
					dest: "<%= config.dist %>/"
				}]
			}
		},
		sass: {
	    dev: {
	      files: [{
	        expand: true,
	        cwd: "<%= config.assets %>/css",
	        src: ["*.scss"],
	        dest: "<%= config.assets %>/css",
	        ext: '.css'
	      }]
	    }
	  },
		watch: {
			handlebars: {
		    files: '<%= config.assets %>/templates/index.hbs',
		    tasks: ['compile-handlebars:dev', 'vulcanize:dev'],
		    options: {
		      event: ['changed']
		    }
			},
			sass: {
		    files: '<%= config.assets %>/css/**/*.scss',
		    tasks: ['sass:dev', 'autoprefixer:build', 'cssmin:dev'],
		    options: {
		      event: ['changed']
		    }
		  }
		},
		concurrent: {
		  options: {
		    logConcurrentOutput: true
		  },
		  dev: {
		    tasks: ["watch:handlebars", "watch:sass"]
		  }
		},
		vulcanize: {
	    dev: {
	      options: {},
	      files: {
	        "<%= config.app %>/build.html": "<%= config.app %>/index.html"
	      },
	    },
	  }
	});
	// Require the needed plugin
	// grunt.loadNpmTasks("grunt-contrib-handlebars");
	grunt.loadNpmTasks("grunt-compile-handlebars");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-bower-requirejs");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks('grunt-vulcanize');

	// Build task
	grunt.registerTask("build", ["clean", "compile-handlebars:dist", "autoprefixer", "cssmin:main", "copy", "requirejs"]);
	grunt.registerTask("bower", ["bower"]);
	grunt.registerTask("dev", ["copy:fonts", "concurrent:dev"]);
};
