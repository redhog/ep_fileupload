/**
 * Copyright 2009 RedHog, Egil Möller <egil.moller@piratpartiet.se>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import("etherpad.utils.*");
import("etherpad.globals.*");
import("etherpad.log");
import("sqlbase.sqlbase");
import("sqlbase.sqlcommon");
import("sqlbase.sqlobj");

jimport("java.io.File",
        "java.io.DataInputStream", 
        "java.io.FileInputStream",
        "java.lang.Byte",
        "java.io.FileReader",
        "java.io.BufferedReader",
        "java.security.MessageDigest",
        "java.lang.Runtime");


/* Normal base64 encoding, except we don't care about adding newlines and we encode padding as - and we use - instead of / */
function base64Encode(stringArray) {
  base64code = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789" + "+-";

  /* Pad array to nearest three byte multiple */
  var padding = (3 - (stringArray.length % 3)) % 3;
  var padded = java.lang.reflect.Array.newInstance(Byte.TYPE, stringArray.length + padding);
  java.lang.System.arraycopy(stringArray, 0, padded, 0, stringArray.length);
  stringArray = padded;

  var encoded = "";
  for (var i = 0; i < stringArray.length; i += 3) {
    var j = (((stringArray[i] & 0xff) << 16) +
	     ((stringArray[i + 1] & 0xff) << 8) + 
	     (stringArray[i + 2] & 0xff));
    encoded = (encoded +
	       base64code.charAt((j >> 18) & 0x3f) +
	       base64code.charAt((j >> 12) & 0x3f) +
	       base64code.charAt((j >> 6) & 0x3f) +
	       base64code.charAt(j & 0x3f));
  }
  /* replace padding with "-" */
  return encoded.substring(0, encoded.length - padding) + "--".substring(0, padding);
}


function makeSymlink(destination, source) {
  return Runtime.getRuntime().exec(['ln', '-s', source.getPath(), destination.getPath()]).waitFor();
}


/* Reads a File and updates a digest with its content */
function updateDigestFromFile(digest, handle) {
  var bytes = java.lang.reflect.Array.newInstance(Byte.TYPE, 512);
  var nbytes = 0;  

  while ((nbytes = handle.read(bytes, 0, 512)) != -1)
    digest.update(bytes, 0, nbytes);

  handle.close(); 
}


/* Stores a org.apache.commons.fileupload.disk.DiskFileItem permanently and returns a filename. */
function storeFile(fileItem) {
  var nameParts = fileItem.name.split('.');
  var extension = nameParts[nameParts.length-1];

  var digest = MessageDigest.getInstance("SHA1");
  updateDigestFromFile(digest, fileItem.getInputStream()); // Used to use getStoreLocation(), but that only works for on-disk-files
  var checksum = base64Encode(digest.digest());

  fileItem.write(File("src/plugins/fileUpload/upload/" + checksum));
  
  makeSymlink(
    File("src/plugins/fileUpload/upload/" + checksum + '.' + extension),
    File(checksum));

  return checksum + '.' + extension;
}
