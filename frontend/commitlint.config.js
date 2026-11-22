// Enforces Conventional Commits, e.g. `feat(chat): add reactions`.
// Runs from the Husky commit-msg hook (.husky/commit-msg).
/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
};
