// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const navBarTemplate = `
<a id="logo" data-cy="logo" class="navbar-brand" href="/shoppy.html">Shoppy</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigationBar" aria-controls="navigationBar" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="collapse navbar-collapse" data-cy="navigationBar" id="navigationBar">
  <ul class="navbar-nav mr-auto" data-cy="navbar-nav">
    <li class="nav-item active" data-cy="nav-item">
      <a class="nav-link" href="/shoppy.html">Home <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item" id="shoppingCartLink" data-cy="shoppingCartLink" style="display:none">
      <div class="nav-link">Shopping Cart<span style="display:none" id="itemsInCart" class="badge badge-notify">0</span></div>
    </li>
    <li id="signUp" data-cy="signUp" class="nav-item">
      <a class="nav-link" href="#" data-toggle="modal" data-target="#signUpModal" tabindex="-1">Sign Up</a>
    </li>
    <div class="modal" id="signUpModal" data-cy="signUpModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" data-cy="signUpTitle" id="signUpTitle">Shoppy Sign Up</h5>
          </div>
          <div class="modal-body">

    <form id="signUpForm">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="firstName">First name</label>
          <input type="text" class="form-control" data-cy="firstName" id="firstName" name="firstName">
        </div>
        <div class="form-group col-md-6">
          <label for="lastName">Last name</label>
          <input type="text" class="form-control" data-cy="lastName" id="lastName" name="lastName">
        </div>
      </div>
      <div class="form-group">
        <label for="signUpEmail">Email address</label>
        <input type="email" class="form-control" id="signUpEmail" data-cy="signUpEmail" name="signUpEmail" autocomplete="new-email">
      </div>
      <div class="form-group">
        <label for="signUpPassword">Password</label>
        <input type="password" data-cy="signUpPassword" class="form-control" id="signUpPassword" name="signUpPassword" autocomplete="new-password">
        <small class="form-text text-muted">Password should be minimum eight characters</small>
      </div>
      <div class="text-center">
        <div id="signUpButton" class="btn btn-primary">Sign Up</div>
      </div>
    </form>
          </div>
        </div>
      </div>
    </div>
    <li id="logOut" data-cy="logOut" class="nav-item">
      <div class="nav-link">Log Out</div>
    </li>
    <li id="logIn" data-cy="logIn" class="nav-item">
      <div class="nav-link" data-toggle="modal" data-target="#logInModal" tabindex="-1">Log In</div>
    </li>
  </ul>
  
  <div class="modal" id="passwordResetModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="passwordResetTitle">Password Reset</h5>
        </div>
        <div class="modal-body">
          <form id="passwordResetForm">
             <div class="alert alert-danger" id="passwordResetMismatch" role="alert">
              Confirm password and password do not match
            </div>
            <div class="alert alert-danger" id="passwordResetFailed" role="alert">
              Password reset failed
            </div>
            <div class="alert alert-danger" id="passwordResetNoPassword" role="alert">
              Please enter your password
            </div>
            <div class="alert alert-danger" id="passwordResetNoCorrectPassword" role="alert">
              Please enter a valid password
            </div>
            <div class="alert alert-danger" id="passwordResetNoConfirmPassword" role="alert">
              Please confirm your password
            </div>
            <div class="alert alert-success" data-cy="passwordResetChanged" id="passwordResetChanged" role="alert">
              Password successfully changed
            </div>
            <div class="form-group">
              <label for="passwordResetEmail">Email address</label>
              <input type="email" data-cy="passwordResetEmail" class="form-control" id="passwordResetEmail" value="john@example.com">
            </div>
            <div class="form-group">
              <label for="passwordResetPassword">Password</label>
              <input type="password" data-cy="passwordResetPassword" class="form-control" id="passwordResetPassword">
            </div>
            <div class="form-group">
              <label for="passwordResetPassword">Confirm Password</label>
              <input type="password" data-cy="passwordResetConfirmPassword" class="form-control" id="passwordResetConfirmPassword">
              <small class="form-text text-muted">Password should be minimum eight characters</small>
            </div>
            <div class="text-center">
              <div id="passwordResetButton" data-cy="passwordResetButton" class="btn btn-primary">Reset</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  <div class="modal" id="logInModal" data-cy="logInModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" data-cy="logInTitle" id="logInTitle">Shoppy Log In</h5>
        </div>
        <div class="modal-body">
          <form id="logInForm">
            <div class="form-group">
              <label for="logInEmail">Email address</label>
              <input type="email" class="form-control" id="logInEmail" name="logInEmail" value="john@example.com">
            </div>
            <div class="form-group">
              <label for="logInPassword">Password</label>
              <input type="password" class="form-control" id="logInPassword" name="logInPassword" value="john12345678">
            </div>
            <div class="text-center">
              <div id="logInButton" data-cy="logInButton" class="btn btn-primary">Log In</div>
            </div>
            <div class="text-center mt-4 mb-4">
              <a href="/reset-password-init.html">Reset your password</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="nav-item" id="user" data-cy="user" onclick="showProfile()">
    <img src="/user.png">
    <strong class="nav-item"></strong>
  </div>
  <form class="form-inline my-2 my-lg-0">
    <input class="form-control mr-sm-2" type="search" data-cy="search" name="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" data-cy="searchButton" id="searchButton" type="submit">Search</button>
  </form>
