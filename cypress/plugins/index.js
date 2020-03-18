/// <reference types="cypress" />

module.exports = on => {
  on('task', require('@cypress/code-coverage/task'));
};
