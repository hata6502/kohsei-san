/// <reference types="cypress" />

describe('landing', () => {
  it('「使ってみる」に移動する', () => {
    cy.visit('');
    cy.contains('使ってみる').click();
    cy.contains('校正偏差値');
  });
});
