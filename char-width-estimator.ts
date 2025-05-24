const short = "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
console.log(short.length)
const long = "WWWWWWWWWWWWWWWWWWW"
console.log(long.length)

console.log(short.length/long.length)

const mid = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
console.log(mid.length)

console.log(mid.length/long.length)
console.log(mid.length/short.length)

const lines = [
  "There in a nobler, sweeter song,",
  "I'll sing Thy power to save,",
  "When this poor lisping, stammering tongue",
  "Is ransomed from the grave,",
  "Is ransomed from the grave,",
  "Is ransomed from the grave;",
  "When this poor lisping, stammering tongue",
  "Is ransomed from the grave."
]


const thinChar = new RegExp(/[fijlt,';]/g)

const midChar = new RegExp(/[abcdeghknopqrsuvxyzIJL ]/g)

const wideChar = new RegExp(/[mwABCDEFGHKNOPQRSTUVXYZMW]/g)

lines.forEach(line => {
  line
  const thinW = line.match(thinChar)!.length
  const midW = line.match(midChar)!.length
  const wideW = line.match(wideChar)!.length

  const w = (thinW * 0.5) + midW + (wideW * 1.8)
  console.log(w,line)
  if (w > 34) {
    console.log('LONG')
  }
});

