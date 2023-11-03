module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'], // Adjust the pattern to match your test files
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
