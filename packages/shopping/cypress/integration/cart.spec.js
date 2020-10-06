context('Cart', () => {
  before(() => {
    cy.visit('http://localhost:3000/shoppy.html');
  });

  it('should add and checkout all items in Cart', () => {
    cy.get('#products')
      .find('.card')
      .first()
      .get('.action-buttons')
      .contains('Details')
      .click();

    addToCart();

    cy.get('#shoppingCartLink')
      .click()
      .then(() =>
        // we need to wait for the pop-up to show with the items to checkout
        // if there are more items in Cart the wait time might need to be increased
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy
          .get('.list-group')
          .find('li')
          .wait(500)
          .get('input[name="cartItem"]')
          .check(),
      );
    cy.get('#checkOutButton').click();
  });

  it('should add and remove item from Cart', () => {
    addToCart();
    // we need to wait for the pop up to show items we need to remove
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('.addToCartButton')
      .click()
      .wait(500)
      .then(() => cy.get('#removeFromCartButton').click());
  });

  function addToCart() {
    cy.get('.addToCartButton')
      .click()
      .then(() => cy.get('#logInButton').click());

    // wait for the pop up to show then confirm adding to Cart
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('.addToCartButton')
      .click()
      .wait(500)
      .then(() => cy.get('#confirmAddToCartButton').click({force: true}));
  }
});
