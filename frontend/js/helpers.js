window.decodeHTMLEntities = (toDecode) => {
  console.log(toDecode)
  if (typeof toDecode === 'string') {
    // String
    return document.createElement('<textarea/>').innerHTML(toDecode).value
  }
  if (Array.isArray(toDecode)) {
    // Array
    return toDecode.map((el) => {
      return document.createElement('<textarea/>').innerHTML(el).value
    })
  }
  if (typeof toDecode === 'object') {
    // Object
    for (key in toDecode) {
      toDecode[key] = document
        .createElement('<textarea/>')
        .innerHTML(toDecode[key]).value
    }
    return toDecode
  }
  // Other...
  return toDecode
}
