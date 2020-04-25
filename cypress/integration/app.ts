/// <reference types="cypress" />

describe('app', () => {
  it('LP に移動できる', () => {
    cy.visit('');
    cy.contains('使ってみる').click();
    cy.get('h6').contains('校正さん').click();
    cy.contains('コンテンツへの信頼度を高めよう');
  });
});
