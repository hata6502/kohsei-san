/// <reference types="cypress" />

describe('sidebar', () => {
  it('メモを追加して削除する', () => {
    cy.visit('');
    cy.contains('メモを追加').click();
    cy.contains('(空のメモ)').should('exist');

    cy.get('nav li button').click();
    cy.contains('はい').click();
    cy.contains('(空のメモ)').should('not.exist');
  });
});
