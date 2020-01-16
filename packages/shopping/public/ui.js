/*global apiUrl, localStorage, api, ui, location, config, document, templates, util, alert, DOMPurify, $*/
'use strict';

function addPagination() {
  $.get(apiUrl + '/products/count', function(result) {
    const totalPages = Math.ceil(result.count / config.itemsPerPage);
    const currentPageNumber = util.getCurrentPageNumber();

    let pages = '';
    for (let i = 0; i < totalPages; i++) {
      const pageNumber = i + 1;
      if (currentPageNumber === pageNumber) {
        pages += `<li class="page-item"><a class="page-link">${pageNumber}</a></li>`;
      } else {
        pages += `<li class="page-item"><a class="page-link" href="${config.homePage}?page=${pageNumber}">${pageNumber}</a></li>`;
      }
    }
    $('#pagination').append(pages);
  });
}

function refreshLogInStatus() {
  util.isLoggedIn(function(user) {
    if (user) {
      localStorage.setItem('shoppyUserName', user.name);
      localStorage.setItem('shoppyUserId', user.id);
      applyLoggedInUi(user);
      updateCartDetails();
    } else {
      localStorage.removeItem('shoppyToken');
      localStorage.removeItem('shoppyUserId');
      localStorage.removeItem('shoppyUserName');
      applyLoggedOutUi();
    }
  });
}

function updateCartDetails() {
  api.getShoppingCartItems(
    function(result) {
      const itemsCount = result.items.length;
      if (itemsCount) {
        $('#itemsInCart')
          .text(itemsCount)
          .show();
        result.items.forEach(item => {
          $('#card-' + item.productId + ' .cart-action-button').text(
            'Update Cart',
          );
          $('#details-' + item.productId + ' .btn-primary').text('Update Cart');
        });
        $('#shoppingCartLink').show();
      }
    },
    function(err) {
      console.log(err);
    },
  );
}

function applyLoggedInUi(user) {
  $('#logIn, #signUp').hide();
  $('#user strong').text(user.name);
  $('#user, #logOut').show();
}

function applyLoggedOutUi() {
  $('#logIn, #signUp').show();
  $('#user, #logOut, #shoppingCartLink').hide();
  $('#itemsInCart').hide();
  $('.cart-action-button').text('Add to Cart');
}

function logOut() {
  localStorage.removeItem('shoppyToken');
  localStorage.removeItem('shoppyUserId');
  localStorage.removeItem('shoppyUserName');
  refreshLogInStatus();
}

function logIn() {
  const email = $('#logInEmail').val();
  const password = $('#logInPassword').val();
  api.logIn(
    {email, password},
    function(res) {
      const token = res.token;
      localStorage.setItem('shoppyToken', token);
      refreshLogInStatus();
      $('#logInModal').modal('hide');
    },
    function(xhr) {
      $('#logInTitle').text('Invalid credentials');
    },
  );
  return false;
}

function signUp() {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#signUpEmail').val();
  const password = $('#signUpPassword').val();
  api.signUp(
    {firstName, lastName, email, password},
    function(res) {
      api.logIn(
        {email, password},
        function(loginRes) {
          $('#signUpModal').modal('hide');
          const token = loginRes.token;
          localStorage.setItem('shoppyToken', token);
          refreshLogInStatus();
        },
        function(err) {
          alert(err);
        },
      );
    },
    function(xhr) {
      $('#signUpTitle').text(xhr.responseJSON.error.message);
    },
  );
  return false;
}

function addToCart(id, name, price, unformattedPrice, image) {
  util.isLoggedIn(function(user) {
    if (user) {
      // User has a shopping cart already
      api.getShoppingCartItems(
        function(cart) {
          const items = cart.items;
          let product;

          for (const item of items) {
            if (id === item.productId) {
              product = item;
              break;
            }
          }

          $('#addToCart').hide();
          updateAddToCartUi(id, name, price, unformattedPrice, image);

          // Product already added to cart
          if (product) {
            $('#itemQuantity').val(product.quantity);
            updatePrice(product.quantity);
            $('#removeFromCart').removeClass('disabled');
          } else {
            $('#addToCart').show();
          }
          // No shopping cart yet
        },
        function() {
          $('#addToCart').show();
          updateAddToCartUi(id, name, price, unformattedPrice, image);
          $('#addToCartModal').modal('show');
        },
      );
    } else {
      $('#logInModal').modal('show');
    }
  });
}

