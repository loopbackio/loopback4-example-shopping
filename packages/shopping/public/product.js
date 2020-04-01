// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(async function () {
  const id = util.getProductId();
  if (id) {
    const product = await api.getProduct(id);
    const productHtml = templates.details
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
      .replace(
        /#DETAILS#/gi,
        util.parseYml(DOMPurify.sanitize(product.details)),
      )
      .replace(/#ID#/gi, DOMPurify.sanitize(product.productId));
    $('#product').append(productHtml);
    if (util.isAdmin() || util.isSupport()) {
      $('.add-to-cart').addClass('disabled');
    } else {
      $('#product').append(templates.addToCart);
    }
  } else {
    alert('Product ID missing');
  }
});
