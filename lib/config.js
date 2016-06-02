/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

config.idp.owner = {};
config.idp.owner.sysSlug = "demo-signer";
config.idp.owner.sysPublic = ['*'];
//config['identity-rest'].identities.push(config.idp.owner);

config.idp.publicKey = {
  '@context': "https://w3id.org/security/v1",
  type: 'CryptographicKey',
  owner: 'https://bedrock.dev:18443/i/demo-signer',
  label: 'Signing Key',
  publicKeyPem:
    config['credential-curator'].credentialSigningPublicKey.publicKeyPem
};

config.idp.privateKey = {
  privateKeyPem: config['credential-curator'].credentialSigningPrivateKey
};

config.views.vars['ld-signing-demo'] = {};
config.views.vars['ld-signing-demo'].defaultJsonLD = {
  '@context': ['https://schema.org/', 'https://w3id.org/security/v1'],
  '@type': 'Person',
  name: 'Jane Doe',
  jobTitle: 'Professor',
  telephone: '(425) 123-4567',
  url: 'http://www.janedoe.com'
};

// pseudo bower package
var rootPath = path.join(__dirname, '..');
config.requirejs.bower.packages.push({
  path: path.join(rootPath, 'components'),
  manifest: path.join(rootPath, 'bower.json')
});

// mongodb config
config.mongodb.name = 'ld_signing_demo';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'ld_signing_demo';
config.mongodb.username = 'admin';
config.mongodb.password = 'password';
config.mongodb.adminPrompt = true;

// branding
config.views.brand.name = 'JSON-LD Signature Demo';
config.views.vars.title = config.views.brand.name;
config.views.vars.siteTitle = config.views.brand.name;
config.views.vars.style.brand.alt = config.views.brand.name;

