module.exports = {
    browser: true,
    transform: {
        '\\.(ts|js)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
    testRegex: 'src/.*\\.spec.(js|ts)$',
    setupTestFrameworkScriptFile: '<rootDir>/jest-setup.js',
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
    ],
    coveragePathIgnorePatterns: [
        '\\.mock\\.(js|ts)$',
        '\\.typedef\\.(js|ts)$',
        '\\.d\\.ts$',
    ],
};
