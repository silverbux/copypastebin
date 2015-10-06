#!/usr/bin/env node
var confirm = require('confirm-cli')
var paste   = require('better-pastebin')
var cproc   = require('child_process')

if (process.env.PASTEBIN_APIKEY && process.env.PASTEBIN_APIKEY != '') {
  paste.setDevKey(process.env.PASTEBIN_APIKEY)

  var pasteBoard = function (callback) {
    cproc.exec('pbpaste', function (error, stdout, stderr) {
      if (error) {
        console.log('Error returned from pbpaste exec call')
        throw error
      } else {
        callback(stdout)
      }
    })
  }

  var clipBoard = function (data) {
    var proc = cproc.spawn('pbcopy')
    proc.stdin.write(data)
    proc.stdin.end()
  }

  pasteBoard(function (data) {
    var exampleData = data.substr(0, 100) + '...'

    console.log('------------------------------------------------------------')
    console.log(exampleData)
    console.log('------------------------------------------------------------')
    console.log('\n')
    confirm('Continue Pasting?', function () {
      console.log('Sending to pastebin...')
      paste.create({
        contents: data,
        name: '',
        privacy: '1',
        anonymous: true
      }, function (success, data) {
        if (success) {
          console.log(data)
          clipBoard(data)
        } else {
          console.log(data)
        }
      })
    }, function () {
      console.log('Cancelled by user.')
    })
  })
} else {
  console.log('[Error: Please set your pastebin API KEY. Use the following command and restart your terminal:]')
  console.log('launchctl setenv PASTEBIN_APIKEY "YOUR API KEY HERE"')
  console.log('\n')
}
