// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(async function () {
  const resetPasswordFinishHtml = templates.resetPasswordFinish;
  $('#resetPasswordFinish').append(resetPasswordFinishHtml);
  $('#passwordResetFinishSuccess').hide();
  $('#passwordResetFinishMismatch').hide();
  $('#passwordResetFinishInvalid').hide();
  $('#passwordResetFinishFailed').hide();
});
