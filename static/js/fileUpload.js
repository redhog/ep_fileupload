$(function(){  
    var info = {  
      action: '/fileUpload/',
      name: 'uploadfile',  
      onSubmit: function(file, ext){
      //console.log('Starting...');
      },  
      onComplete: function(file, response){
        var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
        padeditor.ace.replaceRange(undefined, undefined, " " + response.replace(/^\s+|\s+$/g, '') + " ");
        padeditor.ace.focus();
      }  
    }

    new AjaxUpload($('#uploadFileSubmit'), info);  
});