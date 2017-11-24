const sat = require('./sat.js')

let r = sat.solve(process.argv[2])

console.log(r)
