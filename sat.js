/**
 * Written by Fernando Castor in November/2017. 
 * Modified by Luna Mendes in November/2017.
 *
 * Licensed under MIT
 */
const fs = require('fs');

exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result; // two fields: isSat and satisfyingAssignment
};

function toBinary(num, state){
    // if(num == 0 && !state) return '0';
    if(num == 0){
        return state;
    }

    let digit = num % 2;
    let next = Math.floor(num / 2);

    state = digit + state;

    return toBinary(next, state);
}

function toAssignment(num, len) {
    let asBin = toBinary(num, '');
    console.log(asBin);
    let assignment = [];

    for(const b of asBin){
        if(b == '1'){
            assignment.push(true);
        }else{
            assignment.push(false);
        }    
    }

    console.log(assignment);

    while(assignment.length < len){
        assignment.unshift(false);
    }

    return assignment;
}

// Receives the current assignment and produces the next one
// Yes, I have the shittiest gambiarra(tm) for this.
function nextAssignment(oldState) {
    return oldState + 1;
}

// Apply an assignment of vars to the formula
function apply(state, variables, clauses) {
    let assignment = toAssignment(state, variables.length);
    console.log(assignment, variables, clauses);

    let clauseResults = [];
    for(const clause of clauses){
        
    }

    let result = clauseResults[0];
    for(const cResult of clauseResults.slice(1)){
        
    }
    return true;
}

// solve SAT for the given formula(in clauses, array)
// with the initial state of assignemnt
function doSolve(clauses, variables) {
    let isSat = false;

    let vars = variables.length;
    let maxState = Math.pow(2, vars);
    let currentState = 0;

    console.log(currentState, maxState);
 
    while (!isSat && currentState < maxState) {
 
        let result = apply(currentState, variables, clauses);
        if(result) {
            isSat = true;
            break;
        }

        // Continue until we finish all available assignemnts
        currentState = nextAssignment(currentState);
    }

    let result = {isSat, satisfyingAssignment: null};

    if (isSat) {
        result.satisfyingAssignment = toAssignment(currentState, vars);
    }

    return result;
}

// Check if the problem spec is actually valid
// given our parsing
function checkProblemSpecification(text, clauses, variables){
    let total_vars;
    let total_clauses;
    
    for(const line of text){
        if(!line) continue;

        let prefix = line.charAt(0);
        if(prefix == 'p') {
            let _problem = line.split(' ');
            total_vars = _problem[2];
            total_clauses = _problem[3];
        }
    }

    return (clauses.length == total_clauses) &&
        (variables.length == total_vars);
}

// Get the clauses from the CNF text
function readClauses(text) {
    let clauses = [];
    let current = [];

    for(const line of text){
        if(!line) continue;
        let prefix = line.charAt(0);

        // ignore comments and the problem description
        if(prefix == 'c' || prefix == 'p') {
            continue;
        }

        for(const varb of line.split(' ')){
            if(varb == '0'){
                clauses.push(current);
                current = [];
            } else {
                current.push(varb);
            }
        }
    }

    return clauses;
}

// Get variable data from the clause data
function readVariables(clauses) {
    let variables = [];
    
    clauses.map((clause) => {
        clause.map((variable) => {
            variable = Math.abs(parseInt(variable));
            variable = variable.toString();

            if(!variables.includes(variable)){
                variables.push(variable);
            }
        });
    });

    return variables;
}

function readFormula(fileName) {
    // Why encoding... WHY!?!?!?!
    let data = fs.readFileSync(fileName, {'encoding': 'utf-8'});
    let text = data.split('\n');

    let clauses = readClauses(text);
    let variables = readVariables(clauses);
    
    // Check if the problem actually makes sense
    // given its definition and the data we've read.
    let specOk = checkProblemSpecification(text, clauses, variables);

    let result = {
        invalid: true,
        clauses: [],
        variables: []
    };

    if (specOk) {
        result = {
            invalid: false,
            clauses,
            variables,
        };
    }

    console.log(result);

    return result;
}

