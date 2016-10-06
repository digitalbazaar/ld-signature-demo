/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['jsonld-signatures', 'jsonld', 'forge', 'async'],
  function(jsigs, jsonld, forge, async) {

'use strict';

function register(module) {
  module.component('brSigningDemo', {
    controller: Ctrl,
    templateUrl: requirejs.toUrl('ld-signature-demo/demo-component.html')
  });
}

/* @ngInject */
function Ctrl($anchorScroll, $sce, $scope, config) {
  var self = this;
  self.jsonld = config.data['ld-signing-demo'].defaultJsonLD;
  self.jsonldString = JSON.stringify(self.jsonld, null, 2);
  self.validJson = true;
  self.jsonErrorMessage = null;

  self.signedJsonld = null;
  self.signedJsonldString = null;

  self.signatureLoading = false;
  self.verifyLoading = false;

  var identity = config.data['ld-signing-demo'].identity;

  jsigs = jsigs();
  jsigs.use('async', async);
  jsigs.use('forge', forge);
  jsonld = jsonld();
  jsonld.documentLoader = jsonld.documentLoaders.xhr({
    usePromise: false
  });
  var documentLoader = jsonld.documentLoader;
  jsonld.documentLoader = function(url, callback) {
    if(url in config.data.contextMap) {
      url = config.data.contextMap[url];
    }
    return documentLoader(url, callback);
  };
  jsigs.use('jsonld', jsonld);

  self.signingKey = config.data['ld-signing-demo'].publicKey;
  self.signingKeyString = JSON.stringify(self.signingKey, null, 2);
  self.signingKeyHtml = _markJsonString(self.signingKeyString, [{
    value: '"owner"',
    color: 'rgba(255, 0, 0, 0.13)'
  }, {
    value: '"id"',
    color: 'rgba(255, 214, 0, 0.2)'
  }]);

  // Get public identity
  jsigs.getJsonLd(identity.id, function(err, result) {
    self.identity = result;
    self.identityString = JSON.stringify(self.identity, null, 2);
    self.identityHtml = _markJsonString(self.identityString, [{
      value: self.signingKey.id,
      color: 'rgba(255, 214, 0, 0.2)'
    }]);
    $scope.$apply();
  });

  // Get public key
  jsigs.getJsonLd(self.signingKey.id, function(err, result) {
    self.publicKey = result;
    self.publicKeyString = JSON.stringify(self.publicKey, null, 2);
    self.publicKeyHtml = _markJsonString(self.publicKeyString, [{
      value: '"owner"',
      color: 'rgba(255, 0, 0, 0.13)'
    }]);
    $scope.$apply();
  });

  $scope.$watch(function() {
    return self.jsonldString;
  }, function(newValue) {
    _convertJsonString();
  });

  self.signJson = function() {
    self.signatureLoading = true;
    var opts = {
      privateKeyPem: self.signingKey.privateKey.privateKeyPem,
      creator: self.signingKey.id
    };
    jsigs.sign(self.jsonld, opts, function(err, signed) {
      self.signedJsonld = signed;
      self.signedJsonldString = JSON.stringify(signed, null, 2);
      self.signedJsonldHtml = _markJsonString(self.signedJsonldString, [/* {
        value: '"signature"',
        color: 'rgba(15, 241, 243, 0.28)'
      },*/
        {
          value: '"creator"',
          color: 'rgba(255, 214, 0, 0.2)'
        }]);
      self.signatureLoading = false;
      $scope.$apply();
      $anchorScroll('signed');
    });
  };

  self.verifyJson = function() {
    self.verifyLoading = true;
    jsigs.verify(self.signedJsonld, function(err) {
      if(!err) {
        self.jsonVerified = true;
      }
      self.verifyLoading = false;
      $scope.$apply();
    });
  };

  function _convertJsonString() {
    try {
      self.jsonld = JSON.parse(self.jsonldString);
      self.validJson = true;
    } catch(err) {
      self.jsonErrorMessage = err.message;
      self.validJson = false;
    }
  }

  function _markJsonString(string, fields) {
    var marked = string;
    fields.forEach(function(field) {
      marked = _markField(marked, field);
    });
    // Must be designated as an html source and ng-binded
    // so <mark> tags are shown.
    return $sce.trustAsHtml(marked);
  }

  function _markField(string, field) {
    // the 'm' regex flag treats ^ and & as the beginning and
    // end of each line, letting us replace a line at a time.
    // This will break if there is more than one field
    // with the same name in the document.
    var value = field.value;
    var regexp = new RegExp('^.*' + value + '.*$', 'mg');
    var matched = string.match(regexp);
    matched = '<mark style="background-color: ' + field.color + '">'
      + matched + '</mark>';
    var replaced = string.replace(regexp, matched);
    return replaced;
  }
}

return register;

});
