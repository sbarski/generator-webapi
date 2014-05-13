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

  it('creates basic expected files', function (done) {
    var expected = [
      'src/my-namespace.my-webapi.sln',
      'src/my-namespace.my-webapi.web/my-namespace.my-webapi.web.csproj',
      'src/my-namespace.my-webapi.web/Global.asax',
      'src/my-namespace.my-webapi.web/Global.asax.cs',
      'src/my-namespace.my-webapi.web/Web.config',
      'src/my-namespace.my-webapi.web/Web.Debug.config',
      'src/my-namespace.my-webapi.web/Web.Staging.config',
      'src/my-namespace.my-webapi.web/Web.Production.config',
      'src/my-namespace.my-webapi.web/Properties/AssemblyInfo.cs',
      'src/my-namespace.my-webapi.web/Controllers/ValuesController.cs',
      'src/my-namespace.my-webapi.web/packages.config',
      'package.json',
      'bower.json',
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'namespace': 'my-namespace',
      'name' : 'my-webapi',
      'nuget' : false
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('adds database, test and core projects', function (done) {
    var expected = [
      'src/my-namespace.my-webapi/my-namespace.my-webapi.csproj',                  
      'src/my-namespace.my-webapi/Properties/AssemblyInfo.cs',                 
      'src/my-namespace.my-webapi/Services/ISampleReadService.cs',             
      'src/my-namespace.my-webapi/Services/SampleReadService.cs',              
      'src/my-namespace.my-webapi.database/my-namespace.my-webapi.database.csproj',
      'src/my-namespace.my-webapi.database/Properties/AssemblyInfo.cs',        
      'src/my-namespace.my-webapi.tests/my-namespace.my-webapi.tests.csproj',      
      'src/my-namespace.my-webapi.tests/Properties/AssemblyInfo.cs',   
      'src/my-namespace.my-webapi.sln',
      'src/my-namespace.my-webapi.web/my-namespace.my-webapi.web.csproj',
      'src/my-namespace.my-webapi.web/Global.asax',
      'src/my-namespace.my-webapi.web/Global.asax.cs',
      'src/my-namespace.my-webapi.web/Web.config',
      'src/my-namespace.my-webapi.web/Web.Debug.config',
      'src/my-namespace.my-webapi.web/Web.Staging.config',
      'src/my-namespace.my-webapi.web/Web.Production.config',
      'src/my-namespace.my-webapi.web/Properties/AssemblyInfo.cs',
      'src/my-namespace.my-webapi.web/Controllers/ValuesController.cs',
      'src/my-namespace.my-webapi.web/packages.config',
      'package.json',
      'bower.json',
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'namespace': 'my-namespace',
      'name' : 'my-webapi',
      'nuget' : false,
      'advanced' : true,
      'projects' : ['core', 'database', 'tests'],
      'autofac' : false
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

it('installs autofac support', function (done) {
    var expected = [
      'src/my-namespace.my-webapi.web/App_Start/AutofacConfig.cs' 
    ];

    helpers.mockPrompt(this.app, {
      'namespace': 'my-namespace',
      'name' : 'my-webapi',
      'nuget' : false,
      'advanced' : true,
      'projects' : ['core', 'database'],
      'autofac' : true
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

it('installs tests support', function (done) {
    var expected = [
      'src/my-namespace.my-webapi.tests/packages.config' 
    ];

    helpers.mockPrompt(this.app, {
      'namespace': 'my-namespace',
      'name' : 'my-webapi',
      'nuget' : false,
      'advanced' : true,
      'projects' : ['core', 'database', 'tests'],
      'install_test_packages' : true,
      'autofac' : true
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
