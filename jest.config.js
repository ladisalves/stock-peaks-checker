module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^.+\\.css$": "identity-obj-proxy", // Mock CSS imports
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
