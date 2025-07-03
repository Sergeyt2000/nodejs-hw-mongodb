export function getEnvVariable(variableName) {
    const value = process.env[variableName];
  if (value === undefined) {
    throw new Error(`Environment variable ${variableName} is not defined`);
  }
  return value;
}
