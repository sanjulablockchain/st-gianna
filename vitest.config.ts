import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    // Git worktrees live under .claude/worktrees and .worktrees, inside the repo. Without
    // this, every test file is collected twice, once from this checkout and
    // once from each worktree, and the worktree copies fail because the @
    // alias still resolves to this root.
    exclude: [...configDefaults.exclude, "**/.claude/**", "**/.worktrees/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
