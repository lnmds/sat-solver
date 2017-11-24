/**
 * This file should be placed at the node_modules sub-directory of the directory where you're 
 * executing it.
 * 
 * Written by Fernando Castor in November/2017. 
 * Modified by Luna Mendes in November/2017.
 *
 * Licensed under MIT
 */
var fs = require('fs')

exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result // two fields: isSat and satisfyingAssignment
}

// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment) {
    // implement here the code to produce the next assignment based on currentAssignment. 
    return newAssignment
}

function doSolve(clauses, assignment) {
    let isSat = false
    //while ((!isSat) && /* must check whether this is the last assignment or not*/ ) {
    while ((!isSat)) {
	// does this assignment satisfy the formula? If so, make isSat true. 

	// if not, get the next assignment and try again. 
	assignment = nextAssignment(assignment)
    }

    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
	result.satisfyingAssignment = assignment
    }

    return result
}

function readProblemSpecification(text, clauses, variables){

    // already allocate 2 spots
    let problemData = [undefined, undefined]
    
    for(var i = 0; i < text.length; i++){
	let line = text[i]

	// ignore blank lines lol
	if(!line.length) continue;

	let prefix = line.charAt(0)

	if(prefix == 'p') {
	    // TODO: parse problem
	}
    }

    if(!problemData[0]){
	return false;
    } else {
	return true;
    }

}

function readClauses(text)
{
    let clauses = []

    for(var i = 0; i < text.length; i++){
	let line = text[i]

	// ignore blank lines lol
	if(!line.length) continue;

	let prefix = line.charAt(0)

	if(prefix != 'c' && prefix != 'p') {
	    clauses = clauses.concat(line)
	}
    }

    return clauses
}

function readVariables(clauses) {
    let variables = []

    for(var i = 0; i < clauses.length; i++) {
	let clause = clauses[i]

	let vars = clause.split(' ')

	// this is really terrible, but what can I do?
	for(var j = 0; j < vars.length; j++) {
	    let variable = vars[j]
	    let variableAsInt = parseInt(variable)
	    variableAsInt = Math.abs(variableAsInt)
	    
	    if(!variables.includes(variableAsInt)){
		variables = variables.concat([variableAsInt])
	    }
	}
    }

    return variables
}

function readFormula(fileName) {
    let data = fs.readFileSync(fileName, {'encoding': 'utf-8'})
    let text = data.split('\n')

    let clauses = readClauses(text)
    console.log('clauses', clauses)

    let variables = readVariables(clauses)
    console.log('variables', variables)
    
    // In the following line, text is passed as an argument so that the function
    // is able to extract the problem specification.
    let specOk = checkProblemSpecification(text, clauses, variables)

    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
	result.clauses = clauses
	result.variables = variables
    }
    return result
}

function main(){
    // so it executes as a script
    let r = readFormula(process.argv[2])
    console.log(r)
}

main()
