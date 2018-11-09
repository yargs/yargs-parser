// take an un-split argv string and tokenize it.
module.exports = function (argString) {
  if (Array.isArray(argString)) return argString

  argString = argString.trim()

  var i = 0
  var prevC = null
  var c = null
  var opening = null
  var args = []
  // Opening and closing quotes around values that start with a dash
  var quote = null

  for (var ii = 0; ii < argString.length; ii++) {
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
      // If the previous element was a flag, and the quote is open, close the
      // open quote with a '"'
      if (args[i - 1].startsWith('--') && quote === 'open') {
        quote = null
        args[i] += '"'
      }
      continue
    } else if ((c === "'" || c === '"') && !opening) {
      // If the previous element was a flag, next character is a '-', prefix
      // the current element with a '"'
      // See: https://github.com/yargs/yargs-parser/issues/145
      if (args[i - 1].startsWith('--')) {
        if (argString.charAt(ii + 1) === '-') {
          if (!args[i]) args[i] = '"'
          quote = 'open'
        }
      }
      opening = c
      continue
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return args
}
