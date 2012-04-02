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

import("faststatic");
import("dispatch.{Dispatcher,PrefixMatcher,forward}");

import("etherpad.utils.*");
import("etherpad.collab.server_utils");
import("etherpad.globals.*");
import("etherpad.log");
import("etherpad.pad.padusers");
import("etherpad.pro.pro_utils");
import("etherpad.helpers");
import("etherpad.pro.pro_accounts.getSessionProAccount");
import("sqlbase.sqlbase");
import("sqlbase.sqlcommon");
import("sqlbase.sqlobj");
import("plugins.fileUpload.models");
import("etherpad.pad.padutils");
jimport("org.apache.commons.fileupload");

function onRequest() {  
  var isPro = pro_utils.isProDomainRequest();
  var userId = padusers.getUserId();

  helpers.addClientVars({
    userAgent: request.headers["User-Agent"],
    debugEnabled: request.params.djs,
    clientIp: request.clientAddr,
    colorPalette: COLOR_PALETTE,
    serverTimestamp: +(new Date),
    isProPad: isPro,
    userIsGuest: padusers.isGuest(userId),
    userId: userId
  });

  var isProUser = (isPro && ! padusers.isGuest(userId));

  if (request.isPost) {
    var uploads = [];
    var itemFactory = new fileupload.disk.DiskFileItemFactory();
    var handler = new fileupload.servlet.ServletFileUpload(itemFactory);
    var items = handler.parseRequest(request.underlying).toArray();
    for (var i = 0; i < items.length; i++)
      if (!items[i].isFormField()) {
        uploads.push(request.scheme + '://' + request.host + '/up/' + models.storeFile(items[i]));
    }

    response.setContentType("text/html");
    response.write(renderTemplateAsString(
        "fileUploaded.ejs",
        {
          uploads: uploads,
	  isPro: isPro,
	  isProAccountHolder: isProUser,
	  account: getSessionProAccount() // may be falsy
        },
       ['fileUpload']));
    if (request.acceptsGzip) {
      response.setGzip(true);
    }
  } else {
    renderHtml(
      "fileUpload.ejs",
      {
        isPro: isPro,
        isProAccountHolder: isProUser,
        account: getSessionProAccount() // may be falsy
      },
      ['fileUpload']);
  }
  return true;
}