function updateAddToCartUi(id, name, price, unformattedPrice, image) {
  $('#productImage').attr('src', image);
  $('#productId').val(id);
  $('#productName').text(name);
  $('#productPrice').text(price);
  $('#unformattedPrice').val(unformattedPrice);
  $('#itemQuantity').val(1);
  document.querySelector('#itemQuantity').dataset.id = id;
  document.querySelector('#removeFromCart').dataset.id = id;
  $('#addToCartModal').modal('show');
  $('#removeFromCart').addClass('disabled');
}

function addToCartApi() {
  const productId = $('#productId').val();
  const quantity = +$('#itemQuantity').val();
  api.addToCart(
    {productId, quantity},
    function() {
      updateCartDetails();
      $('#addToCartModal').modal('hide');
    },
    function(err) {},
  );
}

function displayShoppingCart() {
  util.isLoggedIn(function(user) {
    if (user) {
      api.getShoppingCartItems(function(cart) {
        const items = cart.items;
        $('#shoppingCart .list-group').empty();
        items.forEach(item => {
          api.getProduct(item.productId, function(product) {
            const productElement = templates.itemInCart
              .replace(/#ID#/g, DOMPurify.sanitize(product.productId))
              .replace(/#IMAGE#/g, DOMPurify.sanitize(product.image))
              .replace(/#NAME#/g, DOMPurify.sanitize(product.name))
              .replace(/#PRICE#/g, DOMPurify.sanitize(product.price));
            $('#shoppingCart .list-group').append(productElement);
            $('#list-' + product.productId + ' select').val(
              DOMPurify.sanitize(item.quantity),
            );
          });
        });
        $('#shoppingCart').modal('show');
      });
    } else {
      $('#logInModal').modal('show');
    }
  });
}

function updateCount(productId, quantity) {
  api.getShoppingCartItems(function(result) {
    result.items.forEach(item => {
      if (item.productId === productId) {
        item.quantity = +quantity;
      }
    });
    api.updateCart(result.items, function() {
      updatePrice(quantity);
    });
  });
}

function updatePrice(quantity) {
  const unitPrice = $('#unformattedPrice').val();
  const total = unitPrice * quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
  }).format(total);
  $('#productPrice').text(formattedPrice);
}

function removeFromCart(items) {
  if ($('#removeFromCart').hasClass('disabled')) return;

  if (!Array.isArray(items)) items = [items];
  const updatedItems = [];
  api.getShoppingCartItems(function(result) {
    result.items.forEach(item => {
      if (!items.includes(item.productId)) {
        updatedItems.push(item);
      }
    });
    api.updateCart(updatedItems, function() {
      items.forEach(productId => {
        $('#addToCartModal').modal('hide');
        $('#card-' + productId + ' .cart-action-button').text('Add to Cart');
        $('#details-' + productId + ' .btn-primary').text('Confirm');
      });
      updateCartDetails();
    });
  });
}

function removeItems() {
  const items = [];
  const selected = $('#shoppingCart input[type=checkbox]:checked');
  selected.each((i, checkbox) => {
    const id = checkbox.dataset.id;
    items.push(id);
    $('#list-' + id).remove();
  });
  removeFromCart(items);
}

const ui = {
  addPagination,
  refreshLogInStatus,
  updateCartDetails,
  logOut,
  logIn,
  signUp,
  addToCart,
  updateAddToCartUi,
  addToCartApi,
  displayShoppingCart,
  updateCount,
  updatePrice,
  removeFromCart,
  removeItems,
};

// Render the initial UI
$(function() {
  $('#navBar').append(templates.navBar);
  $('body').append(templates.shoppingCart);
  refreshLogInStatus();
  updateCartDetails();
});
