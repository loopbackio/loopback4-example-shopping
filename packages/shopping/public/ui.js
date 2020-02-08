// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global apiUrl, localStorage, api, ui, location, config, document, templates, util, alert, DOMPurify, profilePage, ordersPage, homePage, $*/
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

async function refreshLogInStatus() {
  const user = await util.isLoggedIn();
  if (user) {
    localStorage.setItem('shoppyUserName', user.name);
    localStorage.setItem('shoppyUserId', user.id);
    localStorage.setItem('shoppyRoles', user.roles);
    applyLoggedInUi(user);
    await updateCartDetails();
  } else {
    localStorage.removeItem('shoppyToken');
    localStorage.removeItem('shoppyUserId');
    localStorage.removeItem('shoppyUserName');
    localStorage.removeItem('shoppyRoles');
    applyLoggedOutUi();
  }
}

async function updateCartDetails() {
  try {
    const result = await api.getShoppingCartItems();
    if (result) {
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
      } else {
        $('#shoppingCartLink').hide();
      }
    }
  } catch (e) {
    $('#itemsInCart').hide();
    $('#shoppingCartLink').hide();
  }
}

function applyLoggedInUi(user) {
  const fullName = util.fullName(user);
  $('#logIn, #signUp').hide();
  $('#user strong').text(fullName);
  $('#user, #logOut').show();
  if (util.isAdmin() || util.isSupport()) {
    $('.add-to-cart').addClass('disabled');
  }
}

function applyLoggedOutUi() {
  $('#logIn, #signUp').show();
  $('#user, #logOut, #shoppingCartLink, #ordersLink').hide();
  $('#itemsInCart').hide();
  $('.cart-action-button').text('Add to Cart');
  $('.add-to-cart').removeClass('disabled');
  if (
    document.location.href === ordersPage ||
    document.location.href.startsWith(profilePage)
  ) {
    document.location = homePage;
  }
}

async function logOut() {
  localStorage.removeItem('shoppyToken');
  localStorage.removeItem('shoppyUserId');
  localStorage.removeItem('shoppyUserName');
  localStorage.removeItem('shoppyRoles');
  await refreshLogInStatus();
}

async function logIn(email, password) {
  email = email || $('#logInEmail').val();
  password = password || $('#logInPassword').val();
  const res = await api.logIn({email, password}).catch(e => {
    $('#logInTitle').text('Invalid credentials');
  });
  if (res) {
    const token = res.token;
    localStorage.setItem('shoppyToken', token);
    await refreshLogInStatus();
    $('#logInModal').modal('hide');
    $('#signUpModal').modal('hide');
  } else {
    $('#logInTitle').text('Invalid credentials');
  }
}

async function signUp() {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#signUpEmail').val();
  const password = $('#signUpPassword').val();
  const res = await api.signUp({firstName, lastName, email, password});
  if (res) {
    await logIn(email, password);
  } else {
    $('#signUpTitle').text('Failed to sign up');
  }
}

async function addToCart({id, name, price, unformattedPrice, image}) {
  const user = await util.isLoggedIn();
  if (user) {
    try {
      // User has a shopping cart already
      const cart = await api.getShoppingCartItems();
      const items = cart.items;
      let product;

      for (const item of items) {
        if (id === item.productId) {
          product = item;
          break;
        }
      }

      $('#confirmAddToCartButton').hide();
      updateAddToCartUi({id, name, price, unformattedPrice, image});

      // Product already added to cart
      if (product) {
        $('#itemQuantity').val(product.quantity);
        updatePrice(product.quantity);
        $('#removeFromCartButton').removeClass('disabled');
      } else {
        $('#confirmAddToCartButton').show();
      }
    } catch (e) {
      $('#confirmAddToCartButton').show();
      updateAddToCartUi({id, name, price, unformattedPrice, image});
      $('#addToCartModal').modal('show');
    }
  } else {
    $('#logInModal').modal('show');
  }
}

function updateAddToCartUi({id, name, price, unformattedPrice, image}) {
  $('#productImage').attr('src', image);
  $('#productId').val(id);
  $('#productName').text(name);
  $('#productPrice').text(price);
  $('#unformattedPrice').val(unformattedPrice);
  $('#itemQuantity').val(1);
  document.querySelector('#itemQuantity').dataset.id = id;
  document.querySelector('#removeFromCartButton').dataset.id = id;
  $('#addToCartModal').modal('show');
  $('#removeFromCartButton').addClass('disabled');
}

async function addToCartApi() {
  const productId = $('#productId').val();
  const quantity = +$('#itemQuantity').val();
  const name = $('#productName').text();
  await api.addToCart({productId, quantity, name});
  await updateCartDetails();
  $('#addToCartModal').modal('hide');
}

