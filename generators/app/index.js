'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(
      'Thanks for using generator-notebook to create your own notebook'
    );

  },

  writing: function () {
    this.fs.directory(
      this.templatePath('.'),
      this.destinationPath('.')
    );
  },

  install: function () {
    
  }
});
