context('Products', () => {
  before(() => {
    cy.visit('http://localhost:3000/shoppy.html');
  });

  it('should have product pagination', () => {
    cy.get('#pagination')
      .find('.page-item')
      .then(pages => {
        expect(pages).to.have.length.greaterThan(0);
      });
  });

  it('should have 4 products on landing page', () => {
    cy.get('#products')
      .find('.card')
      .then(cards => {
        expect(cards).to.have.length(4);
      });
  });

  it('should view details of the first product', () => {
    cy.get('#products')
      .find('.card')
      .first()
      .get('.action-buttons')
      .contains('Details')
      .click();
    cy.url().should('include', 'product.html?id=');
  });

  it('should prompt user to login when attempting to add product to Cart', () => {
    cy.get('.addToCartButton').click();
    cy.get('#logInTitle').should('have.text', 'Shoppy Log In');
  });
});
