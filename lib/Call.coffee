Emitter = require 'emitter'

class Call extends Emitter
  constructor: (@_call) ->
    @_call.bind
      onRing: => @emit "ring"
      onAnswer: => @emit "answer"
      onError: (e) => @emit "error", e
      onHangup: => @emit "hangup"

  id: -> @_call.id
  state: -> @_call.state
  energy: -> @_call.energy()

  press: (n) -> @_call.digit n
  pushToTalk: (b) -> @_call.pushToTalk b
  talking: (b) -> @_call.talking b
  mute: (b) -> @_call.mute b
  hold: (b) -> @_call.hold b
  volume: (n) -> @_call.volume n
  gain: (n) -> @_call.gain n

  answer: -> @_call.answer()
  hangup: -> @_call.hangup()


  ready: (fn) ->
    if @_ready
      fn()
    else
      @once "ready", fn

module.exports = Call