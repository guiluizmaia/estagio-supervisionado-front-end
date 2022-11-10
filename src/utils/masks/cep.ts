export function cepMask(value: string) {
  return value !== null
    ? value
        .replace(/\D/g, '') // substitui qualquer caractere que nao seja numero por nada
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(.\d{3})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    : value;
}
