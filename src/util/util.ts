export function uid() {
  // Example: 'abcde-12g45-678h0'
  return (
    Math.random().toString(36).substring(2, 7) +
    '-' +
    Math.random().toString(36).substring(2, 7) +
    '-' +
    Math.random().toString(36).substring(2, 7)
  );
}

export enum Color {
  White = 0,
  Red = 1,
  Green = 2,
  Yellow = 3,
  Blue = 4,
  Magenta = 5,
  Cyan = 6
}

export function log(message: any, color: Color = Color.White) {
  console.log(`\x1b[3${color};1m${message}\x1b[0m`);
}

export function clip(str: string, length: number) {
  if (str.length > length) {
    return str.substring(0, length) + '...';
  }
  return str;
}
