// Uzbek phone numbers, always shown as "+998 99 138 56 48".

const UZ_GROUPS = [2, 3, 2, 2]; // after the country code

/** Digits only (no "+"). Accepts anything a user might type or paste. */
export function phoneDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  else if (d.startsWith("8") && d.length === 10) d = d.slice(1); // 8 99 … local habit
  return d.slice(0, 9);
}

/** "+998 99 138 56 48" — partial input is formatted as far as it goes. */
export function formatPhone(input: string): string {
  const d = phoneDigits(input);
  if (!d) return "";
  const parts: string[] = [];
  let i = 0;
  for (const len of UZ_GROUPS) {
    if (i >= d.length) break;
    parts.push(d.slice(i, i + len));
    i += len;
  }
  return "+998 " + parts.join(" ");
}

/** "+998991385648" for tel: links and storage. */
export function phoneHref(input: string): string {
  const d = phoneDigits(input);
  return d ? `+998${d}` : "";
}

export function isValidPhone(input: string): boolean {
  return phoneDigits(input).length === 9;
}
