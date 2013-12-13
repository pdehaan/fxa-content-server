#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var dba = require('dba');
var path = require('path');
var _ = {
  template: require('lodash.template')
};

module.exports = function (grunt) {
  'use strict';

  grunt.config('dba', {
    app: {
      options: {
        effort: 2000,
        ratio: 0
      },
      src: [
        '**/*.js',
        '!node_modules/**',
        '!<%= yeoman.app %>/bower_components/**',
        '!<%= yeoman.app %>/scripts/vendor/**'
      ]
    }
  });

  grunt.registerMultiTask('dba', 'Seriously, just comment your code.', function () {
    var options = this.options() || {};
    options.format = options.format || '- [${file}:${line}] ${name}() -> ${effort}';
    var _tmpl = _.template(options.format);

    var files = this.filesSrc.filter(function (file) {
      // Make sure its actually a file and not a folder named `foo.js`.
      return grunt.file.isFile(file);
    });

    var results = [];

    files.forEach(function (file) {
      var content = grunt.file.read(file, 'utf8');
      var arr;
      try {
        arr = dba(content, options);
        // If we got results from `dba` log the to the results array and set the
        // `success` flag to fail the build.
        if (arr.length > 0) {
          arr = arr.map(function (item) {
            // Remap some data to make it easier to template.
            item.file = path.basename(file);
            item.effort = parseInt(item.effort, 10);
            return item;
          });
          results.push({'file': file, 'messages': arr});
        }
      } catch (err) {
        grunt.verbose.writeln('Unable to parse %s', file);
      }
    });

    if (results.length > 0) {
      results.forEach(function (result) {
        grunt.log.subhead(result.file);
        result.messages.forEach(function (message) {
          grunt.log.writeln(_tmpl(message));
        });
      });
      return false;
    }
  });
};
