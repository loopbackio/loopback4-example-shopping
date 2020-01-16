/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(function() {
  const id = util.getProductId();
  if (id) {
    api.getProduct(id, function(product) {
      if (product) {
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
        $('#product').append(templates.addToCart);
      }
    });
  } else {
    alert('Product ID missing');
  }
});
