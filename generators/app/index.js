'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(
      'Thanks for using generator-notebook to create your own notebook'
    );

  },

  writing: function () {
    this.log('write files');
    this.directory(
      this.templatePath('.'),
      this.destinationPath('.')
    );
  },

  install: function () {
    
  }
});
