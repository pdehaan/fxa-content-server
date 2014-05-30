/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',
    underscore: '../bower_components/underscore/underscore',
    fxaClient: '../bower_components/fxa-js-client/fxa-client',
    text: '../bower_components/requirejs-text/text',
    mustache: '../bower_components/mustache/mustache',
    stache: '../bower_components/requirejs-mustache/stache',
    'p-promise': '../bower_components/p/p',
    selectize: '../bower_components/selectize/dist/js/standalone/selectize',
    speedTrap: '../bower_components/speed-trap/dist/speed-trap'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    selectize: {
      deps: [
        'jquery'
      ],
      exports: '$.selectize'
    }
  },
  stache: {
    extension: '.mustache'
  }
});

require([
  './lib/app-start'
],
function (AppStart) {
  var appStart = new AppStart();
  appStart.startApp();
});
