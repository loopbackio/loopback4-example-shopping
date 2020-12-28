// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(async function () {
  const id = util.getUserId();
  if (id) {
    const productManagementHtml = templates.productManagement;
    $('#productManagement').append(productManagementHtml);
  } else {
    alert('User ID missing');
  }
});
