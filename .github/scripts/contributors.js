const fs = require('fs')
const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');
var page = fs.readFileSync('./contributors.html', {encoding: 'utf-8' })
var contributors = fs.readFileSync('./contributors.txt', {encoding: 'utf-8' }).split('\n')
const $ = cheerio.load(page)

console.log(process.env.GITHUB_EVENT_PATH)
var eventJson = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: 'utf-8' }));

$('#contributors').empty() // remove all names to start clean
for (let name of contributors) {
  if (name.length > 0) {
    for (let commit of eventJson.commits) {
      if ( !contributors.includes(commit.author.name) ) {
        contributors.push(commit.author.name)
      }
    } // TODO: add filter to ignore bots
    $('#contributors').append(`<li>${name}</li>\n`)
  }
}
// write out new contributors.html file
let newHtml = pretty($.html(), {ocd: true})
fs.writeFileSync('./contributors.html', newHtml, {encoding: 'utf-8'})
// write out contributors.md
let newTxt = "";
contributors.map( x => {
  if (x) {
    newTxt = newTxt.concat(`${x}\n`)
  }
})
fs.writeFileSync('./contributors.txt', newTxt, {encoding: 'utf-8'})
