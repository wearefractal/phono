Emitter = require 'emitter'
Call = require './Call'

class Phone extends Emitter
  constructor: (@apiKey, @opt={}) ->
    @_phono = $.phono
      gateway: @opt.gateway

      apiKey: @apiKey
      onReady: =>
        @_ready = true
        @emit "ready"

      onUnready: =>
        @_ready = false
        @emit "disconnect"

      phone:
        ringTone: @opt.ringTone
        ringback: @opt.ringbackTone

        onIncomingCall: (e) =>
          @emit "call", new Call e.call

        onError: (e) => @emit "error", e

      messaging:
        onMessage: (e) =>
          @emit 'message', e.message

  number: -> @_phono.sessionId
    
  message: (to, body) ->
    @_phono.messaging.send to, body
    return @

  call: (num) ->
    call = @_phono.phone.dial num
    return new Call call

  ready: (fn) ->
    if @_ready
      fn()
    else
      @once "ready", fn
    return @

module.exports = Phone