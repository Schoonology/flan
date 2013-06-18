# Flan

**Collapse nicely. Collapse like a flan.**

Flan is a sweet facade on top of a process.disconnect-based graceful collapse. Parent processes should call
`child.disconnect()` in lieu of `child.kill()` to shutdown children, and child processes should use
`process.on('disconnect', ...)` to perform graceful shutdown. Flan can help standardize that.

## What Flan Isn't

 * A replacement for `cluster`, `child_process`, or any parts thereof. They don't need replacing.
 * A wrapper for `cluster` or `child_process` to dynamically and/or automatically scale your Node server. Scale it
 yourself.
 * **Savory**. Then it would be _quiche_.

## Installation

```
npm install flan --save
```

## API

### Methods

#### `add(child)`

Adds **child** to the flan, involving it in any future `collapse`-s and `cascade`-s.

#### `cascade()`

Installs event listeners on `process` to cascade soft and hard collapses to all `add`-ed processes.

#### `cluster()`

Installs event listeners on `cluster` to automatically `add` all future `cluster.fork`-ed Workers.

#### `collapse(hard)`

Manually initiate a collapse of this process and all `add`-d processes. Defaults to a "soft" collapse.

### Events

#### `"soft"`

Perform a graceful collapse, like dropping a freshly-baked flan from a height of a few feet onto fresh linens: close
sockets, stop listening to servers, clear timers, etc.

#### `"hard"`

Perform a not-so-graceful (and immediate, thank you) collapse, like dropping a stale flan from a tall building onto the
unsuspecting sidewalk below.

## Examples

See the `test/fixtures` directory.

## License

Copyright (C) 2013 Michael Schoonmaker (michael.r.schoonmaker@gmail.com)

This project is free software released under the MIT/X11 license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
