import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.e2e.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  globalSetup: "<rootDir>/src/tests/setup-e2e.ts",
  globalTeardown: "<rootDir>/src/tests/teardown-e2e.ts",
  testTimeout: 60000,
};

export default config;
