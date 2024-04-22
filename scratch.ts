
// import { icoHymnSchema, icoSongbookSchema, type icoSongbook, icoHymn } from './src/lib/songbook/types';
// import { parseSong } from './src/lib/songbook/parsers';


// import { renderSlide } from './src/lib/songbook/renderers';

// This was originally going to just be a converter from ICodeOkay's JSON format to the Hymnall format, but a perfect PowerPoint generator is far more useful! 
// function convertICOSongbook(icoSongbook: icoSongbook) {}

// this is a quokka PRO scratchpad. do with it what you will. (highly recommend getting the PRO license if only for the local imports)

import {exportSongPPTX} from './src/lib/songbook/renderers'

// exportSongPPTX(318, '1 SS 1 - '); 
// exportSongPPTX(485, '2 SS 2 - ') 
// exportSongPPTX(, '3 Extra - ') 
// exportSongPPTX(493, '4 SS Opening - ')
// exportSongPPTX(290, '5 Divine 1 - ') 
// exportSongPPTX(316, '6 Divine Opening - ') 
// exportSongPPTX(516, '7 Response - ')
// exportSongPPTX(403, 'Communion - ')
// exportSongPPTX(336, 'Communion - ');

// exportSongPPTX(0, 'Special - ',{
//   title: "The Lion of Judah",
//   verses: [
//     {type: "Verse", verseNo: '1' lines: []},
//     {type: "Chorus", lines: []},
//     {type: "Verse", lines: []},
//   ]
// })



// const setup = `For the song leader ____
// please write the titles of your hymns like this:
// Sabbath School
// 1 - 300 - fkwemfp
// 2 - 234 wef
// 3 Extra Song - 123 ofmwmef
// 4 Opening - 9 fwofeo

// Divine Service
// 5 - 002 namem ov v wimfoi

// Opening and Closing hymn chosen by: _____
// 6 Opening -90 Live out thy life
// 7 Closing - 450 Great is thy faithfulnes`

// const setup = `For the song leader ____
// please write the titles of your hymns like this:
// Sabbath School
// 1 - 
// 2 - 
// 3 Extra Song - 
// 4 Opening - 

// Divine Service
// 5 - 

// Opening and Closing hymn chosen by: _____
// 6 Opening - 
// 7 Closing - `

// const detectSong = new RegExp(/(?:- *)(\d{1,3})(.+)/g)

// const matches = setup.match(detectSong)

// matches


const d = new Date(Date.now())
.toLocaleDateString().split('/')
d.reverse()
const date = d.join('-')
console.log(date)


function dateFormat(nowDate: Date) {
  console.log(nowDate)
  return nowDate.toLocaleDateString().split('/').reverse().join('-')
}

const t = new Date('2024-04-21')
console.log(t.getDate())
console.log(t.getDay())
// const s = new Date(t.setDate(t.getDate() + (6 - t.getDay())))
// console.log(t.getDate())
// console.log(s.toLocaleDateString())

function nextSabbath(nowDate: Date) {
  const today = new Date(nowDate)
  console.log(today)
  const nextSabbath = new Date(today.setDate(today.getDate() + (6 - t.getDay())))
  console.log(today)
  return nextSabbath
}

console.log(nextSabbath(t))

// console.log(t.toLocaleDateString())

console.log(dateFormat(nextSabbath(Date.now())))