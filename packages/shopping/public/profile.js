// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(async function() {
  const id = util.getUserId();
  if (id) {
    try {
      const user = await api.getUser(id);
      const fullName = util.fullName(user);
      const profileHtml = templates.profile
        .replace(/#USER-ID#/gi, user.id)
        .replace(/#NAME#/gi, fullName)
        .replace(/#FIRST-NAME#/gi, DOMPurify.sanitize(user.firstName))
        .replace(/#LAST-NAME#/gi, DOMPurify.sanitize(user.lastName))
        .replace(/#EMAIL#/gi, DOMPurify.sanitize(user.email));
      $('#profile').append(profileHtml);

      user.roles.forEach(role => {
        $('#' + role + '-role').attr('checked', true);
      });

      if (util.isAdmin() || util.isSupport()) {
        $('#profile-roles').show();
      }

      if (util.isSupport()) {
        $('#profile input').attr('disabled', true);
        $('#update-profile div').addClass('disabled');
      }
    } catch (e) {
      if (e.status === 401) {
        $('#profile').append('<center>UNAUTHORIZED</center>');
      } else {
        $('#profile').append('<center>NOT FOUND</center>');
      }
    }
  } else {
    alert('User ID missing');
  }
});
