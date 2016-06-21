'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(
      'Thanks for using generator-notebook to create your own notebook'
    );


    var prompts = [{
      type: 'list',
      choices: ['node', 'mongo'],
      name: 'env_type',
      message: '选择notebook的运行环境',
      default: 'node'
    },
    {
      type : 'input',
      name : 'mongo_shell_path',
      message : 'mongo shell的可执行程序路径',
      default: 'mongo',
      when : function(props) {
        console.log( props, this.props );

        return props.env_type == 'mongo';
      },
      // validate: function(value) {
      //   try{
      //     var stat = fs.statSync(value);
      //   } catch(e){
      //     return e.message;
      //   }
      //   if( stat.isDirectory() ){
      //     return 'input path is a directory';
      //   }
      //   return true;
      // }
    },
    {
      type : 'input',
      name : 'server_user_name',
      message : '登录名',
      validate : function( value ) {
        if( value.length < 6 || value.length > 12 ){
          return '登录名长度应当在6-12位之间';
        }
        if( value.indexOf(':') != -1 ){
          return '登录名不应当包含 : ';
        }
        return true
      }
    },
    {
      type : 'input',
      name : 'server_user_pass',
      message : '密码',
      validate : function( value ) {
        if( value.length < 6 || value.length > 12 ){
          return '密码长度应当在6-12位之间';
        }
        return true
      }
    }];

    var done = this.async();
    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
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
