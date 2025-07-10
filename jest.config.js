export default {
    testEnvironment: 'node',
    transform: {
        '^.+\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^(\.{1,2}/.*)\.js$': '$1',
    },
    testMatch: ['**/test/**/*.test.js'],
    setupFilesAfterEnv: ['./tests/setup.js'],
    verbose: true
};
