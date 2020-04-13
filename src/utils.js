const fs = require('fs')
const path = require('path')

function validate_path(file_path) {
    try {
        let stat = fs.statSync(file_path)
        if (stat.isDirectory() || stat.isFIFO() || stat.isSocket() || stat.isCharacterDevice()) return false
    } catch(e) {
        return false
    }
    return true
}

function dir_is_package(file_path) {
    let current_dir = path.dirname(file_path)
    let files = fs.readdirSync(current_dir)

    for (f of files) {
        if (f === 'package.json') {
            let package_str = fs.readFileSync(path.join(current_dir, 'package.json'))
            let package = JSON.parse(package_str)
            if (package['main'] === path.basename(file_path)) return true
            else return false
        }
    }
    return false
}

function rmDir (dirPath, removeSelf) {
    if (removeSelf === undefined)
      removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    if (removeSelf)
      fs.rmdirSync(dirPath);
}

function replaceAll (str, search, replacement) {
  return str.split(search).join(replacement)
} 

module.exports = {
    validate_path, dir_is_package, rmDir, replaceAll
}
