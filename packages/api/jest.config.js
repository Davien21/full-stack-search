/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/config/(.*)$": "<rootDir>/config/$1",
    "^@/seeds/(.*)$": "<rootDir>/seeds/$1",
    "^@/routes/(.*)$": "<rootDir>/routes/$1",
    "^@/models/(.*)$": "<rootDir>/models/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/scripts/(.*)$": "<rootDir>/scripts/$1",
    "^@/middlewares/(.*)$": "<rootDir>/middlewares/$1",
  },
  // setupFiles: ['./jest.setup.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
