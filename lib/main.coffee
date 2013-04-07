Phone = require './Phone'
Call = require './Call'

module.exports =
  Phone: Phone
  Call: Call
  createClient: (key, opt={}) -> new Phone key, opt