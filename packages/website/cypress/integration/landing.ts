/// <reference types="cypress" />

describe('landing', () => {
  it('GitHub に移動する', () => {
    cy.visit('');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
    cy.contains('GitHub').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://github.com/blue-hood/kohsei-san');
  });

  it('Twitter に移動する', () => {
    cy.visit('');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
    cy.contains('Twitter').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://twitter.com/hata6502');
  });

  it('「このアプリについて」に移動する', () => {
    cy.visit('');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
    cy.contains('このアプリについて').click();
    cy.get('@windowOpen').should(
      'be.calledWith',
      'https://github.com/blue-hood/kohsei-san/blob/master/README.md'
    );
  });

  it('「使ってみる」に移動する', () => {
    cy.visit('');
    cy.contains('使ってみる').click();
    cy.contains('校正偏差値');
  });
});
