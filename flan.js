var EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits
  , emitter = new EventEmitter()
  , children = {}

/**
 * Adds **child** to the flan, involving it in any future `collapse`-s and `cascade`-s.
 *
 * @param  {ChildProcess|Worker} child The child process or cluster worker to be managed.
 * @return {Flan}
 */
emitter.add = add
function add(child) {
  var pid = child.pid || child.process.pid

  children[pid] = child
  child.on('exit', function () {
    delete children[pid]
  })

  return emitter
}

/**
 * Installs event listeners on `process` to cascade soft and hard collapses to all `add`-ed processes.
 *
 * @return {Flan}
 */
emitter.cascade = cascade
function cascade() {
  if (process.listeners('disconnect').indexOf(collapse) !== -1) {
    return emitter
  }

  process.on('disconnect', collapse)
  process.on('exit', collapse.bind(null, true))

  return emitter
}

/**
 * Installs event listeners on `cluster` to automatically `add` all future `cluster.fork`-ed Workers.
 *
 * @return {Flan}
 */
emitter.cluster = cluster
function cluster() {
  if (require('cluster').listeners('fork').indexOf(add) !== -1) {
    return emitter
  }

  require('cluster').on('fork', add)

  return emitter
}

/**
 * Manually initiate a collapse of this process and all `add`-d processes. Defaults to a "soft" collapse.
 *
 * @param  {Boolean} hard If true, perform a "hard" collapse. Otherwise, perform a "soft" collapse.
 * @return {Flan}
 */
emitter.collapse = collapse
function collapse(hard) {
  Object.keys(children).forEach(function (pid) {
    if (hard) {
      children[pid].kill()
    } else {
      children[pid].disconnect()
    }
  })

  return emitter
}

/*!
 * Event aliases
 */
process.on('disconnect', function () {
  emitter.emit('soft')
})
process.on('exit', function () {
  emitter.emit('hard')
})

module.exports = emitter
