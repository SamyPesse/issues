var path = require("path");

var pkg = require("./package.json");

module.exports = function (grunt) {
    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");

    // Load grunt modules
    grunt.loadNpmTasks('grunt-hr-builder');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-http-server');

    // Init GRUNT configuraton
    grunt.initConfig({
        "pkg": pkg,
        "bower-install-simple": {
            options: {
                color:       true,
                production:  false,
                directory:   "src/vendors"
            }
        },
        "hr": {
            app: {
                "source": path.resolve(__dirname, "node_modules/happyrhino"),

                // Base directory for the application
                "base": srcPath,

                // Application name
                "name": "GitHub Issues Manager",

                // Mode debug
                "debug": true,

                // Main entry point for application
                "main": "main",

                // HTML entry point
                'index': grunt.file.read(path.resolve(srcPath, "index.html")),

                // Build output directory
                "build": path.resolve(__dirname, "build"),

                // Static files mappage
                "static": {
                    "fonts": path.resolve(srcPath, "resources", "fonts"),
                    "images": path.resolve(srcPath, "resources", "images"),
                    "fonts/octicons": path.resolve(srcPath, "vendors/octicons/octicons")
                },

                // Stylesheet entry point
                "style": path.resolve(srcPath, "resources/stylesheets/main.less"),

                // Modules paths
                'paths': {
                    "moment": path.resolve(srcPath, "vendors/moment/moment")
                },
                "shim": {},
                'args': {},
                'options': {}
            }
        },
        'http-server': {
            'dev': {
                root: "./build",
                port: 8282,
                host: "127.0.0.1",
                showDir : true,
                autoIndex: true,
                defaultExt: "html",
                runInBackground: false
            }
        }
    });

    // Prepare build
    grunt.registerTask('prepare', [
        'bower-install-simple'
    ]);

    // Build
    grunt.registerTask('build', [
        'hr:app'
    ]);

    // Test
    grunt.registerTask('test', [
        'http-server:dev'
    ]);

    grunt.registerTask('default', [
        'prepare',
        'build',
        'test'
    ]);
};
