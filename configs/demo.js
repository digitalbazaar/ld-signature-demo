var config = require('bedrock').config;
var path = require('path');

config.views.vars.minify = true;

// server info
config.server.port = 443;
config.server.bindAddr = ['lds.json-ld.org'];
config.server.domain = 'lds.json-ld.org';
config.server.host = 'lds.json-ld.org';
config.server.baseUri = 'https://' + config.server.host;

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
