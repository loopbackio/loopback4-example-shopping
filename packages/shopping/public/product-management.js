// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global templates, util, alert, api, DOMPurify, ui, config $*/
'use strict';

$(async function () {
  const isAdmin = util.isAdmin();
  if (isAdmin) {
    const productManagementHtml = templates.productManagement;

    const skip = (util.getCurrentPageNumber() - 1) * 4;
    const products = await api.getProducts({skip, limit: config.itemsPerPage});
    $('#productManagement').append(productManagementHtml);
    $('#createProductError').hide();
    $('#createProductSuccess').hide();
    products.forEach(product => {
      $('#productsTable').append(`<tr>
                <td>${DOMPurify.sanitize(product.price)}</td>
                <td>${DOMPurify.sanitize(product.name)}</td>
                <td>${DOMPurify.sanitize(product.description)}</td>
                <td>${DOMPurify.sanitize(product.details)}</td>
                <td>
                <div class="btn-group">
                            <button class="btn btn-primary btn-sm"
                                    type="submit" id="editProductButton" 
                                    name="editProductButton">
                                <fa-icon icon="pencil-alt"></fa-icon>
                                <span class="d-none d-md-inline">Edit</span>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${
                              product.productId
                            }')"
                                    type="submit" id="deleteProductButton" 
                                    name="deleteProductButton">
                                <fa-icon icon="times"></fa-icon>
                                <span class="d-none d-md-inline">Delete</span>
                            </button>
                </div>
                </td>
                </tr>`);
    });
    ui.addPagination('productsPagination');
  } else {
    alert('Only administrators can access this page');
  }
});
