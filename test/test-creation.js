/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('webapi generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('webapi:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'src/my-company.my-web-api.sln',
      'src/my-company.my-web-api.web/my-company.my-web-api.web.csproj',
      'src/my-company.my-web-api.web/Global.asax',
      'src/my-company.my-web-api.web/Global.asax.cs',
      'src/my-company.my-web-api.web/Web.config',
      'src/my-company.my-web-api.web/Web.Debug.config',
      'src/my-company.my-web-api.web/Web.Release.config',
      'src/my-company.my-web-api.web/Properties/AssemblyInfo.cs',
      'src/my-company.my-web-api.web/Controllers/ValuesController.cs',
      'src/my-company.my-web-api.web/packages.config',
      'package.json',
      'bower.json',
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'someOption': true
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
