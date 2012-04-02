import("etherpad.log");
import("plugins.fileUpload.hooks");
import("plugins.fileUpload.static.js.main");

function fileUploadInit() {
 this.hooks = ['handlePath', 'editBarItemsLeftPad'];
 this.description = 'File upload manager adds a button to pads to upload a file. A URL to the uploaded file is then inserted into the pad.';
 this.client = new main.fileUploadInit();
 this.handlePath = hooks.handlePath;
 this.editBarItemsLeftPad = hooks.editBarItemsLeftPad;
 this.install = install;
 this.uninstall = uninstall;
}

function install() {
 log.info("Installing fileUpload");
}

function uninstall() {
 log.info("Uninstalling fileUpload");
}

