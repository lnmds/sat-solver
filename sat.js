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
    let assignment = [];

    for(const b of asBin){
        if(b == '1'){
            assignment.push(true);
        }else{
            assignment.push(false);
        }    
    }

    while(assignment.length < len){
        assignment.unshift(false);
    }

    return assignment;
}

// Apply an assignment of vars to the formula
async function apply(state, variables, clauses) {
    // console.log(state, variables, clauses);

    let assignment = toAssignment(state, variables.length);
    let clauseResults = [];

    for(const clause of clauses){
        // each clause is an array of strings
        let processed = [];

        for(const variable of clause){
            let varInt = parseInt(variable);
            let abs = Math.abs(varInt);
            let inAssignment = assignment[abs - 1];

            if(varInt < 0){
                // NOT it
                processed.push(!inAssignment);
            } else {
                // keep it as is
                processed.push(inAssignment);
            }
        }
        
        let cResult = processed[0];
        for(const vResult of processed.slice(1)){
            cResult = cResult || vResult;
        }

        clauseResults.push(cResult);
    }

    // do the ANDs between clauses
    let result = clauseResults[0];
    for(const cResult of clauseResults.slice(1)){
        result = result && cResult;
    }

    return [result, state];
}

// solve SAT for the given formula(in clauses, array)
// with the initial state of assignemnt
function doSolve(clauses, variables) {
    let isSat = false;

    let vars = variables.length;
    let maxState = Math.pow(2, vars);
    let currentState = 0;

    while (!isSat && currentState <= maxState) {
        // Reduce I/O usage by not using
        // a fuckton of console.log
        if(currentState % 10000 == 0){
            console.log('state', currentState, '/', maxState);
        }

        // async, why not?
        let promises = [];
        for (let i = currentState; i <= currentState + 10; i++) {
            if(i > maxState) continue;

            let p = apply(i, variables, clauses);
            promises.push(p);
        }

        let pResults = Promise.all(promises);

        pResults.then((results) => {
            for (const result of results) {
                let val = result[0];
                let state = result[1];

                if (result) {
                    currentState = state;
                    isSat = true;
                }
            }
        })

        promises = [];

        // Continue until we finish all available assignemnts
        currentState += 10;
    }

    console.log('state finish:', currentState - 1);

    let result = {
        isSat,
        satisfyingAssignment: null
    };

    if (isSat) {
        result.satisfyingAssignment = toAssignment(currentState, vars);
    }

    return result;
}

// Check if the problem spec is actually valid
// given our parsing
function checkProblemSpecification(text, clauses, variables){
    let total_vars, total_clauses;
    for(const line of text){
        if(!line) continue;

        let prefix = line.charAt(0);
        if(prefix == 'p') {
            let _problem = line.split(' ');
            total_vars = parseInt(_problem[2]);
            total_clauses = parseInt(_problem[3]);
        }
    }

    console.log('clauses', clauses.length, total_clauses);
    console.log('variables', variables.length, total_vars);

    return (clauses.length == total_clauses) &&
        (variables.length == total_vars)
        /* this is here since the CNF file might not have the "p" line */
        || !(total_clauses && total_vars);
}

// Get the clauses from the CNF text
function readClauses(text) {
    let clauses = [];
    let current = [];

    for(const textLine of text){
        if(!textLine) continue;
        let line = textLine.replace(/\s+/g, ' ');
        let prefix = line.charAt(0);

        // ignore comments and the problem description
        if(prefix == 'c' || prefix == 'p') {
            continue;
        }

        for(const varb of line.split(' ')){
            // if its 0, we push the current clause into the list
            // of clauses, and work on the next one
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

            if(!variables.includes(variable) && !isNaN(variable)){
                variables.push(variable);
            }
        });
    });

    return variables;
}

function readFormula(fileName) {
    let data = fs.readFileSync(fileName, {encoding: 'utf-8'});
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

