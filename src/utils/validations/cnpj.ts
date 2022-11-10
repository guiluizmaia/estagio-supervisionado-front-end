export function validateCnpj(value: string) {
  value = value.replace(/[^\d]+/g, '');

  const factors: { [key: number]: number[] } = {
    0: [6, 5],
    1: [7, 6],
    2: [8, 7],
    3: [9, 8],
    4: [2, 9],
    5: [3, 2],
    6: [4, 3],
    7: [5, 4],
    8: [6, 5],
    9: [7, 6],
    10: [8, 7],
    11: [9, 8],
    12: [0, 9],
  };
  value = value.replace(/[^\d]+/g, '');

  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 12; i++) add += parseInt(value.charAt(i)) * factors[i][0];

  let rev = add % 11;
  if (rev === 10 || rev === 11) rev = 0;
  if (rev != parseInt(value.charAt(12))) return false;

  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 13; i++) add += parseInt(value.charAt(i)) * factors[i][1];
  rev = add % 11;
  if (rev === 10 || rev === 11) rev = 0;
  if (rev != parseInt(value.charAt(13))) return false;
  return true;
}
