// / <reference types="cypress" />

module.exports = on => {
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  on('task', require('@cypress/code-coverage/task'));
};
