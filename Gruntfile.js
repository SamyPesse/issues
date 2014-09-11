var path = require("path");

var pkg = require("./package.json");

module.exports = function (grunt) {
    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");
    var NW_VERSION = "0.10.3";

    // Load grunt modules
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-hr-builder');
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-image-resize');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

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
        "gh-pages": {
            options: {
                base: './build'
            },
            src: ['**']
        },
        "image_resize": {
            logo128: {
                options: {
                    height: 128,
                    width: 128
                },
                files: {
                    'build/static/images/logo/128.png': 'src/resources/images/logo/1024.png',
                },
            },
            logo32: {
                options: {
                    height: 32,
                    width: 32
                },
                files: {
                    'build/static/images/logo/32.png': 'src/resources/images/logo/1024.png',
                },
            },
            logoIco: {
                options: {
                    height:128,
                    width: 128
                },
                files: {
                    'build/static/images/logo/128.ico': 'src/resources/images/logo/1024.png',
                },
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
                    "moment": path.resolve(srcPath, "vendors/moment/moment"),
                    "marked": path.resolve(srcPath, "vendors/marked/lib/marked")
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
        },
        'clean': {
            build: ['build/'],
            releases: ['appbuilds/releases/']
        },
        'nodewebkit': {
            options: {
                appName: pkg.name,
                appVersion: pkg.version,
                buildDir: './appbuilds/releases',
                cacheDir: './appbuilds/cache',
                platforms: ['win', 'osx', 'linux32', 'linux64'],
                macIcns: "./build/static/images/logo/1024.icns",
                macCredits: "./src/credits.html",
                winIco: "./build/static/images/logo/128.ico",
                version: NW_VERSION,
                zip: false
            },
            src: [
                "./**/*",
                "!./src/**",
                "./src/dirname.js",
                "!./appbuilds/**",
                "!./node_modules/hr.js/**",
                "!./node_modules/grunt-*/**",
                "!./node_modules/grunt/**",
                "!./node_modules/nw-gyp/**"
            ]
        },
    });

    // Build
    grunt.registerTask('build', [
        'clean:build',
        'bower-install-simple',
        'hr:app',
        'image_resize:logo128',
        'image_resize:logo32',
        'image_resize:logoIco'
    ]);

    // Test
    grunt.registerTask('test', [
        'http-server:dev'
    ]);

    // Publish
    grunt.registerTask('publish', [
        'build',
        'gh-pages'
    ]);

    // Build apps
    grunt.registerTask('build-apps', [
        'clean:releases',
        'build',
        'nodewebkit',
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};
