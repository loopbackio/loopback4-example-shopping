/*global templates, util, alert, api, DOMPurify, $*/
'use strict';

$(function() {
  util.isLoggedIn(async function(user) {
    if (user) {
      let ordersTemplate = '';
      const orders = await api.getOrders();

      for (const order of orders) {
        let template = templates.order;
        const d = new Date(order.date);
        const date = d.toString().split(' GMT')[0];
        template = template
                  .replace(/#ID#/gi, DOMPurify.sanitize(order.orderId))
                  .replace(
                    /#TOTAL#/gi,
                    new Intl.NumberFormat('en-US', {
                      maximumSignificantDigits: 3,
                    }).format(DOMPurify.sanitize(order.total))
                  )
                  .replace(/#DATE#/gi, DOMPurify.sanitize(date))
        let products = '';
        for (const [i, product] of order.products.entries()) {
          const price = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(product.price);
          products += `
          <tr>
            <th scope="row">${i + 1}</th>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>$${price}</td>
          </tr>
          `;
        }
        template = template.replace(/#PRODUCTS#/gi, products);

        ordersTemplate += template;
      }

      $('#orders').append(ordersTemplate);
    } else {
      $('#logInModal').modal('show');
    }
  });
});
