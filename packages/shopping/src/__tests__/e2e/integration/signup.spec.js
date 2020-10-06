// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Sign Up', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should allow user to create log in profile', () => {
    cy.get('[data-cy=signUp]').click();
    cy.get('[data-cy=firstName]')
      .type('LoopBack')
      .get('[data-cy=lastName]')
      .type('Is Great')
      .get('[data-cy=signUpEmail]')
      .type(`${Math.random().toString(36).substring(8)}@example.com`)
      .get('[data-cy=signUpPassword]')
      .type('p@$$w0rd12345')
      .then(() => cy.get('#signUpButton').click());
    cy.get('[data-cy=user]').contains('LoopBack Is Great');
    cy.get('[data-cy=logOut]').contains('Log Out');
  });

  // Negative tests can be added here after the UI is updated
  // to response accordingly
});
