export function formatDisplayDate(value: string): string {
  const trimmedValue = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);
  const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  if (localMatch) {
    return trimmedValue;
  }

  return value;
}