</div>
`;

const productTemplate = `
<div id="card-#ID#" data-cy="card" class="card" style="width: 18rem;">
  <img src="#IMAGE#" class="card-img-top product-img" alt="#NAME#">
  <div class="card-body">
    <h4 class="card-title" data-cy="card-title">#NAME#</h4>
    <h5>$#PRICE#</h5>
    <p class="card-text description">#DESCRIPTION#</p>
    <div class="action-buttons" data-cy="action-buttons">
      <div data-id="#ID#" data-name="#NAME#" data-price="#PRICE#" data-unformattedPrice="#UNFORMATTED-PRICE#"
       data-cy="addToCartButton" data-image="#IMAGE#" 
       class="addToCartButton btn btn-primary cart-action-button add-to-cart">Add to Cart</div>
      <a href="/product.html?id=#ID#" class="btn btn-primary">Details</a>
    </div>
  </div>
</div>
`;

const detailsTemplate = `
<div id="details-#ID#"  class="container">
  <div class="row">
    <div class="col-md">
      <img src="#IMAGE#" class="card-img-top details-img" alt="#NAME#">
    </div>
    <div class="col-sm">
      <div class="container" id="product-header">
        <div class="row">
          <div class="col col-8">
            <h3 class="card-title" data-cy="card-title">#NAME#</h3>
            <h5>$#PRICE#</h5>
          </div>
          <div class="col col-4">
            <div data-id="#ID#" data-name="#NAME#" data-price="#PRICE#" data-unformattedPrice="#UNFORMATTED-PRICE#"
             data-cy="addToCartButton" data-image="#IMAGE#"
             class="addToCartButton btn btn-primary cart-action-button add-to-cart">Add to Cart</div>
          </div>
        </div>
      </div>
      <p class="card-text details">#DETAILS#</p>
    </div>
  </div>
</div>
`;

const addToCartTemplate = `
<div class="modal fade" id="addToCartModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <img id="productImage">
        <h4 id="productName" class="modal-title"></h4>
        <h5 class="modal-title">$<span id="productPrice"></span></h5>
      </div>
      <div class="modal-body">
        <form class="form-inline" style="justify-content: center">
          <label class="my-1 mr-2" for="itemQuantity">Quantity</label>
          <input type="hidden" id="unformattedPrice">
          <input type="hidden" id="productId">
          <select class="custom-select my-1 mr-sm-2" id="itemQuantity">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </form>
      </div>
      <div class="modal-footer" style="justify-content: center">
        <div id="removeFromCartButton" data-cy="removeFromCartButton" class="btn btn-primary">Remove from Cart</div>
        <div id="confirmAddToCartButton" data-cy="confirmAddToCartButton" class="btn btn-primary">Confirm</div>
      </div>
    </div>
  </div>
</div>
`;

const shoppingCartTemplate = `
<div class="modal fade" id="shoppingCart" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Shopping Cart</h5>
      </div>
      <div id="shoppingCartBody" class="modal-body text-center">
        <ul class="list-group" data-cy="list-group">
        </ul>
      </div>
      <div class="modal-footer" style="justify-content: center">
        <div id="removeItemsButton" data-cy="removeItemsButton" class="btn btn-primary disabled">Remove from Cart</div>
        <div id="checkOutButton" data-cy="checkOutButton" class="btn btn-primary">
          <span class="spinner-border spinner-border-sm hidden"></span> Checkout
        </div>
      </div>
    </div>
  </div>
</div>
`;

const itemInCartTemplate = `
 <li id="list-#ID#" class="list-group-item d-flex justify-content-between align-items-center item-in-cart">
  <span class="d-flex justify-content-between align-items-center">
    <input type="checkbox" data-cy="cartItem" name="cartItem" data-id="#ID#">
    <img src="#IMAGE#" class="card-img-top details-img" alt="#NAME#">
    <h5 class="card-title" data-cy="card-title">#NAME#</h5>
  </span>
  <span class="d-flex justify-content-between align-items-center">
    <h6>$#PRICE#</h6>
    <select class="custom-select my-1 mr-sm-2 product-quantity" onchange="updateCount('#ID#', this.value)">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  </span>
 </li>
`;

const orderTemplate = `
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between order-meta">
      <div>
      Date: #DATE#<br>
      Order ID: #ORDER-ID#
      </div>
      <div>
      User Name: #USER-NAME#<br>
      User ID: #USER-ID#
      </div>
    </div>
    <table class="table table-sm table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody>#PRODUCTS#</tbody>
    </table>
  <div class="order-total">Total: $#TOTAL#</div>
  </a>
