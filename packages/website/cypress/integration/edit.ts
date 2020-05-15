/// <reference types="cypress" />

describe('edit', () => {
  it('校正を通過する', () => {
    cy.visit('');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('メモを追加').click();
    cy.contains('校正を通過しました！');
  });

  it('メッセージを表示する', () => {
    cy.visit('');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('メモを追加').click();
    cy.get('[contenteditable="plaintext-only"]').type('私は私は').blur();
    cy.contains('私は私は').closest('.MuiBox-root').find('svg').click();
    cy.contains('一文に二回以上利用されている助詞 "は" がみつかりました。');
  });
});
