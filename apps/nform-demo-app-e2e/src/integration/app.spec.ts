import { getGreeting } from '../support/app.po';

describe('nform-demo-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('span').contains('Form');
  });
});