</div>
`;

const profileTemplate = `
<div class="card-body">
  <div id="userId" class="hidden">#USER-ID#</div>
  <h4 class="card-title" data-cy="card-title"><b>#NAME#</b></h4>
  <p class="card-text description">
    <div><b data-cy="profileFirstNameLabel" id="profileFirstNameLabel">First Name</b> <input id="profile-firstName" data-cy="profileFirstName" name="profileFirstName" value="#FIRST-NAME#"></div>
    <div><b data-cy="profileLastNameLabel" id="profileLastNameLabel">Last Name</b> <input id="profile-lastName" data-cy="profileLastName" name="profileLastName" value="#LAST-NAME#"></div>
    <div><b data-cy="profileEmailLabel" id="profileEmailLabel">Email</b> <input id="profile-email" data-cy="profileEmail" name="profileEmail" value="#EMAIL#"></div>
    <div id="profile-roles"><b>Roles</b>
      <label for="admin-role">
        <input id="admin-role" type="checkbox">
        Admin
      </label>
      <label for="support-role">
        <input id="support-role" type="checkbox">
        Support
      </label>
      <label for="customer-role">
        <input id="customer-role" type="checkbox">
        Customer
      </label>
    </div>
  </p>
  <div id="update-profile" data-cy="update-profile">
    <div class="btn btn-primary" onclick="updateUser()">Update</div>
  </div>
  <div class="text-center mt-3 mb-3">
     <a href="javascript:void(0)" data-cy="passwordResetLink" onclick="displayPasswordReset()">Forgot your password?</a>
  </div>
</div>
`;

const resetPasswordInitTemplate = `
<div class="card-body">
  <h4 class="card-title" data-cy="card-title"><b>Reset your password</b></h4>
  <div class="alert alert-danger" id="passwordResetInitInvalidEmail" role="alert">
     Please enter a valid email address
   </div>
   <div class="alert alert-danger" id="passwordResetInitFailed" role="alert">
     replaceMe
   </div>
   <div class="alert alert-success" id="passwordResetInitSuccess" role="alert">
     An email has been sent to your inbox with instructions on how to reset your password
   </div>
 
  <p class="card-text description">
  <p id="resetPasswordInitInstructions">Enter the email address you used to register your account:</p>
    <div>
    <b data-cy="resetPasswordInitEmailLabel"
    id="resetPasswordInitEmailLabel">Email address</b> 
    <input type="email" id="resetPasswordInit-email" data-cy="resetPasswordInitEmail"
     name="resetPasswordInitEmail">
    </div>
  </p>
  <div id="init-resetPassword" data-cy="init-resetPassword">
    <div class="btn btn-primary">Send</div>
  </div>
</div>
`;

const resetPasswordFinishTemplate = `
<div class="card-body">
  <h4 class="card-title" data-cy="card-title"><b>Complete password reset</b></h4>
  <div class="alert alert-success" id="passwordResetFinishSuccess" role="alert">
     Your password has been successfully changed.
  </div>
  <div class="alert alert-danger" id="passwordResetFinishMismatch" role="alert">
     Password and confirmation password do not match
  </div>
  <div class="alert alert-danger" id="passwordResetFinishInvalid" role="alert">
     Password must be minimum of 8 characters
  </div>
  <div class="alert alert-danger" id="passwordResetFinishFailed" role="alert">
     Error resetting password. Please try again later
  </div>
  <p class="card-text description">
    <div>
        <b data-cy="resetPasswordFinishPasswordLabel" id="resetPasswordFinishPasswordLabel">New password</b>
        <input type="password" id="resetPasswordFinish-password" data-cy="resetPasswordFinishPassword" name="resetPasswordFinishPassword">
    </div>
    <br>
    <div>
        <b data-cy="resetPasswordFinishConfirmPasswordLabel" id="resetPasswordFinishConfirmPasswordLabel">Confirm password</b>
        <input type="password" style="float: right" id="resetPasswordFinish-confirmPassword" data-cy="resetPasswordFinishConfirmPassword" name="resetPasswordFinishConfirmPassword">
    </div>
  </p>
  <div id="finish-resetPassword" data-cy="finish-resetPassword">
    <div class="btn btn-primary">Reset</div>
  </div>
</div>
`;

const templates = {
  navBar: navBarTemplate,
  product: productTemplate,
  details: detailsTemplate,
  addToCart: addToCartTemplate,
  shoppingCart: shoppingCartTemplate,
  itemInCart: itemInCartTemplate,
  order: orderTemplate,
  profile: profileTemplate,
  resetPasswordInit: resetPasswordInitTemplate,
  resetPasswordFinish: resetPasswordFinishTemplate,
};
