$(function(){  
    var info = {  
      action: '/ep/fileUpload/',
      name: 'uploadfile',  
      onSubmit: function(file, ext){
      //console.log('Starting...');
      },  
      onComplete: function(file, response){
        padeditor.ace.replaceRange(undefined, undefined, " " + eval(response).join(" ") + " ");
        padeditor.ace.focus();
      }  
    }

    new AjaxUpload($('#uploadFileSubmit'), info);  
    new AjaxUpload($('#uploadFileSubmit img'), info);  
});