/**
 * Configure copying tasks into dist version
 */
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: '.',
                src: [
                    'index.html',
                    'bower_components/**/*',
                    'css/**/*',
                    'images/**/*',
                    'js/**/*'
                ],
                dest: 'dist/www/'
            }
        ]
    }
};
