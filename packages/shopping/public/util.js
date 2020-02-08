// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global location, localStorage, DOMPurify, api*/
'use strict';

function getCurrentPageNumber() {
  const pageNumber = new URL(location.href).searchParams.get('page');
  if (pageNumber) {
    return +pageNumber;
  } else {
    return 1;
  }
}

function getUserId() {
  return new URL(location.href).searchParams.get('id');
}

function getProductId() {
  return new URL(location.href).searchParams.get('id');
}

// Very very simple YML "parser"
function parseYml(string) {
  let parsed = '';
  let ul = false;
  string.split(/\n/g).forEach(para => {
    if (para.startsWith('-')) {
      parsed += '<ul>';
      para.split('-').forEach(li => {
        if (li) {
          parsed += '<li>' + li + '</li>';
        }
      });
      ul = true;
    } else if (ul) {
      parsed += '</ul>';
      parsed += '<p>' + para + '</p>';
      ul = false;
    } else {
      parsed += '<p>' + para + '</p>';
    }
  });
  return parsed;
}

async function isLoggedIn() {
  const token = localStorage.getItem('shoppyToken');
  if (token) {
    try {
      const user = await api.me();
      return user;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

function isAdmin() {
  const roles = localStorage.getItem('shoppyRoles');
  if (!roles) return false;
  return roles.split(',').includes('admin');
}

function isSupport() {
  const roles = localStorage.getItem('shoppyRoles');
  if (!roles) return false;
  return roles.split(',').includes('support');
}

function fullName(user) {
  if (!user) return '';
  return DOMPurify.sanitize(
    (user.firstName || '') + ' ' + (user.lastName || ''),
  );
}

const util = {
  getCurrentPageNumber,
  getProductId,
  isLoggedIn,
  parseYml,
  isAdmin,
  isSupport,
  getUserId,
  fullName,
};
