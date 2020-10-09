/// <reference types="cypress" />

describe('sidebar', () => {
  it('メモを追加する', () => {
    cy.visit('');
    cy.get('nav').contains('メモを追加').click();
    cy.contains('校正を通過しました。おめでとうございます！');
  });

  it('メモに移動する', () => {
    cy.visit('');
    cy.get('h6').contains('校正さん').click();
    cy.contains('コンテンツへの信頼度を高めよう');
    cy.get('nav').contains('(空のメモ)').click();
    cy.contains('校正を通過しました。おめでとうございます！');
  });

  it('メモを削除する', () => {
    cy.visit('');
    cy.get('nav li button').click();
    cy.contains('はい').click();
    cy.contains('コンテンツへの信頼度を高めよう');
  });
});
