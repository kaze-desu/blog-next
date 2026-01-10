export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce lowercase for type, scope, and subject
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],

    // Standard conventional commit types
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],

    // Subject requirements
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 200],
    'body-max-line-length': [2, 'always', 400],
  },
}
