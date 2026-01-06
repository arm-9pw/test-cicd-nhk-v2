// import { thaiDict } from './dict.formatted'

/**
 * Segments Thai text using dictionary-based matching (greedy longest match).
 * Returns an array of words found in the input text.
 */
export function segmentThai(text: string, dict: string[]): string[] {
  const arr: string[] = []
  for (let i = 0; i < text.length; ) {
    const sub: [string, number][] = []
    dict.forEach((v2) => {
      if (text[i] + (text[i + 1] || '') === v2[0] + (v2[1] || '')) sub.push([v2, v2.length])
    })
    sub.sort((a, b) => b[1] - a[1])
    let matched = false
    for (let ii = 0; ii < sub.length; ii++) {
      const l = sub[ii][1] + i
      const s = text.substring(i, l)
      if (sub[ii][0] === s) {
        i = l - 1
        arr.push(s)
        matched = true
        break
      }
    }
    if (!matched) {
      arr.push(text[i])
    }
    i++
  }
  return arr
}

/**
 * Inserts zero-width spaces at word boundaries for PDF/HTML line breaking.
 */
// export function insertZWS(text: string): string {
//   return segmentThai(text, thaiDict).join(' ');
// }

// CHECK if it is สระ ให้เลื่อนไปอีกหนึ่งตัว
export function insertZWS(text: string = ''): string {
  // Thai vowels (SARA) and diacritics (common)
  const specialChars = [
    '\u0E30', // ะ
    '\u0E31', // ั
    '\u0E32', // า
    '\u0E33', // ำ
    '\u0E34', // ิ
    '\u0E35', // ี
    '\u0E36', // ึ
    '\u0E37', // ื
    '\u0E38', // ุ
    '\u0E39', // ู
    '\u0E3A', // ฺ
    '\u0E47', // ็
    '\u0E48', // ่
    '\u0E49', // ้
    '\u0E4A', // ๊
    '\u0E4B', // ๋
    '\u0E4C', // ์
    '\u0E4D', // ํ
    '\u0E4E', // ๎
    '\u0E40', // เ
    '\u0E42', // โ
    '\u0E43', // ใ
    '\u0E44', // ไ
  ].map((c) => (c.length === 1 ? c : String.fromCharCode(parseInt(c.replace('\\u', ''), 16))))

  let result = ''
  let i = 0
  while (i < text.length) {
    let end = i + 50
    if (end < text.length && specialChars.includes(text[end])) {
      end++
    }
    result += text.slice(i, end) + ' '
    i = end
  }
  return result.trim()
}
