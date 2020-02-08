// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global apiUrl, localStorage, $*/

'use strict';

const api = {
  getUser(userId) {
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/users/${userId}`;
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  updateUser(userId, body) {
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/users/${userId}`;
    return $.ajax({
      type: 'PUT',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  getOrders() {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const roles = localStorage.getItem('shoppyRoles').split(',');
    let url;
    if (roles.includes('admin') || roles.includes('support')) {
      url = apiUrl + `/orders`;
    } else {
      url = apiUrl + `/users/${userId}/orders`;
    }
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  makeOrder(body) {
    const userName = localStorage.getItem('shoppyUserName');
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/users/${userId}/orders`;
    body.userId = userId;
    body.userName = userName;
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  addToCart(body) {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/shoppingCarts/${userId}/items`;
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  deleteShoppingCart() {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    if (userId) {
      const url = apiUrl + '/shoppingCarts/' + userId;
      return $.ajax({
        type: 'DELETE',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).promise();
    }
  },

  getShoppingCartItems() {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    if (userId) {
      const url = apiUrl + '/shoppingCarts/' + userId;
      return $.ajax({
        type: 'GET',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).promise();
    }
  },

  updateCart(items) {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/shoppingCarts/${userId}`;
    const body = {userId, items};
    const data = JSON.stringify(body);
    return $.ajax({
      type: 'PUT',
      url: url,
      data,
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  signUp(body) {
    const url = apiUrl + '/users';
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
    }).promise();
  },

  logIn(body) {
    const url = apiUrl + '/users/login';
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
    }).promise();
  },

  me() {
    const url = apiUrl + '/users/me';
    const token = localStorage.getItem('shoppyToken');
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  getProducts(options) {
    const {skip = 0, limit = 4} = options;
    const url =
      apiUrl + `/products?filter[skip]=${skip}&filter[limit]=${limit}`;
    const token = localStorage.getItem('shoppyToken');
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },

  getProduct(id) {
    const url = apiUrl + '/products/' + id;
    const token = localStorage.getItem('shoppyToken');
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise();
  },
};
