module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-styled-components", "stylelint-prettier/recommended"],
  plugins: "stylelint-prettier",
  processors: "stylelint-processor-styled-components",
  rules: {
    "prettier/prettier": true,
    "value-keyword-case": ['lower', {
      ignoreKeywords: ['dummyValue']
    }]
  }
};
