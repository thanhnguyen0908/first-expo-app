module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',  // Adjust the path as needed
          },
        },
      ],
    ],
  };
};
