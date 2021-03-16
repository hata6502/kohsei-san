/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />

describe('sidebar', () => {
  it('メモを追加して削除する', () => {
    cy.visit('');
    cy.findByTestId('sidebar-component-add-memo').click();
    cy.findByText('(空のメモ)').should('exist');

    cy.get('nav li button').click();
    cy.findByText('削除する').click();
    cy.findByText('(空のメモ)').should('not.exist');
  });
});
