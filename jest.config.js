/* eslint-disable */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@/src/(.*)": "<rootDir>/src/$1",
    "@/api/http/(.*)": "<rootDir>/src/api/http/$1",
    "@/app/(.*)": "<rootDir>/src/app/$1",
    "@/domain/(.*)": "<rootDir>/src/domain/$1",
    "@/libs/(.*)": "<rootDir>/src/libs/$1",
    "@/infra/(.*)": "<rootDir>/src/infra/$1",
    "@/infra/repositories/(.*)": "<rootDir>/src/infra/database/repositories/$1",
  },
};
