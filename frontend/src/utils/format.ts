export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatStatus(status: string): string {
  return capitalize(status);
}
