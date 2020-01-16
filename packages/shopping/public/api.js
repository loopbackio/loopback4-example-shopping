/*global apiUrl, localStorage, $*/

'use strict';

const api = {
  addToCart(body, successCb, errCb) {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/shoppingCarts/${userId}/items`;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: successCb,
      error: errCb,
    });
  },

  getShoppingCartItems(successCb, errCb) {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    if (userId) {
      const url = apiUrl + '/shoppingCarts/' + userId;
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        success: successCb,
        error: errCb,
      });
    }
  },

  updateCart(items, successCb, errCb) {
    const userId = localStorage.getItem('shoppyUserId');
    const token = localStorage.getItem('shoppyToken');
    const url = apiUrl + `/shoppingCarts/${userId}`;
    const body = {userId, items};
    const data = JSON.stringify(body);
    $.ajax({
      type: 'PUT',
      url: url,
      data,
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: successCb,
      error: errCb,
    });
  },

  signUp(body, successCb, errCb) {
    const url = apiUrl + '/users';
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      success: successCb,
      error: errCb,
    });
  },

  logIn(body, successCb, errCb) {
    const url = apiUrl + '/users/login';
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      success: successCb,
      error: errCb,
    });
  },

  me(successCb, errCb) {
    const url = apiUrl + '/users/me';
    const token = localStorage.getItem('shoppyToken');
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: successCb,
      error: errCb,
    });
  },

  getProducts(options, successCb, errCb) {
    const {skip = 0, limit = 4} = options;
    const url =
      apiUrl + `/products?filter[skip]=${skip}&filter[limit]=${limit}`;
    const token = localStorage.getItem('shoppyToken');
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: successCb,
      error: errCb,
    });
  },

  getProduct(id, successCb, errCb) {
    const url = apiUrl + '/products/' + id;
    const token = localStorage.getItem('shoppyToken');
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: successCb,
      error: errCb,
    });
  },
};
