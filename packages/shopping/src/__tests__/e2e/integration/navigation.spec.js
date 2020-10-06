// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Navigation', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should have Shoppy logo', () => {
    cy.get('[data-cy=logo]').should('have.text', 'Shoppy');
  });

  it('should open home link', () => {
    cy.get('[data-cy=navigationBar]')
      .find('[data-cy=navbar-nav]')
      .get('[data-cy=nav-item]')
      .first()
      .click()
      .then(() => {
        cy.get('[data-cy=products]')
          .find('[data-cy=card]')
          .then(products => {
            expect(products).to.have.length(4);
          });
      });
  });

  it('should open sign up link', () => {
    cy.get('[data-cy=signUp]')
      .click()
      .then(() => {
        cy.get('[data-cy=signUpTitle]').contains('Shoppy Sign Up');
        cy.get('[data-cy=signUpModal]').click('top');
      });
  });

  it('should open log in link', () => {
    cy.get('[data-cy=logIn]')
      .click()
      .then(() => {
        cy.get('[data-cy=logInTitle]').should('have.text', 'Shoppy Log In');
        cy.get('[data-cy=logInModal]').click('top');
      });
  });

  it('should verify search functionality exists', () => {
    cy.get('[data-cy=search]')
      .invoke('val')
      .then(value => expect(value).to.be.empty);
    cy.get('[data-cy=searchButton]').should('have.text', 'Search');
  });
});
