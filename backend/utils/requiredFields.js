const ErrorResponse = require('./ErrorResponse')

module.exports = (fields) => {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] === undefined) return false
    if (typeof fields[i] === 'string' && fields[i].trim() === '') return false
  }
  return true
}
