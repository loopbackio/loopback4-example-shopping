// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

context('Profile', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should update user profile', () => {
    cy.get('[data-cy=logIn]')
      .should('be.visible')
      .click()
      .then(() => cy.get('[data-cy=logInButton]').click());

    cy.get('[data-cy=user]')
      .should('be.visible')
      .click()
      .then(() => cy.get('[data-cy=card-title]').contains('Doe'));

    cy.get('[data-cy=profileFirstName]')
      .should('be.visible')
      .clear()
      .type('LoopBack')
      .then(() =>
        cy
          .get('[data-cy=update-profile]')
          .click()
          .then(() =>
            cy.get('[data-cy=user]').should('contain', 'LoopBack Doe'),
          ),
      );
  });

  it('should verify updated profile information', () => {
    cy.get('[data-cy=profileFirstNameLabel]')
      .should('have.text', 'First Name')
      .get('[data-cy=profileLastNameLabel]')
      .should('have.text', 'Last Name')
      .get('[data-cy=profileEmailLabel]')
      .should('have.text', 'Email');

    cy.get('[data-cy=profileFirstName]')
      .invoke('val')
      .then((value: string) => expect(value).to.eql('LoopBack'));

    cy.get('[data-cy=profileLastName]')
      .invoke('val')
      .then((value: string) => expect(value).to.eql('Doe'));

    cy.get('[data-cy=profileEmail]')
      .invoke('val')
      .then((value: string) => expect(value).to.eql('john@example.com'));
    cy.get('[data-cy=update-profile]').contains('Update');

    cy.get('[data-cy=logOut').should('be.visible').click();
  });

  it('should reset user password', () => {
    cy.get('[data-cy=logIn]')
      .should('be.visible')
      .click()
      .then(() => cy.get('[data-cy=logInButton]').click());

    cy.get('[data-cy=user]')
      .click()
      .then(() =>
        cy
          .get('[data-cy=passwordResetLink]')
          .contains('Reset your password')
          .click(),
      );

    const passwordReset = 'john12345678';
    cy.get('[data-cy=passwordResetPassword]')
      .should('be.visible')
      .type(passwordReset)
      .get('[data-cy=passwordResetConfirmPassword]')
      .type(passwordReset)
      .then(() =>
        cy
          .get('[data-cy=passwordResetButton]')
          .click()
          .then(() =>
            cy
              .get('[data-cy=passwordResetChanged]')
              .contains('Password successfully changed'),
          ),
      );
  });
});
