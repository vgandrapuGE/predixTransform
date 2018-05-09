var auth = require('../helpers/auth');
var proxy = require('../helpers/proxy');
var YAML = require('yamljs');

var manifest = YAML.load('manifest.yml');
var application = manifest.applications[0];

var config = {
    /**
     * --------- ADD YOUR UAA CONFIGURATION HERE ---------
     *
     * This uaa helper object simulates NGINX uaa integration using Grunt allowing secure cloudfoundry service integration in local development without deploying your application to cloudfoundry.
     * Please update the following uaa configuration for your solution
     */
    uaa: {
        clientId: application.env.UAA_CLIENT_ID,
        serverUrl: application.env.UAA_SERVER_URL,
        defaultClientRoute: '/about',
        base64ClientCredential: application.env.UAA_CLIENT_SECRET
    },
    /**
     * --------- ADD YOUR SECURE ROUTES HERE ------------
     *
     * Please update the following object add your secure routes
     *
     * Note: Keep the /api in front of your services here to tell the proxy to add authorization headers.
     */
    proxy: {
        '/api/timeseries-service(.*)': {
            url: application.env.TIMESERIES_URL + '/$1',
            instanceId: application.env.TIMESERIES_INSTANCE_ID
        },
        '/api/backend-service(.*)': {
            url: application.env.WS_URL + '/$1'
        }
    }
};

module.exports = {
    server: {
        options: {
            port: 9002,
            base: '.',
            open: true,
            hostname: 'localhost',
            middleware: function(connect, options) {
                var middlewares = [];

                //add predix services proxy middlewares
                middlewares = middlewares.concat(proxy.init(config.proxy));

                //add predix uaa authentication middlewaress
                middlewares = middlewares.concat(auth.init(config.uaa));

                if (!Array.isArray(options.base)) {
                    options.base = [options.base];
                }

                var directory = options.directory || options.base[options.base.length - 1];
                options.base.forEach(function(base) {
                    // Serve static files.
                    middlewares.push(connect.static(base));
                });

                // Make directory browse-able.
                middlewares.push(connect.directory(directory));

                return middlewares;
            }
        }
    }
};
