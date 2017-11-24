/**
 * Written by Fernando Castor in November/2017. 
 * Modified by Luna Mendes in November/2017.
 *
 * Licensed under MIT
 */
const fs = require('fs')

exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result // two fields: isSat and satisfyingAssignment
}

// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment) {
    // TODO: implement
    return []
}

// solve SAT for the given formula(in clauses, array)
// with the initial state of assignemnt
function doSolve(clauses, initialAssignment) {
    let isSat = false
    let assignemnt = initialAssignment;

    // TODO: check if we are in the last assingment
    while (!isSat) {
        // TODO: evaluate the assingment with the clauses
        // set the result of evaluation to isSat, plus break the loop

        // Continue until we finish all available assignemnts
        assignment = nextAssignment(assignment)
    }

    let result = {isSat, satisfyingAssignment: null}

    if (isSat) {
        result.satisfyingAssignment = assignment
    }

    return result
}

// Check if the problem spec is actually valid
// given our parsing
function readProblemSpecification(text, clauses, variables){
    let problemData = []
    
    for(const line of text){
        if(!line) continue;

        let prefix = line.charAt(0)
        if(prefix == 'p') {
            // TODO: parse problem
        }
    }

    // TODO: better way
    if(!problemData[0]){
        return false;
    } else {
        return true;
    }

}

// Get the clauses from the CNF text
function readClauses(text) {
    let clauses = []

    for(const line of text){
        if(!line) continue;

        let prefix = line.charAt(0)

        // ignore comments and the problem description
        if(prefix != 'c' && prefix != 'p') {
            clauses.push(line)
        }
    }

    return clauses
}

// Get variable data from the clause data
function readVariables(clauses) {
    let variables = []
    
    clauses.map((clause) => {
        clause.split(' ').map((variable) => {
            variable = Math.abs(parseInt(variable))
            variable = variable.toString()

            if(!variables.includes(variable)){
                variables.push(variable)
            }
        })
    })

    return variables
}

function readFormula(fileName) {
    let data = fs.readFileSync(fileName, {'encoding': 'utf-8'})
    let text = data.split('\n')

    let clauses = readClauses(text)
    console.log('clauses', clauses)

    let variables = readVariables(clauses)
    console.log('variables', variables)
    
    // Check if the problem actually makes sense
    // given its definition and the data we've read.
    let specOk = checkProblemSpecification(text, clauses, variables)

    let result = {
        clauses: [],
        variables: []
    }

    if (specOk) {
        result = {
            clauses,
            variables,
        }
    }

    return result
}

