var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');
var brServer = require('bedrock-server');

config.views.vars.minify = true;

// only run application on HTTP port
bedrock.events.on('bedrock-express.ready', function(app) {
  // attach express to regular http
  brServer.servers.http.on('request', app);
  // cancel default behavior of attaching to HTTPS
  return false;
});

// server info
config.server.port = 443;
config.server.httpPort = 80;
config.server.bindAddr = ['lds.json-ld.org'];
config.server.domain = 'lds.json-ld.org';
config.server.host = 'lds.json-ld.org';
config.server.baseUri = 'http://' + config.server.host;

// core configuration
config.core.workers = 1;
config.core.worker.restart = true;

// master process while starting
config.core.starting.groupId = 'adm';
config.core.starting.userId = 'root';

// master and workers after starting
config.core.running.groupId = 'signature';
config.core.running.userId = 'signature';

// location of logs
var _logdir = path.join('/var', 'log', 'signature-demo');

// logging
config.loggers.app.filename = path.join(_logdir, 'app.log');
config.loggers.access.filename = path.join(_logdir, 'access.log');
config.loggers.error.filename = path.join(_logdir, 'error.log');
config.loggers.email.silent = true;
config.loggers.email.to = ['cluster@signature-demo.digitalbazaar.com'];
config.loggers.email.from = 'cluster@dsignature-demo.digitalbazaar.com';
