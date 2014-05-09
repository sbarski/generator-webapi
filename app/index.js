'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
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

        if(this.nuget){
          this.spawnCommand('tools\\nuget\\nuget.exe', ['install', 'src\\' + this.safeprojectname + '.web\\packages.config', '-OutputDirectory', 'src\\packages']);
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
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: 'mywebapi'
    },
    {
      type: 'confirm',
      name: 'nuget',
      message: 'Install and run nuget?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.namespace = props.namespace ? props.namespace : 'my company';
      this.name = props.name ? props.name : 'my web api';
      this.nuget = props.nuget;

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
  },

  nuget: function(){
    if (this.nuget){
      var cb = this.async();

      this.mkdir('tools/nuget');
      this.fetch('http://nuget.org/nuget.exe', 'tools/nuget', cb);
    }
      
    this.mkdir('src/packages');
    this.copy('src/web/packages.config', this.path + '.web/packages.config');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = WebapiGenerator;