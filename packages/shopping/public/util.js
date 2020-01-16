/*global location, localStorage, api*/
'use strict';

function getCurrentPageNumber() {
  const pageNumber = new URL(location.href).searchParams.get('page');
  if (pageNumber) {
    return +pageNumber;
  } else {
    return 1;
  }
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

function isLoggedIn(cb) {
  const token = localStorage.getItem('shoppyToken');
  if (token) {
    api.me(
      function(user) {
        cb(user);
      },
      function(fail) {
        cb(false);
      },
    );
  } else {
    return cb(false);
  }
}

const util = {
  getCurrentPageNumber,
  getProductId,
  isLoggedIn,
  parseYml,
};
