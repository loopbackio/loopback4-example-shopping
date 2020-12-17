// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*global apiUrl, localStorage, api, ui, location, config, document, templates, util, alert, DOMPurify, profilePage, ordersPage, homePage, $*/
'use strict';

function addPagination() {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  $.get(apiUrl + '/products/count', function (result) {
    const totalPages = Math.ceil(result.count / config.itemsPerPage);
    const currentPageNumber = util.getCurrentPageNumber();

    let pages = '';
    for (let i = 0; i < totalPages; i++) {
      const pageNumber = i + 1;
      if (currentPageNumber === pageNumber) {
        pages += `<li data-cy="page-item" class="page-item"><a class="page-link">${pageNumber}</a></li>`;
      } else {
        pages += `<li data-cy="page-item" class="page-item"><a class="page-link" href="${config.homePage}?page=${pageNumber}">${pageNumber}</a></li>`;
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
        $('#itemsInCart').text(itemsCount).show();
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
    $('#passwordResetModal').modal('hide');
  } else {
    $('#logInTitle').text('Invalid credentials');
  }
}

async function forgotPassword(email, password, confirmPassword) {
  email = email || $('#passwordResetEmail').val();
  password = password || $('#passwordResetPassword').val();
  confirmPassword = confirmPassword || $('#passwordResetConfirmPassword').val();

  if (typeof password === 'undefined' || password.length === 0) {
    $('#passwordResetNoPassword').show();
    setTimeout(() => {
      $('#passwordResetNoPassword').hide();
    }, 3000);
    return;
  }

  if (password.length < 8) {
    $('#passwordResetNoCorrectPassword').show();
    setTimeout(() => {
      $('#passwordResetNoCorrectPassword').hide();
    }, 3000);
    return;
  }

  if (typeof confirmPassword === 'undefined' || confirmPassword.length === 0) {
    $('#passwordResetNoConfirmPassword').show();
    setTimeout(() => {
      $('#passwordResetNoConfirmPassword').hide();
    }, 3000);
    return;
  }

  if (password !== confirmPassword) {
    $('#passwordResetMismatch').show();

    setTimeout(() => {
      $('#passwordResetMismatch').hide();
    }, 3000);
    return;
  }

  const res = await api.forgotPassword({email, password}).catch(() => {
    $('#passwordResetFailed').show();
    setTimeout(() => {
      $('#passwordResetFailed').hide();
    }, 3000);
  });

  if (res) {
    localStorage.setItem('shoppyToken', res.token);
    $('#passwordResetChanged').show();
    setTimeout(() => {
      $('#passwordResetChanged').hide();
    }, 3000);

    $('#passwordResetEmail').val('');
    $('#passwordResetPassword').val('');
    $('#passwordResetConfirmPassword').val('');
  }
}

function isEmailValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

async function passwordResetInit(email) {
  email = email || $('#resetPasswordInit-email').val();

  if (!isEmailValid(email)) {
    $('#passwordResetInitInvalidEmail').show();
    setTimeout(() => {
      $('#passwordResetInitInvalidEmail').hide();
    }, 3000);
    return;
  }

  const res = await api.passwordResetInit({email}).catch(e => {
    $('#passwordResetInitFailed')
      .text(JSON.parse(e.responseText).error.message)
      .show();
    setTimeout(() => {
      $('#passwordResetInitFailed').hide();
    }, 5000);
  });

  if (res) {
    $('#resetPasswordInitEmailLabel').hide();
    $('#resetPasswordInitInstructions').hide();
    $('#resetPasswordInit-email').hide();
    $('#init-resetPassword').hide();
    $('#passwordResetInitSuccess').show();
  }
}

async function passwordResetFinish(resetKey, password, confirmPassword) {
  password = password || $('#resetPasswordFinish-password').val();
  confirmPassword =
    confirmPassword || $('#resetPasswordFinish-confirmPassword').val();
  const urlParams = new URLSearchParams(window.location.search);

  if (password !== confirmPassword) {
    $('#passwordResetFinishMismatch').show();
    setTimeout(() => {
      $('#passwordResetFinishMismatch').hide();
    }, 3000);
    return;
  }

  if (!password || password.length < 8) {
    $('#passwordResetFinishInvalid').show();
    setTimeout(() => {
      $('#passwordResetFinishInvalid').hide();
    }, 3000);
    return;
  }

  if (urlParams.has('resetKey')) {
    resetKey = urlParams.get('resetKey');

    const res = await api
      .passwordResetFinish({
        resetKey: resetKey,
        password: password,
        confirmPassword: confirmPassword,
      })
      .catch(e => {
        $('#passwordResetFinishFailed')
          .text(JSON.parse(e.responseText).error.message)
          .show();
        setTimeout(() => {
          $('#passwordResetFinishFailed').hide();
        }, 5000);
      });

    if (res) {
      $('#passwordResetFinishSuccess').show();
      $('#passwordResetFinishMismatch').hide();
      $('#passwordResetFinishInvalid').hide();
      $('#passwordResetFinishFailed').hide();
      $('#resetPasswordFinishPasswordLabel').hide();
      $('#resetPasswordFinishConfirmPasswordLabel').hide();
      $('#resetPasswordFinish-password').hide();
      $('#resetPasswordFinish-confirmPassword').hide();
      $('#finish-resetPassword').hide();
    }
  } else {
    $('#passwordResetFinishFailed').show();
    setTimeout(() => {
      $('#passwordResetFinishFailed').hide();
    }, 3000);
  }
}

function displayPasswordReset() {
  $('#logInModal').modal('hide');
  $('#passwordResetModal').modal('show');
  $('#passwordResetNoAccount').hide();
  $('#passwordResetMismatch').hide();
  $('#passwordResetNoPassword').hide();
  $('#passwordResetNoConfirmPassword').hide();
  $('#passwordResetNoCorrectPassword').hide();
  $('#passwordResetChanged').hide();
  $('#passwordResetFailed').hide();
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
  setTimeout(async function () {
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

$(async function () {
  // Event handlers
  $('body').on('click', '#logInButton', async function () {
    await logIn();
  });

  $('body').on('click', '#passwordResetButton', async function () {
    await forgotPassword();
  });

  $('body').on('click', '#init-resetPassword', async function () {
    await passwordResetInit();
  });

  $('body').on('click', '#finish-resetPassword', async function () {
    await passwordResetFinish();
  });

  $('body').on('click', '#logOut', async function () {
    await logOut();
  });

  $('body').on('click', '#signUpButton', async function () {
    await signUp();
  });

  $('body').on('click', '#removeItemsButton', async function () {
    await removeItems();
  });

  $('body').on('click', '#checkOutButton', async function () {
    await checkOut();
  });

  $('body').on('click', '.addToCartButton', async function (e) {
    const el = e.target;
    const id = el.dataset.id;
    const name = el.dataset.name;
    const price = el.dataset.price;
    const unformattedPrice = el.dataset.unformattedprice;
    const image = el.dataset.image;
    await addToCart({id, name, price, unformattedPrice, image});
  });

  $('body').on('click', '#removeFromCartButton', async function () {
    const el = document.querySelector('#removeFromCartButton');
    const productId = el.dataset.id;
    await removeFromCart(productId);
  });

  $('body').on('click', '#confirmAddToCartButton', async function () {
    await addToCartApi();
  });

  $('body').on('change', '#itemQuantity', async function () {
    const el = document.querySelector('#itemQuantity');
    await updateCount({productId: el.dataset.id, quantity: el.value});
  });

  $('body').on('click', '#shoppingCartLink', async function () {
    await displayShoppingCart();
  });

  $('body').on('click', '#shoppingCart', function () {
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
