export function onlyNumbersMask(value: string) {
  return value !== null ? value.replace(/\D/g, '') : value;
}
