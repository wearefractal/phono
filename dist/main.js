// Generated by CoffeeScript 1.6.2
var Call, Phone;

Phone = require('./Phone');

Call = require('./Call');

module.exports = {
  Phone: Phone,
  Call: Call,
  createClient: function(key, opt) {
    if (opt == null) {
      opt = {};
    }
    return new Phone(key, opt);
  }
};
