const sat = require('./sat.js');

let r = sat.solve(process.argv[2]);

if(r.isSat){
    console.log('is satisfiable!');
    console.log('assignment is:', r.satisfyingAssignment);
} else {
    console.log('not satisfiable');
}
