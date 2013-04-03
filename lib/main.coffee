Phone = require './Phone'

module.exports =
  Phono: Phono
  createClient: (key, opt={}) -> new Phone key, opt