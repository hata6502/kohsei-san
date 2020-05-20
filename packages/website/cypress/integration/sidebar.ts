/// <reference types="cypress" />

describe('sidebar', () => {
  it('メモを追加する', () => {
    cy.visit('');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('メモを追加').click();
    cy.contains('校正を通過しました！');
  });

  it('メモに移動する', () => {
    cy.visit('');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('メモを追加').click();
    cy.get('h6').contains('校正さん').click();
    cy.contains('コンテンツへの信頼度を高めよう');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('(空のメモ)').click();
    cy.contains('校正を通過しました！');
  });

  it('メモを削除する', () => {
    cy.visit('');
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('メモを追加').click();
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal li button').click();
    cy.contains('はい').click();
    cy.contains('コンテンツへの信頼度を高めよう');
  });

  it('Twitter に移動する', () => {
    cy.visit('');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('Twitter').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://twitter.com/hata6502');
  });

  it('「このアプリについて」に移動する', () => {
    cy.visit('');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
    cy.get('header button').click();
    cy.get('.MuiDrawer-root.MuiDrawer-modal').contains('このアプリについて').click();
    cy.get('@windowOpen').should(
      'be.calledWith',
      'https://github.com/blue-hood/kohsei-san/blob/master/README.md'
    );
  });
});
