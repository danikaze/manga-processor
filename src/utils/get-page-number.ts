export function getPageNumber(filename: string): number | undefined {
  const match = /(\d+)/.exec(filename);
  return match ? Number(match[0]) : undefined;
}
