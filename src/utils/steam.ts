export const isRunningInSteam = () => {
  // Check for Electron or Steam-specific environment variables/window properties
  return !!(window as any).process?.versions?.electron || !!(window as any).steamworks;
};