async function displayShoppingCart() {
  const user = await util.isLoggedIn();
  if (user) {
    const cart = await api.getShoppingCartItems();
    const items = cart.items;
    $('#shoppingCart .list-group').empty();
    for (const item of items) {
      const product = await api.getProduct(item.productId);
      const productElement = templates.itemInCart
        .replace(/#ID#/g, DOMPurify.sanitize(product.productId))
        .replace(/#IMAGE#/g, DOMPurify.sanitize(product.image))
        .replace(/#NAME#/g, DOMPurify.sanitize(product.name))
        .replace(/#PRICE#/g, DOMPurify.sanitize(product.price));
      $('#shoppingCart .list-group').append(productElement);
      $('#list-' + product.productId + ' select').val(
        DOMPurify.sanitize(item.quantity),
      );
    }
    $('#shoppingCart').modal('show');
  } else {
    $('#logInModal').modal('show');
  }
}

async function updateCount({productId, quantity}) {
  const result = await api.getShoppingCartItems();
  result.items.forEach(item => {
    if (item.productId === productId) {
      item.quantity = +quantity;
    }
  });
  await api.updateCart(result.items);
  updatePrice(quantity);
}

function updatePrice(quantity) {
  const unitPrice = $('#unformattedPrice').val();
  const total = unitPrice * quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
  }).format(total);
  $('#productPrice').text(formattedPrice);
}

async function removeFromCart(items) {
  if ($('#removeFromCart').hasClass('disabled')) {
    return;
  }

  if (!Array.isArray(items)) items = [items];
  const updatedItems = [];
  const result = await api.getShoppingCartItems();
  result.items.forEach(item => {
    if (!items.includes(item.productId)) {
      updatedItems.push(item);
    }
  });

  await api.updateCart(updatedItems);
  items.forEach(productId => {
    $('#addToCartModal').modal('hide');
    $('#card-' + productId + ' .cart-action-button').text('Add to Cart');
    $('#details-' + productId + ' .btn-primary').text('Confirm');
  });

  await updateCartDetails();
}

async function removeItems() {
  const items = [];
  const selected = $('#shoppingCart input[type=checkbox]:checked');
  selected.each((i, checkbox) => {
    const id = checkbox.dataset.id;
    items.push(id);
    $('#list-' + id).remove();
  });
  await removeFromCart(items);
}

async function checkOut() {
  $('#checkOutButton span').removeClass('hidden');
  await api.deleteShoppingCart();
  await updateCartDetails();
  setTimeout(async function() {
    $('.cart-action-button').text('Add to Cart');
    $('#shoppingCart').modal('hide');
    $('#checkOutButton span').addClass('hidden');
  }, 1000);
}

function showProfile() {
  const userId = localStorage.getItem('shoppyUserId');
  document.location = profilePage + '?id=' + userId;
}

async function updateUser() {
  if (util.isSupport()) {
    return;
  }
  const userId = $('#userId').text();
  const firstName = $('#profile-firstName').val();
  const lastName = $('#profile-lastName').val();
  const email = $('#profile-email').val();
  const roles = [];
  $('#profile-roles input').each((i, input) => {
    if ($(input).prop('checked')) {
      const role = input.id.replace('-role', '');
      roles.push(role);
    }
  });
  const body = {
    firstName,
    lastName,
    email,
    roles,
  };
  try {
    await api.updateUser(userId, body);
    location.reload();
  } catch (e) {
    await refreshLogInStatus();
  }
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

$(async function() {
  // Event handlers
  $('body').on('click', '#logInButton', async function() {
    await logIn();
  });

  $('body').on('click', '#logOut', async function() {
    await logOut();
  });

  $('body').on('click', '#signUpButton', async function() {
    await signUp();
  });

  $('body').on('click', '#removeItemsButton', async function() {
    await removeItems();
  });

  $('body').on('click', '#checkOutButton', async function() {
    await checkOut();
  });

  $('body').on('click', '.addToCartButton', async function(e) {
    const el = e.target;
    const id = el.dataset.id;
    const name = el.dataset.name;
    const price = el.dataset.price;
    const unformattedPrice = el.dataset.unformattedprice;
    const image = el.dataset.image;
    await addToCart({id, name, price, unformattedPrice, image});
  });

  $('body').on('click', '#removeFromCartButton', async function() {
    const el = document.querySelector('#removeFromCartButton');
    const productId = el.dataset.id;
    await removeFromCart(productId);
  });

  $('body').on('click', '#confirmAddToCartButton', async function() {
    await addToCartApi();
  });

  $('body').on('change', '#itemQuantity', async function() {
    const el = document.querySelector('#itemQuantity');
    await updateCount({productId: el.dataset.id, quantity: el.value});
  });

  $('body').on('click', '#shoppingCartLink', async function() {
    await displayShoppingCart();
  });

  $('body').on('click', '#shoppingCart', function() {
    if ($('#shoppingCart').find('input:checked').length) {
      $('#removeItemsButton').removeClass('disabled');
    } else {
      $('#removeItemsButton').addClass('disabled');
    }
    if (!$('#shoppingCart li').length) {
      $('#shoppingCart').modal('hide');
    }
  });

  // Render the initial UI
  $('#navBar').append(templates.navBar);
  $('body').append(templates.shoppingCart);
  $('body').append(templates.orders);
  await refreshLogInStatus();
});
