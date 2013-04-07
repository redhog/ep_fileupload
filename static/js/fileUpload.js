$(function(){  
    var info = {  
      action: '/fileUpload/',
      name: 'uploadfile', 
      onSubmit: function(file, ext){ // On submit we do nothing, it'd be nice to do something but mheh..
      //console.log('Starting...');
      },  
      onComplete: function(file, response){
        var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor; // Require the editor..
        padeditor.ace.replaceRange(undefined, undefined, " " + response.replace(/^\s+|\s+$/g, '') + " "); // Puts the actual URL in the pad..
        padeditor.ace.focus(); // Put the caret back into the pad
      }  
    }

    new AjaxUpload($('#uploadFileSubmit'), info);  
});
