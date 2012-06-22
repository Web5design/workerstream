var stream = require('stream')
var util = require('util')

function WorkerStream(path) {
  var me = this
  stream.Stream.call(me)
  this.readable = true
  this.writable = true
  me.worker = new Worker(path)
  me.worker.onmessage = me.workerMessage.bind(this)
  me.worker.onerror = me.workerError.bind(this)
}

util.inherits(WorkerStream, stream.Stream)

WorkerStream.prototype.workerMessage = function(e) {
  this.emit('data', e.data)
}

WorkerStream.prototype.workerError = function(err) {
  this.emit('error', err)
}

WorkerStream.prototype.write = function(data) {
  this.worker.postMessage(data)
  return true
}

WorkerStream.prototype.end = function() {
  this.emit('end')
}