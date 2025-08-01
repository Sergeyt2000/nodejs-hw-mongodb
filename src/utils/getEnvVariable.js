export function getEnvVariable(variableName) {
    const value = process.env[variableName];
  if (value === 'undefined') {
    throw Error(`Environment variable ${variableName} is not defined`);
  }
  return value;
}
