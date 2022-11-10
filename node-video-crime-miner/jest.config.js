
/**
 * The jest.config.js file is used for configuring Jest, 
 * The modulePaths property tells Jest where it can find modules used inside of the code you're testing.
 */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	modulePathIgnorePatterns: ["<rootDir>/out/"]
};