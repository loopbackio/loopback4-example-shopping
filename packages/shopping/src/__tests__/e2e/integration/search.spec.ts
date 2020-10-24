// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Search', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should search for product information', () => {
    cy.get('[data-cy=search]')
      .type('iPhone 11')
      .then(() => cy.get('[data-cy=searchButton]').click());
  });
  // More tests can be added here once the search functionality works
});
