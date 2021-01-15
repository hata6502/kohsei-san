/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />

describe('edit', () => {
  it('校正を通過する', () => {
    cy.visit('');
    cy.findByTestId('sidebar-component-add-memo').click();

    cy.findByText('校正を通過しました。おめでとうございます！').should('exist');
  });

  it('自動修正する', () => {
    cy.visit('');
    cy.findByTestId('sidebar-component-add-memo').click();

    cy.get('[contenteditable="plaintext-only"]').type('ａbc').blur();
    cy.get('[contenteditable="plaintext-only"]').closest('.MuiBox-root').find('svg').click();
    cy.findByText('アルファベットは「半角」で表記します。')
      .closest('.MuiListItem-container')
      .find('button')
      .click();
    cy.get('[contenteditable="plaintext-only"]').findByText('abc').should('exist');
  });
});
