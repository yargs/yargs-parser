/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */

export function camelCase (str: string): string {
  // Handle the case where an argument is provided as camel case, e.g., fooBar.
  // by ensuring that the string isn't already mixed case:
  const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase()

  if (!isCamelCase) {
    str = str.toLowerCase()
  }

  if (str.indexOf('-') === -1 && str.indexOf('_') === -1) {
    return str
  } else {
    let camelcase = ''
    let nextChrUpper = false
    const leadingHyphens = str.match(/^-+/)
    for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
      let chr = str.charAt(i)
      if (nextChrUpper) {
        nextChrUpper = false
        chr = chr.toUpperCase()
      }
      if (i !== 0 && (chr === '-' || chr === '_')) {
        nextChrUpper = true
      } else if (chr !== '-' && chr !== '_') {
        camelcase += chr
      }
    }
    return camelcase
  }
}

export function decamelize (str: string, joinString?: string): string {
  const lowercase = str.toLowerCase()
  joinString = joinString || '-'
  let notCamelcase = ''
  for (let i = 0; i < str.length; i++) {
    const chrLower = lowercase.charAt(i)
    const chrString = str.charAt(i)
    if (chrLower !== chrString && i > 0) {
      notCamelcase += `${joinString}${lowercase.charAt(i)}`
    } else {
      notCamelcase += chrString
    }
  }
  return notCamelcase
}

export function looksLikeNumber (x: null | undefined | number | string): boolean {
  if (x === null || x === undefined) return false
  // if loaded from config, may already be a number.
  if (typeof x === 'number') return true
  // hexadecimal.
  if (/^0x[0-9a-f]+$/i.test(x)) return true
  // don't treat 0123 as a number; as it drops the leading '0'.
  if (/^0[^.]/.test(x)) return false
  return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)
}

// ANSI-C quoted strings are a bash-only feature and have the form $'some text'
// https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
//
// https://git.savannah.gnu.org/cgit/bash.git/tree/lib/sh/strtrans.c
export function parseAnsiCQuotedString (str: string): string {
  function unescapeChar (m: string): string {
    switch (m.charAt(1)) {
      case '\\':
        return '\\'
      case 'a':
        return '\a' // eslint-disable-line
      case 'b':
        return '\b'
      case 'e':
      case 'E':
        return '\x1B'
      case 'f':
        return '\f'
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      case 'v':
        return '\v'
      case "'":
        return "'"
      case '"':
        return '"'
      case '?':
        return '?'
      case 'c':
        // bash handles all characters by considering the first byte
        // of its UTF-8 input and can produce invalid UTF-8, whereas
        // JavaScript stores strings in UTF-16
        if (m.codePointAt(2)! > 127) {
          throw Error("non-ASCII control character in ANSI-C quoted string: '\\u{" + m.codePointAt(2)!.toString(16) + "}'")
        }
        // If this produces a 0x00 (null) character, it will cause bash to
        // terminate the string at that character, but we return the null
        // character in the result.
        return m[2] === '?' ? '\x7F' : String.fromCodePoint(m[2].toUpperCase().codePointAt(0)! & 0b00011111)
      case 'x':
      case 'u':
      case 'U':
        // Hexadecimal character literal
        // Unlike bash, this will error if the the code point is greater than 10FFFF
        return String.fromCodePoint(parseInt(m.slice(2), 16))
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        // Octal character literal
        return String.fromCodePoint(parseInt(m.slice(1), 8) % 256)
      default:
        // There must be a mis-match between ANSI_BACKSLASHES and the switch statement
        throw Error('unhandled character in ANSI-C escape code: ' + JSON.stringify(m))
    }
  }

  const ANSI_BACKSLASHES = /\\(\\|a|b|e|E|f|n|r|t|v|'|"|\?|[0-7]{1,3}|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{1,4}|U[0-9A-Fa-f]{1,8}|c.)/gs
  return str.substring(2, str.length - 1).replace(ANSI_BACKSLASHES, unescapeChar)
}
