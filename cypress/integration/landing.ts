/// <reference types="cypress" />

describe('landing', () => {
  it('「使ってみる」に移動する', () => {
    cy.visit('');
    cy.contains('使ってみる').click();
    cy.contains('校正を通過しました！');
  });

  /*it('「試してみる」に移動する', () => {
    cy.visit('');
    cy.contains('試してみる').click();
    cy.contains('メッセージがあります。');
  });*/

  it('GitHub に移動する', () => {
    cy.visit('', {
      onBeforeLoad: (window) => cy.stub(window, 'open'),
    });

    cy.contains('GitHub').click();
    cy.window().its('open').should('be.calledWith', 'https://github.com/blue-hood/kohsei-san');
  });

  it('Twitter に移動する', () => {
    cy.visit('', {
      onBeforeLoad: (window) => cy.stub(window, 'open'),
    });

    cy.contains('Twitter').click();
    cy.window().its('open').should('be.calledWith', 'https://twitter.com/hata6502');
  });

  it('「このアプリについて」に移動する', () => {
    cy.visit('', {
      onBeforeLoad: (window) => cy.stub(window, 'open'),
    });

    cy.contains('このアプリについて').click();
    cy.window()
      .its('open')
      .should('be.calledWith', 'https://github.com/blue-hood/kohsei-san/blob/master/README.md');
  });
});
