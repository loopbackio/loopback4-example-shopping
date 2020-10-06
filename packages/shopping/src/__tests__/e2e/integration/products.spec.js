// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Products', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should have product pagination', () => {
    cy.get('[data-cy=pagination]')
      .find('[data-cy=page-item]')
      .then(pages => {
        expect(pages).to.have.length.greaterThan(0);
      });
  });

  it('should have 4 products on landing page', () => {
    cy.get('[data-cy=products]')
      .find('[data-cy=card]')
      .then(cards => {
        expect(cards).to.have.length(4);
      });
  });

  it('should view details of the first product', () => {
    cy.get('[data-cy=products]')
      .find('[data-cy=card]')
      .first()
      .get('[data-cy=action-buttons]')
      .contains('Details')
      .click();
    cy.url().should('include', 'product.html?id=');
  });

  it('should prompt user to log in when attempting to add product to Cart', () => {
    cy.get('[data-cy=addToCartButton]').click();
    cy.get('[data-cy=logInTitle]').should('have.text', 'Shoppy Log In');
  });
});
