// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Cart', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should add items to Cart', () => {
    addToCart();
  });

  it('should checkout all items from Cart', () => {
    cy.get('[data-cy=shoppingCartLink]')
      .should('be.visible')
      .click()
      .then(() => {
        cy.get('[data-cy=logInButton]').click();

        cy.get('[data-cy=shoppingCartLink]').should('be.visible').click();

        cy.get('[data-cy=list-group]')
          .should('be.visible')
          .find('li')
          .get('[data-cy=cartItem]')
          .should('be.visible')
          .check();
      });
    cy.get('[data-cy=checkOutButton]').click();
  });

  it('should remove all items from Cart', () => {
    addToCart();

    cy.get('[data-cy=logInButton]').click({force: true});
    cy.get('[data-cy=shoppingCartLink]')
      .should('be.visible')
      .click()
      .then(() => {
        cy.get('[data-cy=list-group]')
          .should('be.visible')
          .find('li')
          .get('[data-cy=cartItem]')
          .should('be.visible')
          .check();

        cy.get('[data-cy=removeItemsButton]').should('be.visible').click();
      });
  });

  function addToCart() {
    cy.get('[data-cy=navigationBar]')
      .find('[data-cy=navbar-nav]')
      .get('[data-cy=nav-item]')
      .first()
      .click();

    cy.get('[data-cy=addToCartButton]')
      .should('be.visible')
      .first()
      .click()
      .then(() =>
        cy.get('[data-cy=logInButton]').should('be.visible').click('top'),
      );

    cy.get('[data-cy=addToCartButton]')
      .should('be.visible')
      .first()
      .click()
      .then(() => {
        cy.get('[data-cy=confirmAddToCartButton]').should('be.visible').click();
        cy.get('[data-cy=confirmAddToCartButton]')
          .should('be.visible')
          .click({force: true});
        cy.get('[data-cy=confirmAddToCartButton]')
          .should('be.visible')
          .click({force: true});
      });
  }
});
