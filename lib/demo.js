/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var async = require('async');
var bedrock = require('bedrock');
var brIdentity = require('bedrock-identity');
var brKey = require('bedrock-key');
var config = require('bedrock').config;
var database = require('bedrock-mongodb');
require('bedrock-idp');
require('bedrock-identity-rest');

require('./config');

bedrock.events.on('bedrock-mongodb.ready', function(callback) {
  async.auto({
    drop: function(callback) {
      removeCollections(callback);
    },
    identity: ['drop', function(callback) {
      var identity = config.idp.owner;
      brIdentity.insert(null, identity, function(err, result) {
        config.views.vars['ld-signing-demo'].identity = result.identity;
        callback();
      });
    }],
    keys: ['drop', function(callback) {
      var publicKey = config.idp.publicKey;
      var privateKey = config.idp.privateKey;
      brKey.addPublicKey(null, publicKey, privateKey, function(err, result) {
        config.views.vars['ld-signing-demo'].publicKey = result.publicKey;
        callback();
      });
    }]
  }, function(err) {
    callback(err);
  });
});

function removeCollections(callback) {
  var collectionNames = ['identity', 'publicKey'];
  database.openCollections(collectionNames, function(err) {
    async.each(collectionNames, function(collectionName, callback) {
      database.collections[collectionName].remove({}, callback);
    }, function(err) {
      callback(err);
    });
  });
}

var api = {};
module.exports = api;
