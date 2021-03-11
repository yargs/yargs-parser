
/*
 * This is *only* for bash ANSI-C quoted strings - that is, strings that match the pattern $'some text'
 *
 * It's a fairly rare case but leads to the occasional bug. Only implementing the escaped string replacement will most
 * likely fix the vast majority of these bugs.
 *
 * Javascript strings already process some of these correctly (newlines, unicode strings, carriage returns, etc)
 *
 * Additional documentation
 * https://www.gnu.org/software/bash/manual/bash.html#ANSI_002dC-Quoting
 *
 * Original issue report: https://github.com/NickCarneiro/curlconverter/issues/207
 */
export function escapeAnsiString (str: string): string {
  return str
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\?/g, '?')
    .replace(/\\a/g, '\a') // eslint-disable-line
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\v/g, '\v')
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\')
}

const ANSI_REGEX = /\$('.*')/s
export function escapeAnsiCQuotes (stringArr: string[]): string[] {
  return (stringArr || []).map(str => {
    const match = (str || '').match(ANSI_REGEX)
    if (match && match.length > 1) {
      const matchGroup = match[1]
      return str.replace(ANSI_REGEX, escapeAnsiString(matchGroup))
    }
    return str
  })
}

// take an un-split argv string and tokenize it.
export function tokenizeArgString (argString: string | any[]): string[] {
  if (Array.isArray(argString)) {
    return escapeAnsiCQuotes(argString.map(e => typeof e !== 'string' ? e + '' : e))
  }

  argString = argString.trim()

  let i = 0
  let prevC: string | null = null
  let c: string | null = null
  let opening: string | null = null
  const args: string[] = []

  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c
    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      if (!(prevC === ' ')) {
        i++
      }
      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    if (c === opening) {
      opening = null
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return escapeAnsiCQuotes(args)
}
