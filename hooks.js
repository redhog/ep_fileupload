var path = require('path');
var express = require('express');
var eejs = require("ep_etherpad-lite/node/eejs");
var controller = require("./controllers/fileUpload");

exports.expressConfigure = function(hook_name, args, cb) {
}

exports.expressServer = function (hook_name, args, cb) {
  args.app.post('/fileUpload', controller.onRequest);
  args.app.get('/up/:filename(*)', function(req, res) { 
    var url = req.params['filename'].replace(/\.\./g, '').split("?")[0];
    var filePath = path.normalize(path.join(__dirname, "upload", url));
    res.sendfile(filePath, { maxAge: exports.maxAge });
  });
}

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_fileupload/templates/fileUploadEditbarButtons.ejs");
  return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_fileupload/templates/fileUploadScripts.ejs");
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_fileupload/templates/fileUploadStyles.ejs");
  return cb();
}
