// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, ui, util, api, config, DOMPurify, $*/
'use strict';

$(async function () {
  const skip = (util.getCurrentPageNumber() - 1) * 4;
  const products = await api.getProducts({skip, limit: config.itemsPerPage});
  products.forEach(product => {
    const productHtml = templates.product
      .replace(/#NAME#/gi, DOMPurify.sanitize(product.name))
      .replace(
        /#PRICE#/gi,
        new Intl.NumberFormat('en-US', {
          maximumSignificantDigits: 3,
        }).format(DOMPurify.sanitize(product.price)),
      )
      .replace(/#UNFORMATTED-PRICE#/g, DOMPurify.sanitize(product.price))
      .replace(/#IMAGE#/gi, DOMPurify.sanitize(product.image))
      .replace(/#DESCRIPTION#/gi, DOMPurify.sanitize(product.description))
      .replace(/#DETAILS#/gi, DOMPurify.sanitize(product.details))
      .replace(/#ID#/gi, DOMPurify.sanitize(product.productId));
    $('#products').append(productHtml);
  });
  if (util.isAdmin() || util.isSupport()) {
    $('.add-to-cart').addClass('disabled');
  }
  $('#products').append(templates.addToCart);
  ui.addPagination();
});
