/*global templates, ui, util, api, config, DOMPurify, $*/
'use strict';

$(function() {
  const skip = (util.getCurrentPageNumber() - 1) * 4;
  api.getProducts({skip, limit: config.itemsPerPage}, function(products) {
    if (products) {
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
      $('#products').append(templates.addToCart);
    }
  });

  ui.addPagination();
});
