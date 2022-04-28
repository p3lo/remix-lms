export function generateUUID(digits: number) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let uuid = [];
  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join('');
}

export function getDate(date: Date) {
  const created = new Date(date);
  const day = created.getDate();
  const month = created.getMonth();
  const year = created.getFullYear();
  return month + 1 + '/' + day + '/' + year;
}
