/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './demo-component'
], function(angular) {

'use strict';

var module = angular.module('ld-signature-demo', ['bedrock-idp']);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Demo',
      templateUrl: requirejs.toUrl(
        'ld-signature-demo/demo.html')
    });
});

return module.name;

});