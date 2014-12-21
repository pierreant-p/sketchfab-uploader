module.exports = function(grunt) {

    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: './build',
                version: '0.10.5',
                mac: true,
                macIcns: './assets/icon.icns',
                // win: true,
                // winIco: './assets/icon.ico',
            },
            src: [
                './package.json',
                './index.html',
                './assets/**',
                './node_modules/**',
                './src/**',
                './style/**',
            ]
        },
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.registerTask('default', ['nodewebkit']);

};
