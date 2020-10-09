/// <reference types="cypress" />

describe('edit', () => {
  it('校正を通過する', () => {
    cy.visit('');
    cy.get('nav').contains('メモを追加').click();
    cy.contains('校正を通過しました。おめでとうございます！');
  });

  it('自動修正する', () => {
    cy.visit('');
    cy.get('nav').contains('メモを追加').click();
    cy.get('[contenteditable="plaintext-only"]').type('食べたさそう').blur();
    cy.get('main').contains('食べたさそう').closest('.MuiBox-root').find('svg').click();
    cy.contains('不要な「さ」が挿入されています。')
      .closest('.MuiListItem-container')
      .find('button')
      .click();
    cy.get('main').contains('食べたそう');
  });
});
