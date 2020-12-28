// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const apiUrl = window.location.origin;
const homePage = apiUrl + '/shoppy.html';
const ordersPage = apiUrl + '/orders.html';
const profilePage = apiUrl + '/profile.html';
const productManagementPage = apiUrl + '/product-management.html';
const productPage = apiUrl + '/product.html';

const itemsPerPage = 4;

const config = {
  apiUrl,
  homePage,
  itemsPerPage,
  productManagementPage,
  productPage,
};
