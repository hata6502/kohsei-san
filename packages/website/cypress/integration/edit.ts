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
    cy.get('[contenteditable="plaintext-only"]')
      .type(
        'ｓaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      )
      .blur();
    cy.get('main')
      .get('[contenteditable="plaintext-only"]')
      .closest('.MuiBox-root')
      .find('svg')
      .click();
    cy.contains('アルファベットは「半角」で表記します。')
      .closest('.MuiListItem-container')
      .find('button')
      .click();
    cy.get('main').contains(
      'saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    );
  });
});
