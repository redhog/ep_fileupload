function fileUploadInit() {
  this.hooks = [];
  this.uploadFileClicked = uploadFileClicked;
  this.submitClicked = submitClicked;
}

function dropdownClicked(name, width, height) {
  var wrapper = $('#' + name + '-wrapper');
  var panel = $('#' + name + '-panel');

  if (wrapper[0].expanded) {
    wrapper.animate({height:'0'});
    wrapper[0].expanded = false;
  } else {
    panel.css('height', height);
    panel.css('width', width);
    wrapper.css('width', width);
    wrapper.animate({height: height});
    wrapper[0].expanded = true;
  }
}

function uploadFileClicked () {
  dropdownClicked('fileUpload', '350px', '70px');
}

function submitClicked() {
  $('#fileUploadForm').ajaxSubmit({
    complete: function (XMLHttpRequest, textStatus) {
      // console.log([textStatus, XMLHttpRequest]);
    }
   
  });
}

/* used on the client side only */
fileUpload = new fileUploadInit();
