'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');

var exec = require('child_process').execFile;

var generateGuid = function()
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var WebapiGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {

      var isWin = /^win/.test(process.platform);

      if(this.nuget){
        if (isWin){
          this.spawnCommand('tools\\nuget\\nuget.exe', ['install', 'src\\' + this.safeprojectname + '.web\\packages.config', '-OutputDirectory', 'src\\packages']);
        } else {
          console.log('\n\nYou must have mono installed to run nuget...');

          this.spawnCommand('mono', ['tools/nuget/nuget.exe', 'install', 'src/' + this.safeprojectname + '.web/packages.config', '-OutputDirectory', 'src/packages']);
        }
      }

      this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic web api 2.0 for .net'));

    var prompts = [{
      type: 'input',
      name: 'namespace',
      message: 'What is the name of your company or preferred root namespace?',
      default: 'mycompany'
    },{
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: 'mywebapi'
    },{
      type: 'confirm',
      name: 'nuget',
      message: 'Install and run nuget?',
      default: true
    },{
      type: 'confirm',
      name: 'advanced',
      message: 'Would you like to configure advanced options?',
      default: true
    },{
      when: function (response){
        return response.advanced
      },
      type: 'checkbox',
      message: 'Select additional projects to generator (the web project will be included automatically)',
      name: 'projects',
      default: ['core', 'database', 'test'],
      choices: [{
        name: 'core',
        selected: true
      }, {
        name: 'database',
        selected: true
      }, {
        name: 'test',
        selected: true
      }] 
    },{
      when: function(response){
        return response.advanced
      },
      type: 'confirm',
      name: 'autofac',
      message: 'Install and configure autofac for IoC?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.namespace = props.namespace ? props.namespace : 'my company';
      this.name = props.name ? props.name : 'my web api';
      this.nuget = props.nuget;
      this.projects = props.projects;
      this.autofac = props.autofac;

      this.core = this.projects && this.projects.indexOf('core') > -1;
      this.database = this.projects && this.projects.indexOf('database') > -1;
      this.test = this.projects && this.projects.indexOf('test') > -1;

      done();
    }.bind(this));
  },

  defaults: function(){
    this.language = 'c#';
    this.globalclassname = 'WebApiApplication';
    this.asaxentry = '<%@ Application Codebehind';
    this.languageext = 'cs'

    this.safeprojectname = this._.slugify(this.namespace) + '.' + this._.slugify(this.name);

    this.path = 'src/' + this._.slugify(this.namespace) + '.' + this._.slugify(this.name);
    this.nugetpackagesfolder =  '..\\packages\\';

    this.webprojectguid = generateGuid();

    if (this.core) {
      this.coreprojectguid = generateGuid();
    }
  },

  app: function () {
    this.mkdir('src');
    this.mkdir('tools');

    this.template('src/_webapi.sln', this.path + '.sln');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  web: function(){
    this.webassemblyguid = generateGuid();

    var pathToWebFolder = this.path + '.web/';

    this.mkdir(pathToWebFolder);
    this.template('src/web/_webapi.web.csproj', pathToWebFolder + this.safeprojectname + '.web.csproj');

    this.template('src/web/_global.asax', pathToWebFolder + 'Global.asax');
    this.template('src/web/_global.asax.cs', pathToWebFolder + 'Global.asax.cs');

    this.copy('src/web/_web.config', pathToWebFolder + 'Web.config');
    this.copy('src/web/_web.debug.config', pathToWebFolder + 'Web.Debug.config');
    this.copy('src/web/_web.release.config', pathToWebFolder + 'Web.Release.config');

    this.mkdir(pathToWebFolder + '/Properties');
    this.template('src/web/properties/_assemblyinfo.cs', pathToWebFolder + 'Properties/AssemblyInfo.cs');

    this.mkdir(pathToWebFolder + '/Controllers');
    this.template('src/web/controllers/_valuescontroller.cs', pathToWebFolder + 'Controllers/ValuesController.cs');

    this.mkdir(pathToWebFolder + '/App_Start');
    this.mkdir(pathToWebFolder + '/App_Data');

    if (this.autofac) {
      this.template('src/web/app_start/_autofacConfig.cs', pathToWebFolder + 'App_Start/AutofacConfig.cs');
    }
  },

  core: function(){
    if (this.core){
      this.coreassemblyguid = generateGuid();
 
      var pathToCoreFolder = this.path + '/';
 
      this.mkdir(this.path);
      this.copy('src/core/_webapi.core.csproj', pathToCoreFolder + this.safeprojectname + '.csproj');
 
      this.mkdir(pathToCoreFolder + '/Properties');
      this.template('src/core/properties/_assemblyinfo.cs', pathToCoreFolder + 'Properties/AssemblyInfo.cs');
 
      this.mkdir(pathToCoreFolder + '/Configuration');
      this.mkdir(pathToCoreFolder + '/Exceptions');
      this.mkdir(pathToCoreFolder + '/Mappings');
      this.mkdir(pathToCoreFolder + '/Model');
      this.mkdir(pathToCoreFolder + '/Security');
      this.mkdir(pathToCoreFolder + '/Services');
    }
  },

  nuget: function(){
    if (this.nuget){
      var cb = this.async();

      this.mkdir('tools/nuget');
      this.fetch('http://nuget.org/nuget.exe', 'tools/nuget', cb);
    }

    this.mkdir('src/packages');
    this.template('src/web/packages.config', this.path + '.web/packages.config');

    if (this.core){
      this.template('src/core/_packages.config', this.path + '/packages.config');
    }
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = WebapiGenerator;
