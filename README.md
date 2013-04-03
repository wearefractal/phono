![status](https://secure.travis-ci.org/wearefractal/phono.png?branch=master)

## Information

<table>
<tr> 
<td>Package</td><td>phono</td>
</tr>
<tr>
<td>Description</td>
<td>Wrapper around phono</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## WTF $

Sadly this library has a jQuery dependency. Why does something that makes phone calls need to be tied to a DOM manipulation toolkit? Don't ask me - send complaints to @phonosdk. Removing the dependency on jQuery would require a rewrite of phonosdk which this library uses.

## Usage

```coffee-script
phone = phono.createClient "API KEY"

phone.on "call", (call) ->
  call.answer()

phone.on "message", (msg) ->
  console.log "#{msg.from}: #{msg.body}"
  phone.message msg.from, "Stop talking to me"

phone.ready ->
  console.log "My number is #{phone.number()}"

  call = phone.call "480-555-5555"

  call.on "ring", ->
    console.log "Ringing..."

  call.on "answer", ->
    console.log "Answered"
    call.press 1 # press 1 digit

  call.on "end", ->
    console.log "Finished"
```

## Examples

You can view more examples in the [example folder.](https://github.com/wearefractal/phono/tree/master/examples)

## LICENSE

(MIT License)

Copyright (c) 2013 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
