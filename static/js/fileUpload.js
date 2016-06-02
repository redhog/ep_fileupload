$(function(){  
    var info = {  
      action: '../fileUpload/',
      name: 'uploadfile', 
      onSubmit: function(file, ext){ // On submit we do nothing, it'd be nice to do something but mheh..
      //console.log('Starting...');
      },  
      onComplete: function(file, response){
        // Require the editor..
        var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;

        // result i.e. "/up/c79133b2c8a97533cc397f8d325ce17a.jpg", trimmed whitespace
        var filePath = response.slice(response.indexOf("/up")).trim();
        // "http://example.com/subfolder/p/padID" -> "http://example.com/subfolder"
        var etherpadRoot = document.location.href.slice(0, document.location.href.indexOf("/p/"));
        // "http://example.com/subfolder/up/c79133b2c8a97533cc397f8d325ce17a.jpg"
        var fileUri = etherpadRoot + filePath;

        // Puts the actual URL in the pad..
        padeditor.ace.replaceRange(undefined, undefined, " " + fileUri + " ");
        // Put the caret back into the pad
        padeditor.ace.focus();
      }  
    };

    new AjaxUpload($('#uploadFileSubmit'), info);  
});
