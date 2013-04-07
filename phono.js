;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", function(exports, require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("phono/dist/main.js", function(exports, require, module){
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

});
require.register("phono/dist/Call.js", function(exports, require, module){
// Generated by CoffeeScript 1.6.2
var Call, Emitter,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Emitter = require('emitter');

Call = (function(_super) {
  __extends(Call, _super);

  function Call(_call, phone) {
    var _this = this;

    this._call = _call;
    this.phone = phone;
    this._call.bind({
      onRing: function() {
        return _this.emit("ring");
      },
      onAnswer: function() {
        return _this.emit("answer");
      },
      onError: function(e) {
        return _this.emit("error", e);
      },
      onHangup: function() {
        return _this.emit("hangup");
      }
    });
  }

  Call.prototype.id = function() {
    return this._call.id;
  };

  Call.prototype.state = function() {
    return this._call.state;
  };

  Call.prototype.energy = function() {
    return this._call.energy();
  };

  Call.prototype.press = function(n) {
    return this._call.digit(n);
  };

  Call.prototype.pushToTalk = function(b) {
    return this._call.pushToTalk(b);
  };

  Call.prototype.talking = function(b) {
    return this._call.talking(b);
  };

  Call.prototype.mute = function(b) {
    return this._call.mute(b);
  };

  Call.prototype.hold = function(b) {
    return this._call.hold(b);
  };

  Call.prototype.volume = function(n) {
    return this._call.volume(n);
  };

  Call.prototype.gain = function(n) {
    return this._call.gain(n);
  };

  Call.prototype.answer = function() {
    return this._call.answer();
  };

  Call.prototype.hangup = function() {
    return this._call.hangup();
  };

  Call.prototype.ready = function(fn) {
    if (this._ready) {
      return fn();
    } else {
      return this.once("ready", fn);
    }
  };

  return Call;

})(Emitter);

module.exports = Call;

});
require.register("phono/dist/Phone.js", function(exports, require, module){
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

});
require.alias("component-emitter/index.js", "phono/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("phono/dist/main.js", "phono/index.js");

if (typeof exports == "object") {
  module.exports = require("phono");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("phono"); });
} else {
  window["phono"] = require("phono");
}})();