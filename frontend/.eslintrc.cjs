module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Must be last to override other configs
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'simple-import-sort'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // External libraries (react, react-dom, third-party packages)
          ['^react', '^react-dom', '^@?\\w'],
          // Internal components (@/components)
          ['^@/components'],
          // Internal hooks, utils, libs (@/hooks, @/utils, @/lib, @/context, @/theme)
          ['^@/(hooks|utils|lib|context|theme)'],
          // Schemas
          ['^@/schemas'],
          // Types (@/types)
          ['^@/types'],
          // Constants (@/.*/constants, @/utils/constants)
          ['^@/.*/constants', '^@/utils/constants'],
          // Relative imports (parent directories first, then current)
          ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
}

