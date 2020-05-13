const fs = require('fs')
const path = require('path')

function validatePath (filePath) {
  try {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory() || stat.isFIFO() || stat.isSocket() || stat.isCharacterDevice()) return false
  } catch (e) {
    return false
  }
  return true
}

function dirIsPackage (filePath) {
  const currentDir = path.dirname(filePath)
  const files = fs.readdirSync(currentDir)

  for (const f of files) {
    if (f === 'package.json') {
      const packageStr = fs.readFileSync(path.join(currentDir, 'package.json'))
      const packagePath = JSON.parse(packageStr)
      if (packagePath.main === path.basename(filePath)) return true
      else return false
    }
  }
  return false
}

function rmDir (dirPath, removeSelf) {
  if (removeSelf === undefined) { removeSelf = true }
  try { var files = fs.readdirSync(dirPath) } catch (e) { return }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i]
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      } else {
        rmDir(filePath)
      }
    }
  }
  if (removeSelf) { fs.rmdirSync(dirPath) }
}

function replaceAll (str, search, replacement) {
  return str.split(search).join(replacement)
}

module.exports = {
  validatePath, dirIsPackage, rmDir, replaceAll
}
