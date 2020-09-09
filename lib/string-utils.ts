export function camelCase (str: string): string {
  str = str.toLocaleLowerCase()
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
        chr = chr.toLocaleUpperCase()
      }
      if (i !== 0 && (chr === '-' || chr === '_')) {
        nextChrUpper = true
        continue
      } else if (chr !== '-' && chr !== '_') {
        camelcase += chr
      }
    }
    return camelcase
  }
}

export function decamelize (str: string, joinString?: string): string {
  const lowercase = str.toLocaleLowerCase()
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
