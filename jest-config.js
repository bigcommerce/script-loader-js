module.exports = {
    browser: true,
    preset: 'ts-jest',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
    testRegex: 'src/.*\\.spec.(js|ts)$',
    setupFilesAfterEnv: [
        '<rootDir>/jest-setup.js',
    ],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
    ],
    coveragePathIgnorePatterns: [
        '\\.mock\\.(js|ts)$',
        '\\.typedef\\.(js|ts)$',
        '\\.d\\.ts$',
    ],
};
