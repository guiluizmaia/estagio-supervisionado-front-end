export function validateCpf(value: string) {
  value = value.replace(/[^\d]+/g, '');

  // Elimina CPFs invalidos conhecidos
  if (
    value.length !== 11 ||
    value === '00000000000' ||
    value === '11111111111' ||
    value === '22222222222' ||
    value === '33333333333' ||
    value === '44444444444' ||
    value === '55555555555' ||
    value === '66666666666' ||
    value === '77777777777' ||
    value === '88888888888' ||
    value === '99999999999'
  )
    return false;
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i += 1) add += parseInt(value.charAt(i), 0) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(value.charAt(9), 0)) return false;

  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i += 1)
    add += parseInt(value.charAt(i), 0) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(value.charAt(10), 0)) return false;
  return true;
}
