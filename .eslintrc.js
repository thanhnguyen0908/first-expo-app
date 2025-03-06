// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  ignorePatterns: ["/dist/*"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "."], // Ensure it looks for modules in project root
      },
      typescript: {
        project: "./tsconfig.json", // Ensure ESLint reads your tsconfig.json
      },
    },
  },
  rules: {
    "import/no-unresolved": "off", // (Optional: Disable if issues persist)
  },
};
