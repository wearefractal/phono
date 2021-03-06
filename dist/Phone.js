// Generated by CoffeeScript 1.6.2
var Call, Emitter, Phone,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Emitter = require('emitter');

Call = require('./Call');

Phone = (function(_super) {
  __extends(Phone, _super);

  function Phone(apiKey, opt) {
    var _this = this;

    this.apiKey = apiKey;
    this.opt = opt != null ? opt : {};
    this._phono = $.phono({
      gateway: this.opt.gateway,
      apiKey: this.apiKey,
      onReady: function() {
        _this._ready = true;
        return _this.emit("ready");
      },
      onUnready: function() {
        _this._ready = false;
        return _this.emit("disconnect");
      },
      phone: {
        onIncomingCall: function(e) {
          return _this.emit("call", new Call(e.call));
        },
        onError: function(e) {
          return _this.emit("error", e);
        }
      },
      messaging: {
        onMessage: function(e) {
          return _this.emit('message', e.message);
        }
      }
    });
    this.proxy = this.opt.proxy;
  }

  Phone.prototype.connected = function() {
    return this._phono.connected();
  };

  Phone.prototype.number = function() {
    return this._phono.sessionId;
  };

  Phone.prototype.tones = function(b) {
    return this._phono.tones(b);
  };

  Phone.prototype.headset = function(b) {
    return this._phono.headset(b);
  };

  Phone.prototype.wideband = function(b) {
    return this._phono.wideband(b);
  };

  Phone.prototype.ringTone = function(s) {
    return this._phono.ringTone(s);
  };

  Phone.prototype.ringbackTone = function(s) {
    return this._phono.ringbackTone(s);
  };

  Phone.prototype.message = function(to, body) {
    this._phono.messaging.send(to, body);
    return this;
  };

  Phone.prototype.call = function(num, opt) {
    var call, _ref;

    if (opt == null) {
      opt = {};
    }
    if ((_ref = opt.headers) == null) {
      opt.headers = [];
    }
    if (this.proxy) {
      if (opt.caller) {
        opt.headers.push({
          name: "x-caller",
          value: opt.caller
        });
      }
      opt.headers.push({
        name: "x-callee",
        value: num
      });
      num = this.proxy;
    }
    call = this._phono.phone.dial(num, opt);
    return new Call(call, this);
  };

  Phone.prototype.ready = function(fn) {
    if (this._ready) {
      fn();
    } else {
      this.once("ready", fn);
    }
    return this;
  };

  return Phone;

})(Emitter);

module.exports = Phone;
